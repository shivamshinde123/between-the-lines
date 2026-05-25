import { SiteFrame } from "@/components/site-frame";
import { requireViewer } from "@/lib/auth/session";

type BookPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BookPage({ params }: BookPageProps) {
  const viewer = await requireViewer();
  const { slug } = await params;

  return (
    <SiteFrame
      eyebrow="Private book page"
      title="A book page that will gather your thoughts"
      description="This protected route will hold book metadata, thought entries, and the per-book reflection flow once the CRUD stages land."
      viewer={viewer}
    >
      <section className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="panel rounded-[28px] p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.22em] text-muted">
            Sample route slug
          </p>
          <p className="mt-4 text-2xl font-semibold">{slug}</p>
          <p className="mt-4 text-sm leading-6 text-muted">
            Real book loading and ownership checks arrive in later stages.
          </p>
        </div>

        <div className="page-grid">
          <div className="panel rounded-[28px] p-6 md:p-8">
            <h2 className="text-xl font-semibold">Thought entries</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Timestamped entries will be listed chronologically here in Stage 5.
            </p>
          </div>

          <div className="panel rounded-[28px] p-6 md:p-8">
            <h2 className="text-xl font-semibold">The Book Changed You. How?</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              DeepSeek-powered before-and-after reflection arrives in Stage 6.
            </p>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
