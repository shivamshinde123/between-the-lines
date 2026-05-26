export const plannedRoutes = [
  {
    href: "/",
    label: "Library",
    description: "Alphabetized books, live search, and your private reading shelf.",
  },
  {
    href: "/login",
    label: "Login",
    description: "Username-first sign-in for your private reading space.",
  },
  {
    href: "/signup",
    label: "Signup",
    description: "Create a private library account without exposing email in the UI.",
  },
  {
    href: "/insights",
    label: "Insights",
    description: "Cross-library patterns and recurring themes over time.",
  },
] as const;

export const stageMilestones = [
  "Scaffold the Next.js application and shared route shell.",
  "Establish the Supabase data platform and private storage rules.",
  "Add username-based authentication with guarded private routes.",
  "Make the private library usable with book CRUD and cover uploads.",
  "Complete the journal core with chronological thought entry CRUD.",
] as const;

export function hasUniqueRoutes() {
  return new Set(plannedRoutes.map((route) => route.href)).size === plannedRoutes.length;
}
