"use client";

export const dynamic = "force-dynamic"; // ✅ keep this
// ❌ remove "export const revalidate = 0;"

import { useSearchParams } from "next/navigation";
import FrontPage from "./FrontPage";
import AdvertisingPage from "./AdvertisingPage";
import ArticlePage from "./ArticlePage";
import PageFlipper from "./PageFlipper";

export default function NewsRouter() {
  const params = useSearchParams();
  const view = params.get("view");

  let content;
  if (view === "advertising") content = <AdvertisingPage />;
  else if (view === "article") content = <ArticlePage />;
  else content = <FrontPage />;

  return (
    <main className="min-h-screen flex flex-col bg-[#f7f4ec] text-[#111] font-serif">
      <div className="flex-grow">{content}</div>
      <footer className="border-t border-gray-300 py-6 mt-auto">
      </footer>
    </main>
  );
}
