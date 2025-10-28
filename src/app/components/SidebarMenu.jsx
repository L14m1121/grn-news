"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function SidebarMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ☰ Hamburger Button — Hidden When Menu Opens */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="fixed top-5 left-6 flex flex-col justify-center items-center w-11 h-11 rounded-md shadow-md bg-[#00a86b] hover:bg-[#008c5e] text-white z-[60] transition"
        >
          <span className="block w-5 h-[2px] bg-white mb-1"></span>
          <span className="block w-4 h-[2px] bg-white mb-1"></span>
          <span className="block w-3 h-[2px] bg-white"></span>
        </button>
      )}

      {/* 🌿 Sidebar Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-72 bg-[#0a0a0a] text-white z-[50] shadow-lg flex flex-col justify-between"
          >
            {/* ✖ Close Button */}
            <div className="flex justify-between items-center p-5 border-b border-gray-700">
              <h2 className="text-xl font-extrabold text-[#00a86b]">
                GREEN RUSH
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* 📜 Menu Links */}
            <nav className="flex flex-col space-y-4 px-6 py-6 text-gray-300">
              {[
                ["Health", "/category/health"],
                ["Law", "/category/law"],
                ["Culture", "/category/general"],
                ["Business", "/category/business"],
                ["Politics", "/category/politics"],
                ["Awareness", "/category/awareness"],
                ["Newsletter", "/subscribe"],
                ["Advertising", "/advertising"],
                ["About GRN", "/about"],
              ].map(([label, link]) => (
                <Link
                  key={label}
                  href={link}
                  onClick={() => setOpen(false)}
                  className="hover:text-[#00ff9d] transition"
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* 🔗 Socials */}
            <div className="flex justify-center gap-6 p-6 border-t border-gray-700">
              {[
                ["instagram.pdf", "Instagram", "https://instagram.com/greenrushnation"],
                ["Tiktok.png", "TikTok", "https://tiktok.com/@greenrushnation"],
                ["Youtube.jpg", "YouTube", "https://youtube.com/@greenrushnation"],
                ["X.jpg", "X", "https://x.com/greenrushnation"],
              ].map(([icon, alt, url]) => (
                <a
                  key={alt}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-70 hover:opacity-100 transition"
                >
                  <img
                    src={`/icons/${icon}`}
                    alt={alt}
                    className="w-6 h-6 rounded-full"
                  />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
