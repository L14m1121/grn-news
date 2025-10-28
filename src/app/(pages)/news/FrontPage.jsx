"use client";
import { useEffect, useState, useContext } from "react";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { db, auth, provider } from "../../../../lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { ThemeContext } from "../../layout";
import SidebarMenu from "../../components/SidebarMenu";
import { motion, AnimatePresence } from "framer-motion";

export default function FrontPage() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [articles, setArticles] = useState([]);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hovered, setHovered] = useState(null);
  const [categoryArticles, setCategoryArticles] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(collection(db, "dailyNews"));
        setArticles(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch {
        setError("Failed to load today’s edition.");
      } finally {
        setLoading(false);
      }
    }
    load();
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  const handleAuth = async () =>
    user ? (await signOut(auth), setUser(null)) : signInWithPopup(auth, provider);

  async function fetchCategory(cat) {
    try {
      const clean = cat.trim().toLowerCase();
      const snap = await getDocs(collection(db, "dailyNews"));
      const filtered = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((x) => x.category?.trim().toLowerCase() === clean);
      setCategoryArticles(filtered.slice(0, 4));
    } catch (err) {
      console.error(err);
    }
  }

  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f7f4ec] dark:bg-[#0a0a0a]">
        <p className="italic text-gray-500 dark:text-gray-300">Loading today’s edition...</p>
      </main>
    );

  if (error)
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f7f4ec] dark:bg-[#0a0a0a]">
        <p className="italic text-red-500">{error}</p>
      </main>
    );

  const [col1, mainStory, col3, ...rest] = articles;
  const bottom = rest.slice(0, 2);

  return (
    <main
      className={`font-serif min-h-screen flex flex-col justify-between ${
        theme === "dark" ? "bg-[#0a0a0a] text-[#f4f4f4]" : "bg-[#f7f4ec] text-[#111]"
      } transition-colors`}
    >
      <SidebarMenu />

      {/* HEADER */}
      <header className="text-center relative">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-8 flex flex-col items-center gap-3">
          <h1 className="text-[76px] font-extrabold leading-none">
            <span className="dark:text-[#f5f5f5]">GRN</span>{" "}
            <span className="text-[#00a86b]">Daily</span>
          </h1>

          <p className="italic text-gray-600 dark:text-gray-400 mt-2">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          <nav className="flex gap-10 text-[15px] font-medium mt-6 text-gray-700 dark:text-gray-300">
            <Link href="/news?view=article" className="hover:text-[#00a86b] hover:underline">
              News Catalogue
            </Link>
            <Link href="/news?view=advertising" className="hover:text-[#00a86b] hover:underline">
              Sponsor / Submit
            </Link>
          </nav>
        </div>

        {/* THEME + ACCOUNT */}
        <div className="absolute top-6 right-8 flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="px-3 py-2 border rounded-md text-sm hover:bg-gray-200 dark:hover:bg-[#1a1a1a]"
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
          <div className="relative">
            <button
              onClick={() => setShowDropdown((v) => !v)}
              className="px-4 py-2 bg-[#111] text-white rounded-md text-sm hover:bg-[#333]"
            >
              {user ? "Account" : "Sign In"}
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#1a1a1a] border rounded-lg shadow">
                {user ? (
                  <>
                    <p className="px-4 py-2 text-sm border-b">{user.displayName || "User"}</p>
                    <button
                      onClick={handleAuth}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#222]"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleAuth}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#222]"
                  >
                    Sign In with Google
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center mb-6 mt-4">
          <div className="h-[2px] w-[85%] bg-gradient-to-r from-transparent via-gray-300/40 to-transparent dark:via-gray-700/40" />
        </div>

        {/* CATEGORY NAV */}
        <nav className="flex justify-center gap-12 text-[15px] font-medium mb-6 relative">
          {["Health", "Law", "General", "Business", "Politics", "Awareness"].map((tab) => (
            <div
              key={tab}
              onMouseEnter={() => {
                setHovered(tab);
                fetchCategory(tab);
              }}
              onMouseLeave={() => setHovered(null)}
              className="relative group pb-1 cursor-pointer"
            >
              <Link
                href={`/category/${tab.toLowerCase()}`}
                className="group-hover:text-[#00a86b] transition-colors"
              >
                {tab}
              </Link>
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#00a86b] group-hover:w-full transition-all" />
              <AnimatePresence>
                {hovered === tab && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute left-1/2 -translate-x-1/2 top-8 w-[750px] bg-[#fffef9] dark:bg-[#121212] shadow-lg border rounded-lg p-4 z-10"
                  >
                    <div className="grid grid-cols-4 gap-4">
                      {categoryArticles.length ? (
                        categoryArticles.map((a) => (
                          <Link key={a.id} href={`/article/${a.id}`}>
                            {a.imageUrl && (
                              <img
                                src={a.imageUrl}
                                alt={a.title}
                                className="w-full h-28 object-cover rounded border group-hover:opacity-80"
                              />
                            )}
                            <p className="text-[13px] mt-2 font-medium group-hover:text-[#00a86b] line-clamp-2">
                              {a.title}
                            </p>
                          </Link>
                        ))
                      ) : (
                        <p className="col-span-4 text-center text-sm text-gray-500">
                          No stories in this category yet.
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <div className="flex justify-center mb-10">
          <div className="h-[1px] w-[85%] bg-gradient-to-r from-transparent via-gray-300/30 to-transparent dark:via-gray-700/30" />
        </div>
      </header>

      {/* MAIN STORIES */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-10 mb-12">
        {[col1, mainStory, col3].map(
          (item, i) =>
            item && (
              <Link href={`/article/${item.id}`} key={i}>
                <article className="border-t border-gray-300 pt-3 hover:opacity-80">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className={`w-full ${
                        i === 1 ? "h-[320px]" : "h-48"
                      } object-cover mb-3 border rounded`}
                    />
                  )}
                  <h2
                    className={`${
                      i === 1 ? "text-3xl font-extrabold" : "text-xl font-bold"
                    } mb-2 hover:text-[#00a86b]`}
                  >
                    {item.title}
                  </h2>
                  <p className="text-sm italic text-gray-600 dark:text-gray-400 mb-2">
                    {item.author ? `By ${item.author}` : "By GRN Staff"}
                  </p>
                  <p className="text-sm text-gray-800 dark:text-gray-300 leading-snug text-justify">
                    {item.body?.slice(0, i === 1 ? 700 : 350)}...
                  </p>
                </article>
              </Link>
            )
        )}
      </section>

      {/* LOWER ARTICLES */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 pb-12">
        {bottom.map((story) => (
          <Link href={`/article/${story.id}`} key={story.id}>
            <article className="border-t border-gray-300 pt-3 hover:opacity-80">
              {story.imageUrl && (
                <img
                  src={story.imageUrl}
                  alt={story.title}
                  className="w-full h-40 object-cover mb-3 border rounded"
                />
              )}
              <h3 className="text-xl font-semibold mb-2 hover:text-[#00a86b]">{story.title}</h3>
              <p className="text-xs italic text-gray-600 dark:text-gray-400 mb-2">
                {story.author ? `By ${story.author}` : "By GRN Staff"}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug text-justify">
                {story.body?.slice(0, 300)}...
              </p>
            </article>
          </Link>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0a0a0a] text-white border-t border-[#00a86b]/20 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-4xl font-extrabold mb-6">
            GREEN RUSH <span className="text-[#00a86b]">NATION</span>
          </h2>
          <div className="flex justify-center gap-6 mb-10">
            {[
              ["Instagram.pdf", "Instagram", "https://instagram.com/greenrushnation"],
              ["Tiktok.png", "TikTok", "https://tiktok.com/@greenrushnation"],
              ["Youtube.jpg", "YouTube", "https://youtube.com/@greenrushnation"],
              ["X.jpg", "X", "https://x.com/greenrushnation"],
            ].map(([icon, alt, link]) => (
              <a key={alt} href={link} target="_blank" rel="noopener noreferrer">
                <img
                  src={`/icons/${icon}`}
                  alt={alt}
                  className="w-8 h-8 rounded-full border border-[#00a86b]/40 bg-black p-1 hover:bg-[#00a86b]/20 hover:scale-110 transition"
                />
              </a>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {[
              ["About Green Rush Nation", "/about"],
              ["Subscribe", "/subscribe"],
              ["Sponsorship & Advertising", "/advertising"],
              ["Privacy Policy", "/privacy"],
            ].map(([text, href]) => (
              <Link
                key={text}
                href={href}
                className="px-5 py-2 border border-[#00a86b]/40 rounded-md hover:bg-[#00a86b]/10 hover:text-[#00ff9d]"
              >
                {text}
              </Link>
            ))}
          </div>

          <p className="text-xs text-gray-500">
            All the cannabis news you need, all in one place. <br />
            © {new Date().getFullYear()} Green Rush Nation Media LLC — All Rights Reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
