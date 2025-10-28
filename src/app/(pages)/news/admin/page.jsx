"use client";
import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../../../lib/firebase";
import useTheme from "../../../hooks/useTheme";

export default function AdminPage() {
  const [articles, setArticles] = useState([]);
  const [archived, setArchived] = useState([]);
  const [tab, setTab] = useState("current");
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    author: "",
    category: "health",
    body: "",
    image: null,
    imageUrl: "",
    placement: "left",
  });

  const { theme, toggleTheme } = useTheme();

  const categories = ["health", "laws", "general", "business", "politics", "awareness"];

  // 🔄 Load articles
  useEffect(() => {
    async function loadArticles() {
      const currentSnap = await getDocs(collection(db, "dailyNews"));
      const archiveSnap = await getDocs(collection(db, "archivedNews"));
      setArticles(currentSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setArchived(archiveSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }
    loadArticles();
  }, []);

  // ✏️ Form changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") setFormData({ ...formData, image: files[0] });
    else setFormData({ ...formData, [name]: value });
  };

  // 📤 Add new article
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      let imageUrl = formData.imageUrl;

      if (formData.image) {
        const imageRef = ref(storage, `dailyNews/${Date.now()}-${formData.image.name}`);
        await uploadBytes(imageRef, formData.image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "dailyNews"), {
        ...formData,
        imageUrl: imageUrl || "",
        category: formData.category.toLowerCase(),
        createdAt: serverTimestamp(),
      });

      alert("✅ Article successfully published!");
      setFormData({
        title: "",
        subtitle: "",
        author: "",
        category: "health",
        body: "",
        image: null,
        imageUrl: "",
        placement: "left",
      });

      const snapshot = await getDocs(collection(db, "dailyNews"));
      setArticles(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("❌ Error adding article:", err);
      alert("Failed to publish article.");
    } finally {
      setUploading(false);
    }
  };

  // 🗂️ Archive article
  const handleArchive = async (article) => {
    if (!confirm("Archive this article?")) return;
    try {
      await setDoc(doc(collection(db, "archivedNews"), article.id), {
        ...article,
        archivedAt: serverTimestamp(),
      });
      await deleteDoc(doc(db, "dailyNews", article.id));
      setArticles(articles.filter((a) => a.id !== article.id));
      setArchived([...archived, article]);
    } catch (err) {
      console.error("❌ Error archiving article:", err);
      alert("Failed to archive article.");
    }
  };

  // ❌ DELETE ARTICLE
  const handleDelete = async (article, type) => {
    if (!confirm(`Are you sure you want to permanently delete "${article.title}"?`)) return;
    try {
      const collectionName = type === "archived" ? "archivedNews" : "dailyNews";
      await deleteDoc(doc(db, collectionName, article.id));
      if (type === "archived") setArchived(archived.filter((a) => a.id !== article.id));
      else setArticles(articles.filter((a) => a.id !== article.id));
      alert("🗑️ Article deleted permanently.");
    } catch (err) {
      console.error("❌ Error deleting article:", err);
      alert("Failed to delete article.");
    }
  };

  // ✏️ Editing logic
  const startEdit = (article) => {
    setEditing(article.id);
    setEditForm({ ...article });
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") setEditForm({ ...editForm, image: files[0] });
    else setEditForm({ ...editForm, [name]: value });
  };

  const saveEdit = async (id) => {
    try {
      let imageUrl = editForm.imageUrl;
      if (editForm.image) {
        const imageRef = ref(storage, `dailyNews/${Date.now()}-${editForm.image.name}`);
        await uploadBytes(imageRef, editForm.image);
        imageUrl = await getDownloadURL(imageRef);
      }
      await updateDoc(doc(db, "dailyNews", id), {
        ...editForm,
        imageUrl,
        category: editForm.category.toLowerCase(),
      });
      setArticles(articles.map((a) => (a.id === id ? { ...a, ...editForm, imageUrl } : a)));
      alert("✅ Article updated!");
      setEditing(null);
    } catch (err) {
      console.error("❌ Error updating article:", err);
      alert("Failed to save changes.");
    }
  };

  const filteredArticles = articles.filter(
    (a) =>
      a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#f7f4ec] dark:bg-[#0a0a0a] text-[#111] dark:text-[#f1f1f1] font-serif">
      {/* 🏛️ Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#f7f4ec]/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-gray-300 dark:border-gray-700 py-6 shadow-sm">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            GRN <span className="text-[#00a86b]">Admin Dashboard</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 italic text-sm mt-1">
            Manage articles, archives, and editorial workflow
          </p>
        </div>

        <div className="flex justify-center items-center mt-6 gap-4">
          <button
            onClick={() => setTab("current")}
            className={`px-6 py-2 rounded font-semibold text-lg transition ${
              tab === "current"
                ? "bg-[#008c5e] text-white shadow-md"
                : "bg-white border border-gray-400 text-gray-700 hover:bg-gray-100"
            }`}
          >
            Current
          </button>
          <button
            onClick={() => setTab("archived")}
            className={`px-6 py-2 rounded font-semibold text-lg transition ${
              tab === "archived"
                ? "bg-[#008c5e] text-white shadow-md"
                : "bg-white border border-gray-400 text-gray-700 hover:bg-gray-100"
            }`}
          >
            Archived
          </button>

          {/* 🌙 Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="ml-6 px-5 py-2 border border-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm"
          >
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>
      </header>

      {/* 📋 Main Content */}
      <div className="p-8">
        {/* 📰 Add New Article */}
        {tab === "current" && (
          <div className="max-w-2xl mx-auto bg-white border border-gray-300 rounded-xl shadow p-8 mb-16 dark:bg-[#1a1a1a] mt-8">
            <h2 className="text-xl font-bold mb-4 text-center">Add a New Article</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border border-gray-400 rounded px-3 py-2"
              />
              <input
                type="text"
                name="subtitle"
                placeholder="Subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded px-3 py-2"
              />
              <input
                type="text"
                name="author"
                placeholder="Author"
                value={formData.author}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded px-3 py-2"
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded px-3 py-2 bg-white dark:bg-[#1a1a1a]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <textarea
                name="body"
                placeholder="Article Body"
                rows="6"
                value={formData.body}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded px-3 py-2"
              />
              {/* 🧭 Placement dropdown restored */}
              <select
                name="placement"
                value={formData.placement}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded px-3 py-2 bg-white dark:bg-[#1a1a1a]"
              >
                <option value="left">Left Column</option>
                <option value="main">Main Story (Center)</option>
                <option value="right">Right Column</option>
                <option value="bottom">Bottom Row</option>
                <option value="bottom2">Bottom Row 2</option>
              </select>

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full border border-gray-400 rounded px-3 py-2 bg-white dark:bg-[#1a1a1a]"
              />
              <button
                type="submit"
                disabled={uploading}
                className={`w-full py-3 rounded font-semibold transition ${
                  uploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {uploading ? "Uploading..." : "Publish Article"}
              </button>
            </form>
          </div>
        )}

        {/* 🔍 Search */}
        {tab === "current" && (
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-2xl mx-auto block border border-gray-400 rounded px-3 py-2 mb-8"
          />
        )}

        {/* 📜 Articles Section */}
        {tab === "current" ? (
          <section className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Current Articles</h2>
            {filteredArticles.length === 0 ? (
              <p className="text-gray-500 italic text-center">No articles found.</p>
            ) : (
              filteredArticles.map((article) =>
                editing === article.id ? (
                  <div key={article.id} className="border p-4 rounded-lg mb-4 bg-white dark:bg-[#1a1a1a]">
                    <h3 className="font-bold mb-2">Editing: {article.title}</h3>
                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      className="w-full border border-gray-400 rounded px-3 py-2 mb-2"
                    />
                    <textarea
                      name="body"
                      value={editForm.body}
                      onChange={handleEditChange}
                      rows="4"
                      className="w-full border border-gray-400 rounded px-3 py-2 mb-2"
                    />
                    <button
                      onClick={() => saveEdit(article.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div
                    key={article.id}
                    className="flex justify-between items-start border border-gray-300 rounded-lg p-4 mb-4 bg-white dark:bg-[#1a1a1a]"
                  >
                    <div>
                      <h3 className="font-bold">{article.title}</h3>
                      <p className="text-sm text-gray-600 italic">
                        {article.category} •{" "}
                        <span className="font-semibold text-[#008c5e]">{article.placement}</span>
                      </p>
                      <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                        {article.body?.slice(0, 200)}...
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => startEdit(article)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleArchive(article)}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md font-semibold"
                      >
                        Archive
                      </button>
                      <button
                        onClick={() => handleDelete(article, "current")}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              )
            )}
          </section>
        ) : (
          /* 🗄️ Archived */
          <section className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Archived Articles</h2>
            {archived.length === 0 ? (
              <p className="text-gray-500 italic text-center">No archived articles yet.</p>
            ) : (
              archived.map((article) => (
                <div
                  key={article.id}
                  className="border border-gray-300 rounded-lg p-4 mb-4 bg-white dark:bg-[#1a1a1a] flex justify-between items-start"
                >
                  <div>
                    <h3 className="font-bold">{article.title}</h3>
                    <p className="text-sm text-gray-600 italic">
                      {article.category || "Uncategorized"} •{" "}
                      <span className="font-semibold text-[#008c5e]">{article.placement || "—"}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(article, "archived")}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </section>
        )}
      </div>

      {/* 🦶 Footer */}
      <footer className="text-center mt-20 text-gray-500 text-sm border-t border-gray-300 pt-6 pb-10">
        <p>© {new Date().getFullYear()} Green Rush Nation Media — Editorial CMS</p>
        <p className="italic mt-1">
          Internal newsroom portal for managing GRN Daily content and archives.
        </p>
      </footer>
    </main>
  );
}
