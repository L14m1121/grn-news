"use client";
import { useSearchParams } from "next/navigation";
import FrontPage from "./FrontPage";
import AdvertisingPage from "./AdvertisingPage";
import ArticlePage from "./ArticlePage";
import PageFlipper from "./PageFlipper";

export default function NewsRouter() {
  const params = useSearchParams();
  const view = params.get("view"); // ex: ?view=advertising

  let content;
  if (view === "advertising") content = <AdvertisingPage />;
  else if (view === "article") content = <ArticlePage />;
  else content = <FrontPage />;

  return (
    <main className="min-h-screen flex flex-col bg-[#f7f4ec] text-[#111] font-serif">
      {/* Page Content */}
      <div className="flex-grow">{content}</div>

      {/* Bottom Bar */}
      <footer className="border-t border-gray-300 py-6 mt-auto">
        <PageFlipper />
      </footer>
    </main>
  );
}
