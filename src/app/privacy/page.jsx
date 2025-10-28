"use client";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ec] dark:bg-[#0a0a0a] text-[#111] dark:text-[#f1f1f1] font-serif flex flex-col items-center">
      {/* 📰 HEADER */}
      <section className="w-full text-center py-20 border-b border-gray-300 dark:border-gray-700">
        <h1 className="text-5xl font-extrabold mb-4 text-[#00a86b]">
          Privacy Policy
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          We value your trust. Below is a transparent overview of how Green Rush Nation handles information to keep your privacy protected.
        </p>
      </section>

      {/* 🔒 MAIN CONTENT */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-200 leading-relaxed space-y-10">
        <div>
          <h2 className="text-2xl font-bold text-[#00a86b] mb-2">
            Information We Collect
          </h2>
          <p>
            When you interact with our website, sign up for newsletters, or
            contact us, we may collect limited personal information such as
            your name and email address. This helps us deliver relevant content,
            updates, and advertising opportunities within our cannabis media
            network.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#00a86b] mb-2">
            How We Use Your Data
          </h2>
          <p>
            We use the information you provide to improve your experience,
            deliver personalized news updates, and notify you of events and
            offers that align with your interests. We do not sell or rent your
            information to any third parties.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#00a86b] mb-2">
            Cookies & Analytics
          </h2>
          <p>
            Our website may use cookies and analytics tools to measure traffic,
            track performance, and enhance usability. These tools collect data
            anonymously and are never used to identify individual users.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#00a86b] mb-2">
            Email Communication
          </h2>
          <p>
            Subscribers to our newsletters will receive updates on cannabis
            industry news, events, and exclusive Green Rush Nation content. You
            can unsubscribe at any time using the link included in each email.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#00a86b] mb-2">
            Data Security
          </h2>
          <p>
            We implement strong security measures to protect your personal data
            from unauthorized access, alteration, or misuse. While no system is
            entirely invulnerable, we maintain best practices to keep your
            information safe.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#00a86b] mb-2">
            Policy Updates
          </h2>
          <p>
            This Privacy Policy may be updated occasionally to reflect new
            features or legal requirements. All changes will be published on
            this page with the latest revision date.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#00a86b] mb-2">
            Contact Us
          </h2>
          <p>
            For questions regarding our privacy practices, email us at{" "}
            <a
              href="mailto:info@greenrushnation.com"
              className="text-[#00a86b] hover:underline"
            >
              info@greenrushnation.com
            </a>
            .
          </p>
        </div>

        {/* 🔙 BACK BUTTON */}
        <div className="flex justify-center pt-10">
          <Link
            href="/news"
            className="px-6 py-3 bg-[#00a86b] text-white rounded-md font-semibold hover:bg-[#00905e] transition"
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
