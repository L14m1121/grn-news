"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../lib/firebase"; // ✅ correct path
import Link from "next/link";

export default function AdvertisingPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    type: "Sponsorship",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");

    try {
      await addDoc(collection(db, "advertisingRequests"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setStatus("✅ Submitted successfully!");
      setFormData({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        website: "",
        type: "Sponsorship",
        message: "",
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      setStatus("❌ Error submitting form. Try again later.");
    }
  };

  // 🕓 Auto-clear status after 3 seconds
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <main className="min-h-screen flex justify-center bg-[#f7f4ec] text-[#111] font-serif">
      <div className="w-full max-w-[850px] px-6 py-12 border-x border-gray-400">
        {/* 🔙 Back Button */}
        <div className="mb-8">
          <Link
            href="/news"
            className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 transition"
          >
            ← Back to News
          </Link>
        </div>

        {/* 🌿 Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold mb-2">
            Partner or Advertise with{" "}
            <span className="text-[#008c5e]">GRN</span>
          </h1>
          <p className="italic text-gray-600">
            Join the movement — advertise your article, sponsor our network, or
            collaborate on upcoming cannabis culture projects.
          </p>
        </header>

        {/* 🧾 Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#fffdf8] border border-gray-300 rounded-xl p-8 shadow-sm space-y-6"
        >
          {/* Company */}
          <div>
            <label className="block font-semibold mb-2">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="w-full border border-gray-400 rounded-md px-3 py-2"
            />
          </div>

          {/* Contact / Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2">Contact Name</label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                required
                className="w-full border border-gray-400 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-400 rounded-md px-3 py-2"
              />
            </div>
          </div>

          {/* Phone / Website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Website / Social</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full border border-gray-400 rounded-md px-3 py-2"
              />
            </div>
          </div>

          {/* Type of Request */}
          <div>
            <label className="block font-semibold mb-2">Type of Request</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-md px-3 py-2 bg-white"
            >
              <option value="Sponsorship">Sponsorship</option>
              <option value="Advertisement">Advertisement</option>
              <option value="Article Feature">Article Feature</option>
              <option value="Collaboration">Collaboration</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block font-semibold mb-2">Message / Details</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us about your business or what you’d like to promote..."
              className="w-full border border-gray-400 rounded-md px-3 py-2"
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition"
          >
            Submit Application
          </button>

          {/* Status */}
          {status && (
            <p className="text-center text-sm text-gray-700 mt-4">{status}</p>
          )}
        </form>

        {/* Footer */}
        <footer className="text-center py-6 text-gray-500 text-sm border-t border-gray-200 mt-16">
          © {new Date().getFullYear()} Green Rush Nation — All Rights Reserved.
        </footer>
      </div>
    </main>
  );
}
