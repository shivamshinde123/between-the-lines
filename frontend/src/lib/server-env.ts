import "server-only";

const missingValue = (name: string) => {
  throw new Error(`Missing required environment variable: ${name}`);
};

export function getServiceRoleKey() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return serviceRoleKey ?? missingValue("SUPABASE_SERVICE_ROLE_KEY");
}

export function getDeepseekApiKey() {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  return apiKey ?? missingValue("DEEPSEEK_API_KEY");
}
