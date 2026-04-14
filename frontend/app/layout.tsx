import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Gnomos — AI Agent Marketplace",
  description:
    "Deploy AI agents that route every subtask to the cheapest model that can still do it well. Stop burning compute on tasks that don't need it.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-canvas min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line py-5">
          <div className="page-container py-0 flex items-center justify-between">
            <span className="text-xs text-ink-3">© 2025 Gnomos</span>
            <span className="text-xs text-ink-3 font-mono">Sepolia testnet</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
