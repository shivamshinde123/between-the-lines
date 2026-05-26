import { SiteFrame } from "@/components/site-frame";
import { requireViewer } from "@/lib/auth/session";

const insightCards = [
  {
    title: "Your Reading Voice Over Time",
    description:
      "This section will examine how your tone and thinking change across all entries in your library.",
  },
  {
    title: "The Thought You Keep Having",
    description:
      "This section will surface the recurring idea or concern that keeps returning across books.",
  },
] as const;

export default async function InsightsPage() {
  const viewer = await requireViewer();

  return (
    <SiteFrame
      eyebrow="Private insights"
      title="Patterns your future library will reveal"
      description="This protected area will eventually synthesize how your reading voice evolves across the books in your private library."
      viewer={viewer}
    >
      <section className="grid gap-5 md:grid-cols-2">
        {insightCards.map((card) => (
          <article key={card.title} className="panel rounded-[28px] p-6 md:p-8">
            <h2 className="text-2xl font-semibold">{card.title}</h2>
            <p className="mt-4 text-sm leading-6 text-muted">
              {card.description}
            </p>
          </article>
        ))}
      </section>
    </SiteFrame>
  );
}

