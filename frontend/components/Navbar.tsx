"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutGrid, Play, PlusCircle } from "lucide-react";

const NAV = [
  { href: "/",            label: "Marketplace", icon: LayoutGrid  },
  { href: "/orchestrate", label: "Orchestrate",  icon: Play        },
  { href: "/register",    label: "Add agent",    icon: PlusCircle  },
];

export function Navbar() {
  const path = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-page/90 backdrop-blur-sm border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center gap-6">

        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          {/* Gnomo icon — a simple geometric mark */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
            <circle cx="10" cy="10" r="9" fill="#6B5CE7" fillOpacity="0.12"/>
            <path d="M10 4 L14.5 12 L5.5 12 Z" fill="#6B5CE7"/>
            <circle cx="10" cy="15" r="1.5" fill="#6B5CE7" fillOpacity="0.5"/>
          </svg>
          <span className="font-semibold text-sm text-ink tracking-tight">Gnomos</span>
        </Link>

        {/* Separator */}
        <div className="h-4 w-px bg-line" />

        {/* Nav links */}
        <nav className="flex items-center gap-0.5 flex-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = path === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm transition-colors duration-100",
                  active
                    ? "text-ink bg-subtle font-medium"
                    : "text-ink-2 hover:text-ink hover:bg-subtle/70",
                )}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Wallet */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-subtle border border-line text-xs text-ink-2 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-ok animate-pulse-dot" />
            <span className="hidden sm:inline">0x1a2b…ef12</span>
          </div>
        </div>

      </div>
    </header>
  );
}
