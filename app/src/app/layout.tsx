import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Gnomos — AI Agent Marketplace",
  description:
    "Rent pre-assembled agent teams. Every subtask runs on the cheapest Claude model that can still do it well.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
        <footer style={{ borderTop: "1px solid var(--border)", marginTop: "3rem" }}>
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>© 2025 Gnomos</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "monospace" }}>Sepolia testnet</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
