"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PageFlipper() {
  const params = useSearchParams();
  const currentPage = parseInt(params.get("page") || "1");

  const totalPages = 3;
  const nextPage = currentPage < totalPages ? currentPage + 1 : 1;
  const prevPage = currentPage > 1 ? currentPage - 1 : totalPages;

  return (
    <footer className="w-full border-t border-gray-300 mt-16 py-10 text-gray-600 text-sm font-serif flex justify-between items-center max-w-[1100px] mx-auto px-10">
      <Link
        href={`/news?page=${prevPage}`}
        className="hover:underline underline-offset-4 hover:text-black transition"
      >
        ← Previous Page
      </Link>

      <Link
        href={`/news?page=${nextPage}`}
        className="hover:underline underline-offset-4 hover:text-black transition"
      >
        Next Page →
      </Link>
    </footer>
  );
}
