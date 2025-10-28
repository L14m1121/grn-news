// ✅ server component (no "use client")
import { Suspense } from "react";
import NewsRouter from "./NewsRouter";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default function NewsPage() {
  return (
    <Suspense fallback={<p className="text-center mt-20 text-gray-500">Loading...</p>}>
      <NewsRouter />
    </Suspense>
  );
}
