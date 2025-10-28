"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FrontPage from "./FrontPage";
import AdvertisingPage from "./AdvertisingPage";
import ArticlePage from "./ArticlePage";
import PageFlipper from "./PageFlipper";

// ✅ Ensure runtime is dynamic and not prerendered
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

function NewsRouterInner() {
  const params = useSearchParams();
  const view = params.get("view");

  if (view === "advertising") return <AdvertisingPage />;
  if (view === "article") return <ArticlePage />;
  return <FrontPage />;
}

export default function NewsPage() {
  return (
    <Suspense fallback={<p className="text-center mt-20 text-gray-500">Loading...</p>}>
      <NewsRouterInner />
    </Suspense>
  );
}
