"use client";
import Link from "next/link";

export default function AdvertisingPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ec] dark:bg-[#0a0a0a] text-[#111] dark:text-[#f1f1f1] font-serif flex flex-col items-center">
      {/* 🌿 HERO */}
      <section className="w-full text-center py-20 border-b border-gray-300 dark:border-gray-700">
        <h1 className="text-5xl font-extrabold mb-4 text-[#00a86b]">
          Sponsorship & Advertising
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          Partner with <span className="font-semibold">Green Rush Nation</span>{" "}
          to promote your brand to a trusted cannabis audience.  
          We offer sponsorships, featured stories, and ad placements across our
          growing media network — from digital campaigns to podcast exposure.
        </p>
      </section>

      {/* 🧭 AD OPTIONS */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          {
            title: "Brand Spotlight",
            desc: "Feature your company or product with a dedicated article and media coverage across GRN News and GRN Podcast.",
          
          },
          {
            title: "Sponsored Series",
            desc: "Run a recurring series that highlights your message across multiple GRN platforms — perfect for ongoing exposure.",
      
          },
          {
            title: "Event & Podcast Ads",
            desc: "Place your brand within GRN Events, live coverage, or podcast sponsorships — reach audiences both local and national.",
      
          },
        ].map(({ title, desc, price }, i) => (
          <div
            key={i}
            className="p-8 bg-white/70 dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-lg transition text-center"
          >
            <h2 className="text-2xl font-bold mb-3 text-[#00a86b]">{title}</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              {desc}
            </p>
            <p className="text-sm italic text-gray-500 dark:text-gray-400 mb-4">
              {price}
            </p>
            <a
              href="mailto:ads@greenrushnation.com"
              className="inline-block bg-[#00a86b] text-white px-6 py-2 rounded-md hover:bg-[#00905e] transition"
            >
              Contact Us
            </a>
          </div>
        ))}
      </section>

      {/* 💡 WHY ADVERTISE */}
      <section className="w-full bg-[#111] text-white py-20 text-center">
        <h2 className="text-3xl font-bold mb-4 text-[#00ff9d]">
          Why Advertise with GRN?
        </h2>
        <p className="max-w-3xl mx-auto text-gray-400 mb-10 leading-relaxed">
          Green Rush Nation provides unmatched visibility in the cannabis space,
          combining editorial credibility with cultural authenticity.  
          Your brand joins a movement, not just a market.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-4xl mx-auto">
          {[
            ["🌿", "Cannabis-Only Audience"],
            ["🎧", "Podcast Reach"],
            ["📈", "Monthly Growth"],
            ["🤝", "Collaborative Campaigns"],
          ].map(([icon, text], i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-4xl mb-2">{icon}</span>
              <p className="text-sm text-gray-300">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🧭 CTA */}
      <section className="text-center py-16">
        <h3 className="text-3xl font-bold mb-4">Ready to Collaborate?</h3>
        <p className="max-w-2xl mx-auto text-gray-700 dark:text-gray-300 mb-8">
          Let’s build something impactful together. Reach out today to start
          your campaign or request a custom media kit.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <a
            href="mailto:ads@greenrushnation.com"
            className="px-6 py-3 bg-[#00a86b] text-white rounded-md hover:bg-[#00905e] transition"
          >
            Email Our Ad Team
          </a>
          <Link
            href="/news"
            className="px-6 py-3 border border-[#00a86b] text-[#00a86b] rounded-md hover:bg-[#00a86b]/10 transition"
          >
            Back to News
          </Link>
        </div>
      </section>

      {/* ⚖️ FOOTER */}
      <footer className="w-full bg-[#0a0a0a] text-gray-400 py-6 text-center text-sm">
        © {new Date().getFullYear()} Green Rush Nation Media LLC — All Rights Reserved.
      </footer>
    </main>
  );
}
