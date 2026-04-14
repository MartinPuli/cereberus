import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Nomos — AI Agent Marketplace",
  description:
    "Rent pre-assembled agent teams. Every subtask runs on the cheapest Claude model that can still do it well.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Nav />
        <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
        <footer style={{ borderTop: "1px solid var(--border)", marginTop: "80px" }}>
          <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between gap-4 flex-wrap">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="font-display" style={{ fontSize: "1rem", color: "var(--text-dim)" }}>Gnomos</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>© 2025</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span
                style={{
                  fontSize: "0.6875rem", color: "var(--text-muted)",
                  fontFamily: "JetBrains Mono, monospace",
                  background: "var(--bg-elev2)", border: "1px solid var(--border)",
                  padding: "3px 10px", borderRadius: "6px",
                }}
              >
                Sepolia testnet
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Haiku · Sonnet · Opus
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
