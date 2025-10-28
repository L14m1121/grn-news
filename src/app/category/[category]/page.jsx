"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import Link from "next/link";

export default function CategoryPage() {
  const { category } = useParams(); // ✅ use category param
  const [articles, setArticles] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // ✅ Proper query to fetch all articles in this category
        const q = query(
          collection(db, "dailyNews"),
          where("category", "==", category),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArticles(data);

        // 🧠 Remember this page for Back button later
        if (typeof window !== "undefined") {
          sessionStorage.setItem("lastPage", window.location.pathname);
        }
      } catch (err) {
        console.error("❌ Firestore Error:", err);
        setError("Failed to load category articles.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [category]);

  const visibleArticles = showMore ? articles : articles.slice(0, 3);

  // 🌀 Loading
  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f7f4ec] text-gray-600 italic">
        Loading {category} stories...
      </main>
    );

  // ⚠️ Error
  if (error)
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f7f4ec] text-red-600 italic">
        {error}
      </main>
    );

  // 📭 No Articles
  if (!articles.length)
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#f7f4ec] text-gray-700 font-serif">
        <h1 className="text-[64px] font-extrabold capitalize">{category} News</h1>
        <p className="text-gray-600 italic mb-6">
          The latest {category.toLowerCase()} stories from GRN Daily
        </p>
        <p className="text-gray-500 mb-4">No articles available yet.</p>
        <Link
          href="/news"
          className="text-[#008c5e] hover:underline decoration-[#00a86b]/60 decoration-2"
        >
          ← Back to Newspaper
        </Link>
      </main>
    );

  // ✅ Render Articles
  return (
    <main className="bg-[#f7f4ec] text-[#111] font-serif min-h-screen">
      <header className="text-center py-12 border-b border-gray-200">
        <h1 className="text-[64px] font-extrabold capitalize">
          {category} News
        </h1>
        <p className="text-gray-600 italic">
          The latest {category.toLowerCase()} stories from GRN Daily
        </p>

        <div className="mt-6">
          <Link
            href="/news"
            className="text-[#008c5e] hover:underline decoration-[#00a86b]/60 decoration-2"
          >
            ← Back to Newspaper
          </Link>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {visibleArticles.map((a) => (
          <Link
            href={`/article/${a.id}`}
            key={a.id}
            className="group block cursor-pointer"
          >
            <article className="border-t border-gray-300 pt-3 bg-white p-4 rounded-md shadow-sm hover:shadow-md transition">
              {a.imageUrl && (
                <img
                  src={a.imageUrl}
                  alt={a.title}
                  className="w-full h-48 object-cover mb-3 rounded"
                />
              )}
              <h2 className="text-xl font-bold mb-2 group-hover:text-[#008c5e] transition">
                {a.title}
              </h2>
              <p className="text-xs italic text-gray-600 mb-2">
                {a.author ? `By ${a.author}` : "By GRN Staff"}
              </p>
              <p className="text-sm text-gray-700 leading-snug text-justify">
                {a.body?.slice(0, 300)}...
              </p>
            </article>
          </Link>
        ))}
      </section>

      {articles.length > 3 && (
        <div className="text-center pb-12">
          <button
            onClick={() => setShowMore(!showMore)}
            className="px-6 py-3 bg-[#008c5e] text-white rounded-md hover:bg-[#00a86b] transition"
          >
            {showMore ? "Show Less" : "View More"}
          </button>
        </div>
      )}

      <footer className="text-center py-6 text-gray-500 text-sm border-t border-gray-200">
        © {new Date().getFullYear()} Green Rush Nation — All Rights Reserved.
      </footer>
    </main>
  );
}
