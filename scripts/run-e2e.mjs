import { spawn } from "node:child_process";

const appUrl = "http://localhost:3000";
const isWindows = process.platform === "win32";
const npmCommand = isWindows ? "cmd" : "npm";
const npmArgs = isWindows
  ? ["/c", "npm.cmd", "run", "start", "--", "--hostname", "localhost", "--port", "3000"]
  : ["run", "start", "--", "--hostname", "localhost", "--port", "3000"];
const npxCommand = isWindows ? "cmd" : "npx";
const npxArgs = isWindows ? ["/c", "npx.cmd", "playwright", "test"] : ["playwright", "test"];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return;
      }
    } catch {
      // Ignore connection failures while the app is booting.
    }

    await sleep(500);
  }

  throw new Error(`Timed out waiting for ${url}`);
}

async function stopServer(server) {
  if (!server.pid) {
    return;
  }

  if (isWindows) {
    server.kill();

    await new Promise((resolve, reject) => {
      const killer = spawn("taskkill", ["/pid", String(server.pid), "/t", "/f"], {
        stdio: "ignore",
      });

      killer.on("exit", (code) => {
        if (code === 0 || code === 1 || code === 128) {
          resolve();
          return;
        }

        reject(new Error(`taskkill exited with code ${code}`));
      });

      killer.on("error", reject);
    });

    return;
  }

  server.kill("SIGTERM");
}

async function main() {
  const server = spawn(
    npmCommand,
    npmArgs,
    {
      env: process.env,
      stdio: "inherit",
    },
  );

  let exitCode = 1;

  try {
    await waitForServer(appUrl, 30_000);

    exitCode = await new Promise((resolve, reject) => {
      const tests = spawn(npxCommand, npxArgs, {
        env: process.env,
        stdio: "inherit",
      });

      tests.on("exit", (code) => resolve(code ?? 1));
      tests.on("error", reject);
    });
  } finally {
    await stopServer(server);
  }

  process.exit(exitCode);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
