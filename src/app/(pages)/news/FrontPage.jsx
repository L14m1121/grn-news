"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import Link from "next/link";
import { db, auth, provider } from "../../../../lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

export default function FrontPage() {
  const [articles, setArticles] = useState([]);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNewsletterPrompt, setShowNewsletterPrompt] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 Load Firestore articles + auth listener
  useEffect(() => {
    async function loadArticles() {
      try {
        const snapshot = await getDocs(collection(db, "dailyNews"));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setArticles(data);
      } catch (err) {
        console.error("❌ Firestore Error:", err);
        setError("Failed to load today's edition.");
      } finally {
        setLoading(false);
      }
    }

    loadArticles();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 🧠 Newsletter only after manual sign-in
  async function handleSignIn() {
    try {
      await signInWithPopup(auth, provider);
      setShowNewsletterPrompt(true); // 👈 show only after this action
    } catch (err) {
      console.error("❌ Sign-in Error:", err);
      alert("Sign-in failed. Please try again.");
    }
  }

  async function handleSignOut() {
    try {
      await signOut(auth);
      setShowDropdown(false);
      setUser(null);
    } catch (err) {
      console.error("❌ Sign-out Error:", err);
    }
  }

  async function joinNewsletter() {
    if (!user?.email) return;
    try {
      await addDoc(collection(db, "newsletter"), {
        email: user.email,
        joinedAt: new Date(),
      });
      alert("✅ You’re subscribed to GRN Daily updates!");
      setShowNewsletterPrompt(false);
    } catch (err) {
      console.error("❌ Newsletter Error:", err);
      alert("Error joining newsletter. Try again later.");
    }
  }

  // 🧩 Loading / Error States
  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f7f4ec]">
        <p className="text-gray-500 italic">Loading today’s edition...</p>
      </main>
    );

  if (error)
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f7f4ec]">
        <p className="text-red-500 italic">{error}</p>
      </main>
    );

  if (!articles.length)
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f7f4ec]">
        <p className="text-gray-500 italic">No stories published yet.</p>
      </main>
    );

  const col1 = articles[0];
  const main = articles[1];
  const col3 = articles[2];
  const bottom = articles.slice(3, 5);

  return (
    <main className="bg-[#f7f4ec] text-[#111] font-serif relative">
      {/* 📰 HEADER */}
      <header className="relative border-b border-transparent">
        <div className="max-w-7xl mx-auto px-6 pt-10 pb-6 flex items-center justify-between">
          {/* LEFT — TITLE + DATE */}
          <div>
            <h1 className="text-[76px] font-extrabold tracking-tight leading-none mb-2">
              GRN <span className="text-[#008c5e]">Daily</span>
            </h1>
            <p className="text-[16px] italic text-gray-600">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          {/* RIGHT — NAVIGATION + ACCOUNT */}
          <div className="flex items-center gap-8 relative">
            <nav className="flex gap-8 text-[15px] font-medium text-gray-700">
              <Link
                href="/news?view=article"
                className="hover:text-[#008c5e] hover:underline decoration-[#00a86b]/60 decoration-2 transition"
              >
                📰 News Catalogue
              </Link>

              <Link
                href="/news?view=advertising"
                className="hover:text-[#008c5e] hover:underline decoration-[#00a86b]/60 decoration-2 transition"
              >
                💼 Sponsor / Submit
              </Link>
            </nav>

            {/* 👤 ACCOUNT BUTTON */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="px-4 py-2 bg-[#111] text-white rounded-md text-sm hover:bg-[#333] transition"
              >
                {user ? "Account" : "Sign In"}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {user ? (
                    <>
                      <p className="text-gray-800 text-sm px-4 py-2 border-b border-gray-100">
                        {user.displayName || "User"}
                      </p>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleSignIn}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Sign In with Google
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ✨ Decorative line */}
        <div className="flex justify-center mb-8">
          <div className="h-[2px] w-[85%] bg-gradient-to-r from-transparent via-gray-300/40 to-transparent" />
        </div>

        {/* 🧭 CATEGORY NAVIGATION */}
        <nav className="flex justify-center gap-10 text-[15px] font-medium text-gray-800 mb-6">
          {["Health", "Law’s", "General", "Business", "Politics", "Awareness"].map((tab) => (
            <Link
              key={tab}
              href={`/category/${tab.toLowerCase().replace("’", "")}`}
              className="hover:text-[#008c5e] hover:underline decoration-[#00a86b]/60 decoration-2 transition"
            >
              {tab}
            </Link>
          ))}
        </nav>

        {/* thin line under categories */}
        <div className="flex justify-center mb-10">
          <div className="h-[1px] w-[85%] bg-gradient-to-r from-transparent via-gray-300/30 to-transparent" />
        </div>
      </header>

      {/* 💌 Newsletter Popup */}
      {showNewsletterPrompt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-[90%] max-w-md text-center">
            <h2 className="text-2xl font-bold mb-2">Join the GRN Daily Newsletter</h2>
            <p className="text-gray-600 mb-6">
              Want to get an email whenever new stories are published?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={joinNewsletter}
                className="bg-[#008c5e] text-white px-6 py-2 rounded-lg hover:bg-[#00a86b] transition"
              >
                Yes, Sign Me Up
              </button>
              <button
                onClick={() => setShowNewsletterPrompt(false)}
                className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                No, Thanks
              </button>
            </div>
          </div>
        </div>
      )}

   {/* 🗞️ MAIN CONTENT */}
<section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-10 mb-12">
  {col1 && (
    <Link href={`/article/${col1.id}`} className="group">
      <article className="border-t border-gray-300 pt-3 cursor-pointer transition hover:opacity-80">
        {col1.imageUrl && (
          <img
            src={col1.imageUrl}
            alt={col1.title}
            className="w-full h-48 object-cover mb-3 border border-gray-200 rounded"
          />
        )}
        <h2 className="text-xl font-bold leading-snug mb-2 group-hover:text-[#008c5e] transition">
          {col1.title}
        </h2>
        <p className="text-sm italic text-gray-600 mb-2">
          {col1.author ? `By ${col1.author}` : "By GRN Staff"}
        </p>
        <p className="text-sm text-gray-800 leading-snug text-justify">
          {col1.body?.slice(0, 400)}...
        </p>
      </article>
    </Link>
  )}

  {main && (
    <Link href={`/article/${main.id}`} className="group">
      <article className="border-t border-gray-300 pt-3 cursor-pointer transition hover:opacity-80">
        {main.imageUrl && (
          <img
            src={main.imageUrl}
            alt={main.title}
            className="w-full h-[320px] object-cover mb-4 border border-gray-200 rounded"
          />
        )}
        <h2 className="text-3xl font-extrabold leading-tight mb-3 group-hover:text-[#008c5e] transition">
          {main.title}
        </h2>
        <p className="text-sm italic text-gray-600 mb-2">
          {main.author ? `By ${main.author}` : "By GRN Staff"}
        </p>
        <p className="text-[15px] text-gray-900 leading-relaxed text-justify">
          {main.body?.slice(0, 700)}...
        </p>
      </article>
    </Link>
  )}

  {col3 && (
    <Link href={`/article/${col3.id}`} className="group">
      <article className="border-t border-gray-300 pt-3 cursor-pointer transition hover:opacity-80">
        {col3.imageUrl && (
          <img
            src={col3.imageUrl}
            alt={col3.title}
            className="w-full h-36 object-cover mb-3 border border-gray-200 rounded"
          />
        )}
        <h2 className="text-lg font-semibold leading-snug mb-2 group-hover:text-[#008c5e] transition">
          {col3.title}
        </h2>
        <p className="text-sm italic text-gray-600 mb-2">
          {col3.author ? `By ${col3.author}` : "By GRN Staff"}
        </p>
        <p className="text-sm text-gray-800 leading-snug text-justify">
          {col3.body?.slice(0, 350)}...
        </p>
      </article>
    </Link>
  )}
</section>

{/* 🧾 BOTTOM ROW */}
<section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 pb-12">
  {bottom.map((story) => (
    <Link href={`/article/${story.id}`} key={story.id} className="group">
      <article className="border-t border-gray-300 pt-3 cursor-pointer transition hover:opacity-80">
        {story.imageUrl && (
          <img
            src={story.imageUrl}
            alt={story.title}
            className="w-full h-40 object-cover mb-3 border border-gray-200 rounded"
          />
        )}
        <h3 className="text-xl font-semibold mb-2 group-hover:text-[#008c5e] transition">
          {story.title}
        </h3>
        <p className="text-xs italic text-gray-600 mb-2">
          {story.author ? `By ${story.author}` : "By GRN Staff"}
        </p>
        <p className="text-sm text-gray-700 leading-snug text-justify">
          {story.body?.slice(0, 300)}...
        </p>
      </article>
    </Link>
  ))}
</section>

      {/* 🧾 BOTTOM ROW */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 pb-12">
        {bottom.map((story) => (
          <article key={story.id} className="border-t border-gray-300 pt-3">
            {story.imageUrl && (
              <img
                src={story.imageUrl}
                alt={story.title}
                className="w-full h-40 object-cover mb-3 border border-gray-200 rounded"
              />
            )}
            <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
            <p className="text-xs italic text-gray-600 mb-2">
              {story.author ? `By ${story.author}` : "By GRN Staff"}
            </p>
            <p className="text-sm text-gray-700 leading-snug text-justify">
              {story.body?.slice(0, 300)}...
            </p>
          </article>
        ))}
      </section>

      {/* ⚖️ FOOTER */}
      <footer className="text-center py-6 text-gray-500 text-sm border-t border-gray-200">
        © {new Date().getFullYear()} Green Rush Nation — All Rights Reserved.
      </footer>
    </main>
  );
}
