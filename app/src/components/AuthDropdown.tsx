"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { logout } from "@/lib/auth-actions";
import type { AuthUser } from "@/lib/auth";

export function AuthDropdown({ user }: { user: AuthUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const displayName =
    user.display_name ?? user.github_username ?? user.email ?? "?";
  const initial = displayName[0].toUpperCase();

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "3px",
          border: "2px solid var(--ink)",
          borderRadius: "999px",
          background: "var(--bg-elev2)",
          cursor: "pointer",
          boxShadow: "2px 2px 0 var(--ink)",
        }}
      >
        {user.avatar_url ? (
          <Image
            src={user.avatar_url}
            alt={displayName}
            width={26}
            height={26}
            style={{ borderRadius: "50%", display: "block" }}
          />
        ) : (
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "var(--accent)",
              color: "white",
              fontSize: "0.75rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {initial}
          </div>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            background: "var(--bg-elev)",
            border: "2px solid var(--ink)",
            borderRadius: "12px",
            boxShadow: "4px 4px 0 var(--ink)",
            minWidth: "190px",
            padding: "8px",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {/* Identity */}
          <div
            style={{
              padding: "8px 10px 10px",
              borderBottom: "1px solid var(--border)",
              marginBottom: "4px",
            }}
          >
            <div
              style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)" }}
            >
              {displayName}
            </div>
            {user.github_username && (
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  fontFamily: "JetBrains Mono, monospace",
                  marginTop: "2px",
                }}
              >
                @{user.github_username}
              </div>
            )}
          </div>

          {/* Profile link */}
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            style={{
              padding: "6px 10px",
              borderRadius: "8px",
              fontSize: "0.875rem",
              color: "var(--text-dim)",
              textDecoration: "none",
              display: "block",
              transition: "background 0.1s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "var(--bg-elev2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            Profile
          </Link>

          {/* Sign out */}
          <form action={logout}>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "6px 10px",
                borderRadius: "8px",
                fontSize: "0.875rem",
                color: "var(--text-dim)",
                background: "transparent",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "var(--bg-elev2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "transparent";
              }}
            >
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
