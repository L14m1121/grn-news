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

export default function AdminPage() {
  const [articles, setArticles] = useState([]);
  const [archived, setArchived] = useState([]);
  const [tab, setTab] = useState("current");
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(null); // ✏️ editing article id
  const [editForm, setEditForm] = useState({}); // ✏️ editing form fields

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

  const categories = [
    "health",
    "laws",
    "general",
    "business",
    "politics",
    "awareness",
  ];

  // 🔄 Load both current + archived
  useEffect(() => {
    async function loadArticles() {
      const currentSnap = await getDocs(collection(db, "dailyNews"));
      const archiveSnap = await getDocs(collection(db, "archivedNews"));
      setArticles(currentSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setArchived(archiveSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }
    loadArticles();
  }, []);

  // ✏️ Handle form field changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") setFormData({ ...formData, image: files[0] });
    else setFormData({ ...formData, [name]: value });
  };

  // 📤 Submit new article
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      let imageUrl = formData.imageUrl;

      if (formData.image) {
        const imageRef = ref(
          storage,
          `dailyNews/${Date.now()}-${formData.image.name}`
        );
        await uploadBytes(imageRef, formData.image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "dailyNews"), {
        title: formData.title,
        subtitle: formData.subtitle,
        author: formData.author,
        body: formData.body,
        category: formData.category.toLowerCase(),
        imageUrl: imageUrl || "",
        placement: formData.placement,
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

  // ✏️ Start editing
  const startEdit = (article) => {
    setEditing(article.id);
    setEditForm({ ...article });
  };

  // 🧾 Handle edit changes
  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") setEditForm({ ...editForm, image: files[0] });
    else setEditForm({ ...editForm, [name]: value });
  };

  // 💾 Save edits
  const saveEdit = async (id) => {
    try {
      let imageUrl = editForm.imageUrl;

      if (editForm.image) {
        const imageRef = ref(
          storage,
          `dailyNews/${Date.now()}-${editForm.image.name}`
        );
        await uploadBytes(imageRef, editForm.image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await updateDoc(doc(db, "dailyNews", id), {
        title: editForm.title,
        subtitle: editForm.subtitle,
        author: editForm.author,
        category: editForm.category.toLowerCase(),
        body: editForm.body,
        placement: editForm.placement,
        imageUrl,
      });

      setArticles(
        articles.map((a) =>
          a.id === id ? { ...a, ...editForm, imageUrl } : a
        )
      );

      alert("✅ Article updated!");
      setEditing(null);
    } catch (err) {
      console.error("❌ Error updating article:", err);
      alert("Failed to save changes.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f4ec] text-[#111] font-serif p-8">
      {/* 🧭 Tab Switcher */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setTab("current")}
          className={`px-5 py-2 rounded font-semibold ${
            tab === "current"
              ? "bg-[#008c5e] text-white"
              : "bg-white border border-gray-400 text-gray-700 hover:bg-gray-100"
          }`}
        >
          Current Articles
        </button>
        <button
          onClick={() => setTab("archived")}
          className={`px-5 py-2 rounded font-semibold ${
            tab === "archived"
              ? "bg-[#008c5e] text-white"
              : "bg-white border border-gray-400 text-gray-700 hover:bg-gray-100"
          }`}
        >
          Archived Articles
        </button>
      </div>

      {/* Add Article Form */}
      {tab === "current" && (
        <div className="max-w-2xl mx-auto bg-white border border-gray-300 rounded-xl shadow p-8 mb-16">
          <h2 className="text-xl font-bold mb-4">Add a New Article</h2>
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
              className="w-full border border-gray-400 rounded px-3 py-2 bg-white"
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
            <select
              name="placement"
              value={formData.placement}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded px-3 py-2 bg-white"
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
              className="w-full border border-gray-400 rounded px-3 py-2 bg-white"
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

      {/* Current Articles */}
      {tab === "current" && (
        <section className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Current Articles</h2>
          {articles.length === 0 ? (
            <p className="text-gray-500 italic">No articles found.</p>
          ) : (
            articles.map((article) =>
              editing === article.id ? (
                <div
                  key={article.id}
                  className="bg-white border border-gray-300 rounded-lg p-4 mb-4"
                >
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
                    rows="5"
                    value={editForm.body}
                    onChange={handleEditChange}
                    className="w-full border border-gray-400 rounded px-3 py-2 mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(article.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={article.id}
                  className="flex justify-between items-start border border-gray-300 rounded-lg p-4 mb-4 bg-white"
                >
                  <div>
                    <h3 className="font-bold">{article.title}</h3>
                    <p className="text-sm text-gray-600 italic">
                      {article.category || "Uncategorized"} • Placement:{" "}
                      <span className="font-semibold text-[#008c5e]">
                        {article.placement || "—"}
                      </span>
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
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold"
                    >
                      Archive
                    </button>
                  </div>
                </div>
              )
            )
          )}
        </section>
      )}

      {/* Archived Articles */}
      {tab === "archived" && (
        <section className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Archived Articles</h2>
          {archived.length === 0 ? (
            <p className="text-gray-500 italic">No archived articles yet.</p>
          ) : (
            archived.map((article) => (
              <div
                key={article.id}
                className="border border-gray-300 rounded-lg p-4 mb-4 bg-white"
              >
                <h3 className="font-bold">{article.title}</h3>
                <p className="text-sm text-gray-600 italic">
                  {article.category || "Uncategorized"} • Placement:{" "}
                  <span className="font-semibold text-[#008c5e]">
                    {article.placement || "—"}
                  </span>
                </p>
                <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                  {article.body?.slice(0, 200)}...
                </p>
              </div>
            ))
          )}
        </section>
      )}
    </main>
  );
}
