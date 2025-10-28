"use client";

import { useSearchParams } from "next/navigation";
import FrontPage from "./FrontPage";
import AdvertisingPage from "./AdvertisingPage";
import ArticlePage from "./ArticlePage";
import PageFlipper from "./PageFlipper";

export default function NewsRouter() {
  const params = useSearchParams();
  const view = params.get("view");

  if (view === "advertising") return <AdvertisingPage />;
  if (view === "article") return <ArticlePage />;
  return <FrontPage />;
}
