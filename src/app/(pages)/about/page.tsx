import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Here's My Guy | A Better Contractor Directory",
  description:
    "Built by a 15-year marketing veteran who saw the lead-gen industry break. Here's My Guy is a contractor directory built on reputation, not ad spend. Launching state by state.",
  alternates: {
    canonical: "https://heresmyguy.com/about",
  },
};

export default function AboutPage() {
  return (
    <div className="bg-[#f8f7f4] min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] text-white py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            I built the machine.
            <br />
            <span className="text-[#d4a853]">Now I&apos;m building the alternative.</span>
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="prose-custom">
          {/* Opening */}
          <p className="text-lg md:text-xl text-gray-800 leading-relaxed mb-8">
            For 15 years I was in the machine. I was the head of marketing and sales
            for four solar contracting companies. During that time, myself and my team
            drove sales over $150 million all told. More than $100 million of that was
            in residential sales. I&apos;ve sat at a thousand kitchen tables. I still
            have every customer I&apos;ve ever sold to in my phone. As a manager, I
            understand the need for leads. Leads make the business run.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            And for a long time, lead-gen platforms were the smart play. They were
            cheaper than running your own internal marketing. Buy leads, close jobs,
            grow. Simple.
          </p>

          <p className="text-xl md:text-2xl font-bold text-[#1a1a2e] my-10">
            Then the math flipped.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Every year the prices crept up. The lead quality went down. And the
            platforms kept spending. Not to help contractors, but to dominate the ad
            space so contractors couldn&apos;t afford to compete on their own. Now
            you&apos;re paying more for worse leads and getting priced out of running
            your own marketing. The system doesn&apos;t work for contractors anymore.
            It works for the system.
          </p>

          <p className="text-gray-700 leading-relaxed mb-12">
            I started Here&apos;s My Guy because I&apos;ve seen this from every angle.
            The kitchen table, the marketing budget, the invoice for leads, half of
            which never answered the phone. I know it can be better.
          </p>

          {/* What we're building */}
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-6">
            What we&apos;re building
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            A contractor directory built on a simple idea: the contractor is not a
            commodity, and to the homeowner, you are not a lead.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            We don&apos;t sell your info to a dozen companies. We don&apos;t blast
            homeowners with spam. And we don&apos;t spend ad money competing against
            the contractors who partner with us. If you&apos;re on our platform, we
            won&apos;t outbid you on Google.
          </p>

          <p className="text-gray-700 leading-relaxed mb-12">
            We&apos;re not pretending this runs on goodwill. We&apos;ll offer featured
            listings and premium placement. But we&apos;re building this as a
            partnership, not a toll booth. Get in early as a founding member and help
            shape what this thing becomes.
          </p>

          {/* For homeowners */}
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-6">
            For homeowners
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            You deserve better than filling out a form and getting ambushed by your
            phone. Here&apos;s My Guy is simple. Browse real contractors, see real
            information, make your own call. That&apos;s it.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            And when you find your guy, pick up the phone and call them. Tell them
            you found them on Here&apos;s My Guy. That&apos;s how this works. Your
            call helps them, their quality helps you, and the whole thing gets better.
          </p>

          <p className="text-gray-700 leading-relaxed mb-12">
            We want to hear from you too. Who&apos;s good. Who showed up on time.
            Who you&apos;d call again. Your voice is what makes this directory worth
            something.
          </p>

          {/* For contractors */}
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-6">
            For contractors
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Our goal is simple. Get you on page one of Google. A rising tide raises
            all ships, and together we make it happen.
          </p>

          <p className="text-gray-700 leading-relaxed mb-12">
            You shouldn&apos;t have to rent your reputation on someone else&apos;s
            platform and then compete with their ad budget too. Own your profile.
            Show your work. Let the quality speak.
          </p>

          {/* The rollout */}
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-6">
            The rollout
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            We&apos;re launching state by state based on demand. We&apos;d rather
            build each market right than rush a nationwide rollout and become another
            junk directory nobody trusts.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            And here&apos;s what makes us different. You decide where we go next.
            Contractors and homeowners tell us which markets to launch. This isn&apos;t
            a boardroom decision. It&apos;s yours.
          </p>

          <p className="text-gray-700 leading-relaxed">
            If your state isn&apos;t live yet, vote to bring us there.
          </p>
        </div>
      </article>

      {/* CTA */}
      <section className="bg-[#1a1a2e] text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#browse-states"
              className="bg-[#d4a853] text-[#1a1a2e] px-8 py-4 rounded-lg font-bold text-center hover:bg-[#e5b863] transition-colors"
            >
              See Our Live States
            </Link>
            <Link
              href="/"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-center hover:bg-white/10 transition-colors"
            >
              Vote for Your State
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
