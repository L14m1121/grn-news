"use client";
import { useState } from "react";
import Link from "next/link";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../lib/firebase";


export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubscribe(e) {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await addDoc(collection(db, "newsletter"), {
        email,
        joinedAt: new Date(),
      });
      setSubmitted(true);
      setError("");
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f4ec] dark:bg-[#0a0a0a] text-[#111] dark:text-[#f1f1f1] font-serif flex flex-col items-center">
      {/* 🌿 HERO SECTION */}
      <section className="w-full text-center py-20 border-b border-gray-300 dark:border-gray-700">
        <h1 className="text-5xl font-extrabold mb-4 text-[#00a86b]">
          Subscribe to GRN Daily
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          Get daily cannabis news directly in your inbox — stay informed about
          legislation, business, culture, and innovation across the nation.
        </p>
      </section>

      {/* 💌 SUBSCRIBE FORM */}
      <section className="max-w-xl w-full text-center px-6 py-16">
        {!submitted ? (
          <>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col items-center gap-5"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full max-w-md border border-gray-400 dark:border-gray-700 rounded-md px-4 py-3 text-center text-gray-900 dark:text-gray-100 bg-transparent focus:outline-none focus:ring-2 focus:ring-[#00a86b]"
              />

              <button
                type="submit"
                className="bg-[#00a86b] hover:bg-[#00905e] text-white px-8 py-3 rounded-md font-semibold transition"
              >
                Subscribe
              </button>
            </form>

            {error && (
              <p className="text-red-500 mt-4 text-sm italic">{error}</p>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold text-[#00a86b]">
              You’re all set!
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Thanks for joining the GRN Daily newsletter.
            </p>
            <Link
              href="/news"
              className="mt-4 px-6 py-3 bg-[#111] dark:bg-[#222] text-white rounded-md hover:bg-[#333] transition"
            >
              Back to Newspaper
            </Link>
          </div>
        )}
      </section>

      {/* 🧭 STAY CONNECTED */}
      <section className="w-full bg-[#111] text-white text-center py-20">
        <h2 className="text-3xl font-bold mb-4 text-[#00ff9d]">
          Stay Connected
        </h2>
        <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
          Follow us for the latest cannabis stories and updates in real time.
        </p>

        <div className="flex justify-center gap-8">
          {[
            ["instagram.pdf", "Instagram", "https://instagram.com/greenrushnation"],
            ["Tiktok.png", "TikTok", "https://tiktok.com/@greenrushnation"],
            ["Youtube.jpg", "YouTube", "https://youtube.com/@greenrushnation"],
            ["X.jpg", "X", "https://x.com/greenrushnation"],
          ].map(([icon, alt, link]) => (
            <a key={alt} href={link} target="_blank" rel="noopener noreferrer">
              <img
                src={`/icons/${icon}`}
                alt={alt}
                className="w-9 h-9 rounded-full border border-[#00a86b]/50 bg-black p-1 hover:bg-[#00a86b]/20 hover:scale-110 transition"
              />
            </a>
          ))}
        </div>
      </section>

      {/* ⚖️ FOOTER */}
      <footer className="w-full bg-[#0a0a0a] text-gray-400 py-6 text-center text-sm">
        © {new Date().getFullYear()} Green Rush Nation Media LLC — All Rights Reserved.
      </footer>
    </main>
  );
}
