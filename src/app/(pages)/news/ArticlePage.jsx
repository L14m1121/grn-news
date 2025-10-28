"use client";
import { useEffect, useState } from "react";
import { db } from "../../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function ArticlePage() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ✅ Load articles on mount
  useEffect(() => {
    async function loadArticles() {
      try {
        // Load both collections
        const [currentSnap, archivedSnap] = await Promise.all([
          getDocs(collection(db, "dailyNews")),
          getDocs(collection(db, "archivedNews")),
        ]);

        const current = currentSnap.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            status: "current",
          }))
          .filter((a) => !a.deleted);

        const archived = archivedSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          status: "archived",
        }));

        // Merge and sort newest first
        const merged = [...current, ...archived].sort((a, b) => {
          const dateA = a.createdAt?.seconds || a.archivedAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || b.archivedAt?.seconds || 0;
          return dateB - dateA;
        });

        setArticles(merged);
      } catch (err) {
        console.error("❌ Firestore Error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  // ✅ Store last page path separately
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("lastPage", window.location.pathname);
    }
  }, []);

  if (loading)
    return (
      <main className="min-h-screen flex justify-center items-center text-gray-500 font-serif bg-[#f9f7f4]">
        Loading articles...
      </main>
    );

  const categories = [
    "All",
    "health",
    "laws",
    "general",
    "business",
    "politics",
    "awareness",
  ];

  const filteredArticles =
    selectedCategory === "All"
      ? articles
      : articles.filter(
          (a) =>
            a.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  // 📰 Catalogue View
  if (!selected)
    return (
      <main className="min-h-screen bg-[#f9f7f4] text-[#111] font-serif">
        {/* 🔙 Back Button */}
        <div className="max-w-6xl mx-auto px-8 pt-8">
          <button
            onClick={() => (window.location.href = "/news?page=1")}
            className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 transition"
          >
            ← Back to News
          </button>
        </div>

        <header className="text-center py-10 border-b border-gray-300">
          <h1 className="text-5xl font-extrabold tracking-tight mb-2">
            GRN <span className="text-[#008c5e]">News Catalogue</span>
          </h1>
          <p className="text-base italic text-gray-600">
            Browse all published and archived articles.
          </p>
        </header>

        {/* Category Dropdown */}
        <div className="text-center mt-10 mb-10">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-400 rounded px-4 py-2 bg-white"
          >
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Article Cards */}
        <section className="max-w-6xl mx-auto px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => setSelected(article)}
              className={`bg-white border border-gray-300 rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer ${
                article.status === "archived" ? "opacity-80" : ""
              }`}
            >
              {article.imageUrl && (
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-40 object-cover mb-4 rounded"
                />
              )}
              <h2 className="text-xl font-bold mb-2 leading-snug">
                {article.title}
              </h2>
              <p className="text-xs italic text-gray-600 mb-2">
                {article.author ? `By ${article.author}` : "By GRN Staff"} •{" "}
                {article.status === "archived" ? (
                  <span className="text-gray-500 italic">Archived</span>
                ) : (
                  <span className="text-[#008c5e] font-medium">Active</span>
                )}
              </p>
              <p className="text-sm text-gray-700 leading-snug text-justify">
                {article.body
                  ? article.body.slice(0, 200) + "..."
                  : "No content."}
              </p>
            </article>
          ))}
        </section>

        {/* Footer */}
        <footer className="text-center py-6 text-gray-500 text-sm border-t border-gray-200">
          © {new Date().getFullYear()} Green Rush Nation — All Rights Reserved.
        </footer>
      </main>
    );

  // 🗞️ Single Article View
  return (
    <main className="min-h-screen bg-[#f9f7f4] text-[#111] font-serif flex justify-center">
      <div className="max-w-[900px] w-full px-10 py-16">
        {/* 🔙 Back Buttons */}
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={() => setSelected(null)}
            className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 transition"
          >
            ← Back to Catalogue
          </button>
          <button
            onClick={() => router.push("/news")}
            className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 transition"
          >
            ← Back to News
          </button>
        </div>

        <h1 className="text-[56px] font-bold mb-3">{selected.title}</h1>

        {selected.subtitle && (
          <h2 className="text-2xl italic text-gray-600 mb-5">
            {selected.subtitle}
          </h2>
        )}

        <p className="text-sm text-gray-500 mb-6 italic">
          {selected.author ? `By ${selected.author}` : "By GRN Staff"} •{" "}
          {selected.status === "archived" ? (
            <span className="text-gray-500 italic">Archived Article</span>
          ) : (
            <span className="text-[#008c5e] font-medium">Active Article</span>
          )}
        </p>

        {selected.imageUrl && (
          <img
            src={selected.imageUrl}
            alt={selected.title}
            className="w-full h-[480px] object-cover rounded mb-10 border border-gray-200"
          />
        )}

        <p className="text-[18px] leading-[1.9] whitespace-pre-line">
          {selected.body || "No content available."}
        </p>
      </div>
    </main>
  );
}
