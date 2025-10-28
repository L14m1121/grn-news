"use client";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ec] dark:bg-[#0a0a0a] text-[#111] dark:text-[#f1f1f1] font-serif flex flex-col items-center">
      {/* 🌿 HERO */}
      <section className="w-full text-center py-20 border-b border-gray-300 dark:border-gray-700">
        <h1 className="text-5xl font-extrabold mb-4">
          <span className="text-[#00a86b]">About</span> Green Rush Nation
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          Green Rush Nation is your hub for cannabis news, culture, and community.
          Our mission is to highlight stories that matter—from legalization updates
          and scientific research to business innovation and social justice.  
        </p>
      </section>

      {/* 🧭 WHO WE ARE */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <img
          src="/jpg.png"
          alt="Green Rush Nation Team"
          className="rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 object-cover w-full h-80"
        />
        <div>
          <h2 className="text-3xl font-bold mb-4 text-[#00a86b]">Who We Are</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            We’re journalists, creators, and cannabis advocates driven by one goal:
            to elevate real stories from every corner of the industry.  
            Green Rush Nation was built to bridge the gap between culture and news,
            showing the people, the passion, and the progress that fuel the movement.
          </p>
          <Link
            href="/subscribe"
            className="inline-block bg-[#00a86b] hover:bg-[#00905e] text-white px-6 py-3 rounded-md font-semibold transition"
          >
            Subscribe to GRN Daily
          </Link>
        </div>
      </section>

      {/* 📈 OUR IMPACT */}
      <section className="w-full bg-[#111] dark:bg-[#111] text-white py-20 text-center">
        <h2 className="text-3xl font-bold mb-4 text-[#00ff9d]">Our Reach</h2>
        <p className="max-w-3xl mx-auto text-gray-300 mb-10">
          Every month, Green Rush Nation connects thousands of readers and listeners
          to authentic cannabis stories through our news, podcast, and event coverage.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-4xl mx-auto">
          <div>
            <p className="text-4xl font-extrabold text-[#00a86b]">200K+</p>
            <p className="text-sm text-gray-400">Monthly Readers</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-[#00a86b]">50+</p>
            <p className="text-sm text-gray-400">Brand Partners</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-[#00a86b]">12</p>
            <p className="text-sm text-gray-400">Media Verticals</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-[#00a86b]">100%</p>
            <p className="text-sm text-gray-400">Independent</p>
          </div>
        </div>
      </section>

      {/* 🧭 CALL TO ACTION */}
      <section className="py-16 text-center">
        <h3 className="text-3xl font-bold mb-4">Join the Movement</h3>
        <p className="max-w-2xl mx-auto text-gray-700 dark:text-gray-300 mb-8">
          Green Rush Nation isn’t just a publication—it’s a community.
          Stay connected to the future of cannabis by joining our newsletter
          and following us on social platforms.
        </p>
        <div className="flex justify-center gap-6 flex-wrap">
          <Link
            href="/subscribe"
            className="px-6 py-3 bg-[#00a86b] text-white rounded-md hover:bg-[#00905e] transition"
          >
            Subscribe
          </Link>
          <Link
            href="/advertising"
            className="px-6 py-3 border border-[#00a86b] text-[#00a86b] rounded-md hover:bg-[#00a86b]/10 transition"
          >
            Partner With Us
          </Link>
          <Link
            href="/news"
            className="px-6 py-3 bg-[#111] dark:bg-[#222] text-white rounded-md hover:bg-[#333] transition"
          >
            Back to Newspaper
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
