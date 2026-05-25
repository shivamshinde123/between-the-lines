export const plannedRoutes = [
  {
    href: "/",
    label: "Library",
    description: "Alphabetized book list, search, and your future reading shelf.",
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
    href: "/books/sample-book",
    label: "Book Detail",
    description: "Thought entries, timestamps, and the per-book reflection zone.",
  },
  {
    href: "/insights",
    label: "Insights",
    description: "Cross-library patterns and recurring themes over time.",
  },
] as const;

export const stageMilestones = [
  "Scaffold the Next.js application and shared route shell.",
  "Add environment conventions for Supabase, DeepSeek, and Vercel.",
  "Install baseline test tooling before feature work begins.",
  "Keep the repository deployment-ready from the first stage.",
] as const;

export function hasUniqueRoutes() {
  return new Set(plannedRoutes.map((route) => route.href)).size === plannedRoutes.length;
}
