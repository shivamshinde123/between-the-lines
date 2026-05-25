const missingValue = (name: string) => {
  throw new Error(`Missing required environment variable: ${name}`);
};

export function getPublicSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  return {
    publishableKey: publishableKey ?? missingValue("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    url: url ?? missingValue("NEXT_PUBLIC_SUPABASE_URL"),
  };
}

export function getServiceRoleKey() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return serviceRoleKey ?? missingValue("SUPABASE_SERVICE_ROLE_KEY");
}

export function getDeepseekApiKey() {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  return apiKey ?? missingValue("DEEPSEEK_API_KEY");
}
