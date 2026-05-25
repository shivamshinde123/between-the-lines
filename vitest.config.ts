import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    exclude: [...configDefaults.exclude, "tests/e2e/**", "stage1-scaffold/**"],
    setupFiles: ["./src/test/setup.ts"],
  },
});
