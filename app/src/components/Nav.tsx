"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/",            label: "Marketplace" },
  { href: "/orchestrate", label: "Hire teams"   },
  { href: "/register",    label: "Supply agent" },
];

export function Nav() {
  const path = usePathname();

  return (
    <nav
      style={{
        borderBottom: "1px solid var(--border)",
        background: "rgba(250,250,249,0.85)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        className="max-w-6xl mx-auto px-6"
        style={{ height: "48px", display: "flex", alignItems: "center", gap: "20px" }}
      >
        {/* Wordmark */}
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0, textDecoration: "none" }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <circle cx="10" cy="10" r="9" fill="#6B5CE7" fillOpacity="0.12" />
            <path d="M10 4 L14.5 12 L5.5 12 Z" fill="#6B5CE7" />
            <circle cx="10" cy="15.5" r="1.5" fill="#6B5CE7" fillOpacity="0.5" />
          </svg>
          <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text)", letterSpacing: "-0.01em" }}>
            Nomos
          </span>
        </Link>

        {/* Divider */}
        <div style={{ width: "1px", height: "16px", background: "var(--border)", flexShrink: 0 }} />

        {/* Links */}
        <div style={{ display: "flex", gap: "2px", flex: 1 }}>
          {LINKS.map(({ href, label }) => {
            const active = path === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  padding: "6px 10px",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  color: active ? "var(--text)" : "var(--text-dim)",
                  background: active ? "var(--bg-elev2)" : "transparent",
                  fontWeight: active ? 500 : 400,
                  transition: "color 0.1s, background 0.1s",
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Wallet pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 10px",
            borderRadius: "8px",
            background: "var(--bg-elev2)",
            border: "1px solid var(--border)",
            fontSize: "0.75rem",
            fontFamily: "monospace",
            color: "var(--text-muted)",
            flexShrink: 0,
          }}
        >
          <span
            className="pulse-dot"
            style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--savings)", flexShrink: 0 }}
          />
          <span className="hidden sm:inline">0x1a2b…ef12</span>
        </div>
      </div>
    </nav>
  );
}
