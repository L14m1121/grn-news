"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../lib/firebase";

import Link from "next/link";

export default function ArticleView() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const ref = doc(db, "dailyNews", id);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
          setArticle({ id: snapshot.id, ...snapshot.data() });
        }
      } catch (err) {
        console.error("❌ Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchArticle();
  }, [id]);

  if (loading)
    return (
      <main className="min-h-screen flex justify-center items-center text-gray-500 font-serif bg-[#f9f7f4]">
        Loading article...
      </main>
    );

  if (!article)
    return (
      <main className="min-h-screen flex justify-center items-center text-gray-500 font-serif bg-[#f9f7f4]">
        Article not found.
      </main>
    );

  return (
    <main className="min-h-screen bg-[#f9f7f4] text-[#111] font-serif">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="text-[#008c5e] hover:underline decoration-[#00a86b]/60 decoration-2"
        >
          ← Back to Home
        </Link>

        <h1 className="text-5xl font-bold mt-6 mb-3">{article.title}</h1>
        {article.subtitle && (
          <h2 className="text-2xl italic text-gray-600 mb-6">
            {article.subtitle}
          </h2>
        )}
        <p className="text-sm text-gray-500 mb-8 italic">
          {article.author ? `By ${article.author}` : "By GRN Staff"}
        </p>

        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-[400px] object-cover rounded-lg mb-8 border border-gray-200"
          />
        )}

        <p className="text-[18px] leading-[1.9] whitespace-pre-line">
          {article.body}
        </p>
      </div>
    </main>
  );
}
