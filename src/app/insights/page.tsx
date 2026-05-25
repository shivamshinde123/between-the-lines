import { SiteFrame } from "@/components/site-frame";

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

export default function InsightsPage() {
  return (
    <SiteFrame
      eyebrow="Insights placeholder"
      title="Patterns your future library will reveal"
      description="The full insights page will synthesize your reading voice and recurring concerns across books. This placeholder locks the route and content framing for Stage 7."
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
