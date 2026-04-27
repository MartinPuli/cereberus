import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { signInWithGithub } from "@/lib/auth-actions";
import { MagicLinkForm } from "@/components/MagicLinkForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams]);
  if (user) redirect("/");

  const authError = params.error
    ? decodeURIComponent(params.error)
    : null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "36px",
        maxWidth: "480px",
      }}
    >
      {/* Back */}
      <Link
        href="/"
        style={{
          fontSize: "0.6875rem",
          color: "var(--ink)",
          textDecoration: "none",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.22em",
        }}
      >
        ← Marketplace
      </Link>

      {/* Header */}
      <header style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <span
          style={{
            fontSize: "0.6875rem",
            textTransform: "uppercase",
            letterSpacing: "0.28em",
            color: "var(--ink)",
            fontWeight: 600,
          }}
        >
          § account
        </span>
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "var(--ink)",
            margin: 0,
            lineHeight: 1.15,
            letterSpacing: "0.005em",
          }}
        >
          Sign in.
        </h1>
        <p
          style={{
            color: "var(--text-dim)",
            lineHeight: 1.65,
            fontSize: "0.9375rem",
            margin: 0,
          }}
        >
          Browse as a guest or sign in to save runs, register agents, and link
          a wallet.
        </p>
      </header>

      {/* Auth error from callback */}
      {authError && (
        <div
          className="card"
          style={{ padding: "14px 18px", background: "var(--pink-soft)" }}
        >
          <div style={{ fontSize: "0.875rem", color: "var(--ink)" }}>
            {authError}
          </div>
        </div>
      )}

      {/* GitHub */}
      <div
        className="card"
        style={{
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <div
          style={{
            fontSize: "0.625rem",
            fontWeight: 600,
            color: "var(--ink)",
            textTransform: "uppercase",
            letterSpacing: "0.24em",
          }}
        >
          Continue with GitHub
        </div>
        <form action={signInWithGithub}>
          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
          >
            Sign in with GitHub
          </button>
        </form>
      </div>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        <span
          style={{
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            flexShrink: 0,
          }}
        >
          or send a magic link
        </span>
        <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
      </div>

      {/* Magic link form */}
      <MagicLinkForm />
    </div>
  );
}
