"use client";
import { useEffect, useState } from "react";
import { db } from "../../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { Sun, Moon } from "lucide-react";

export default function NewsList() {
  const [articles, setArticles] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    async function fetchArticles() {
      const snap = await getDocs(collection(db, "dailyNews"));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setArticles(data);
    }
    fetchArticles();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <main
      className={`min-h-screen flex justify-center transition-colors ${
        darkMode ? "bg-[#0f0f0f] text-gray-100" : "bg-[#f9f7f4] text-[#111]"
      }`}
    >
      <div className="max-w-[1050px] w-full px-10 py-10 font-serif">
        <header className="text-center border-b border-gray-300 pb-6 mb-12 relative">
          <h1 className="text-[110px] font-extrabold leading-none tracking-tight font-[Georgia] mb-2">
            GRN <span className="tracking-widest">NEWS</span>
          </h1>
          <p className="text-xl italic text-gray-600 dark:text-gray-300">
            Cannabis Industry Daily
          </p>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="absolute top-3 right-6 p-2 border border-gray-400 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        <section className="space-y-16">
          {articles.map((a) => (
            <Link key={a.id} href={`/news/${a.id}`}>
              <article
                className={`p-8 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm ${
                  darkMode ? "bg-[#141414]" : "bg-white"
                } hover:shadow-lg hover:-translate-y-[2px] transition cursor-pointer`}
              >
                <h2 className="text-4xl font-bold mb-3 hover:underline underline-offset-4">
                  {a.title || "Untitled Story"}
                </h2>
                <h3 className="italic text-gray-600 dark:text-gray-400 mb-4">
                  {a.subtitle || ""}
                </h3>
                <p className="text-[17px] leading-relaxed mb-4">
                  {a.body?.slice(0, 400) || "Article preview unavailable…"}…
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  {a.author ? `By ${a.author}` : "By GRN Staff"}
                </p>
              </article>
            </Link>
          ))}
        </section>

        <footer className="text-center mt-20 border-t border-gray-300 pt-6 text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Green Rush Nation — All Rights Reserved
        </footer>
      </div>
    </main>
  );
}
