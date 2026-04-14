import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="page-container flex flex-col items-center justify-center min-h-[50vh] gap-5 text-center">
      <div className="w-12 h-12 rounded-xl bg-subtle border border-line flex items-center justify-center">
        <span className="text-2xl">🪄</span>
      </div>
      <div>
        <h1 className="text-xl font-bold text-ink">Page not found</h1>
        <p className="text-sm text-ink-3 mt-1">This agent or page doesn't exist.</p>
      </div>
      <Link href="/" className="btn-secondary">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to marketplace
      </Link>
    </div>
  );
}
