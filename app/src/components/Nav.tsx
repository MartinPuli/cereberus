import Link from "next/link";

export function Nav() {
  return (
    <nav className="border-b border-[var(--border)] px-6 py-4 flex items-center gap-6">
      <Link href="/" className="font-bold text-lg tracking-tight">
        ⟐ <span className="text-[var(--accent)]">Nomos</span>
      </Link>
      <div className="flex gap-5 text-sm text-[var(--text-dim)]">
        <Link href="/" className="hover:text-white">Squads</Link>
        <Link href="/onboarding" className="hover:text-white">Get started</Link>
        <Link href="/inbox" className="hover:text-white">My inbox</Link>
      </div>
      <div className="ml-auto text-xs text-[var(--text-dim)]">
        rent-a-squad · subscription · multi-vertical
      </div>
    </nav>
  );
}
