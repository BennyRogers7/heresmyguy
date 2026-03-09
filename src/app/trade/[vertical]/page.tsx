import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import Breadcrumbs from "@/components/Breadcrumbs";

// ISR: Revalidate every hour
export const revalidate = 3600;

interface VerticalPageProps {
  params: Promise<{ vertical: string }>;
}

// Pre-generate all vertical pages (small number)
export async function generateStaticParams() {
  const verticals = await prisma.vertical.findMany({
    select: { slug: true },
  });
  return verticals.map((v) => ({ vertical: v.slug }));
}

export async function generateMetadata({ params }: VerticalPageProps): Promise<Metadata> {
  const { vertical: verticalSlug } = await params;
  const vertical = await prisma.vertical.findUnique({
    where: { slug: verticalSlug },
  });

  if (!vertical) {
    return { title: "Not Found" };
  }

  const title = `Find ${vertical.name} Near You | Here's My Guy`;
  const description = `Browse ${vertical.name.toLowerCase()} across the United States. Find trusted local ${vertical.name.toLowerCase()} with reviews and ratings.`;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function VerticalPage({ params }: VerticalPageProps) {
  const { vertical: verticalSlug } = await params;

  const vertical = await prisma.vertical.findUnique({
    where: { slug: verticalSlug },
  });

  if (!vertical) {
    notFound();
  }

  // Get states that have businesses in this vertical
  const statesWithBusinesses = await prisma.business.groupBy({
    by: ["state"],
    where: { verticalSlug },
    _count: { state: true },
    orderBy: { state: "asc" },
  });

  // Get state info for full names
  const stateAbbreviations = statesWithBusinesses.map((s) => s.state);
  const states = await prisma.state.findMany({
    where: { abbreviation: { in: stateAbbreviations } },
  });

  const stateMap = new Map(states.map((s) => [s.abbreviation, s]));

  const statesData = statesWithBusinesses.map((s) => ({
    abbreviation: s.state,
    name: stateMap.get(s.state)?.name || s.state,
    slug: stateMap.get(s.state)?.slug || s.state.toLowerCase(),
    count: s._count.state,
  }));

  const totalBusinesses = statesData.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="bg-[#f8f7f4] min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] text-white py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Breadcrumbs
            variant="light"
            items={[
              { label: "Home", href: "/" },
              { label: vertical.name },
            ]}
          />

          <div className="mt-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{vertical.icon}</span>
              <h1 className="text-3xl md:text-4xl font-bold">{vertical.name}</h1>
            </div>
            <p className="text-gray-300 max-w-2xl">
              {vertical.description}. Browse {totalBusinesses.toLocaleString()} {vertical.name.toLowerCase()} across {statesData.length} states.
            </p>
          </div>
        </div>
      </section>

      {/* States Grid */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-6">
            Browse {vertical.name} by State
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {statesData.map((state) => (
              <Link
                key={state.abbreviation}
                href={`/${state.slug}`}
                className="bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-[#d4a853] hover:shadow-sm transition-all flex justify-between items-center group"
              >
                <span className="font-medium text-[#1a1a2e] group-hover:text-[#d4a853] transition-colors">
                  {state.name}
                </span>
                <span className="text-sm text-gray-400">
                  {state.count} {vertical.name.toLowerCase()}
                </span>
              </Link>
            ))}
          </div>

          {statesData.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No {vertical.name.toLowerCase()} found yet. Check back soon!
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1a1a2e] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Are you a {vertical.nameSingular.toLowerCase()}?
          </h2>
          <p className="text-gray-300 mb-6">
            Claim your free listing and get found by customers in your area.
          </p>
          <Link
            href="/claim-listing"
            className="inline-block bg-[#d4a853] text-[#1a1a2e] px-8 py-3 rounded-lg font-bold hover:bg-[#e5b863] transition-colors"
          >
            Claim Your Free Listing
          </Link>
        </div>
      </section>
    </div>
  );
}
