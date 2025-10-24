"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const FrontPage = dynamic(() => import("./FrontPage"), { ssr: false });
const AdvertisingPage = dynamic(() => import("./AdvertisingPage"), { ssr: false });
const ArticlePage = dynamic(() => import("./ArticlePage"), { ssr: false });
const PageFlipper = dynamic(() => import("./PageFlipper"), { ssr: false });

import { useSearchParams } from "next/navigation";

export default function NewsRouter() {
  return (
    <Suspense fallback={<div className="text-center p-10 text-gray-500">Loading...</div>}>
      <NewsRouterInner />
    </Suspense>
  );
}

function NewsRouterInner() {
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
        <PageFlipper />
      </footer>
    </main>
  );
}
