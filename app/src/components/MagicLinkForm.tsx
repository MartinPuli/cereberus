"use client";

import { useState, useTransition } from "react";
import { sendMagicLink } from "@/lib/auth-actions";

export function MagicLinkForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const target = email;
    setError(null);
    startTransition(async () => {
      try {
        await sendMagicLink(target);
        setSentTo(target);
        setSent(true);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to send magic link",
        );
      }
    });
  }

  if (sent) {
    return (
      <div
        className="card"
        style={{ padding: "20px 24px", background: "var(--yerba-soft)" }}
      >
        <div
          style={{ fontSize: "0.875rem", color: "var(--ink)", lineHeight: 1.65 }}
        >
          Check your email — we sent a magic link to{" "}
          <strong>{sentTo}</strong>.
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="card"
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label
          style={{
            fontSize: "0.625rem",
            fontWeight: 600,
            color: "var(--ink)",
            textTransform: "uppercase",
            letterSpacing: "0.24em",
          }}
        >
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-neo"
          placeholder="you@example.com"
          required
        />
      </div>

      {error && (
        <div
          style={{
            fontSize: "0.8125rem",
            color: "var(--ink)",
            background: "var(--pink-soft)",
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1.5px solid var(--ink)",
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        style={{
          alignSelf: "flex-start",
          padding: "8px 18px",
          border: "2px solid var(--ink)",
          borderRadius: "8px",
          background: isPending ? "var(--bg-elev2)" : "var(--bg)",
          boxShadow: isPending ? "none" : "2px 2px 0 var(--ink)",
          fontSize: "0.8125rem",
          fontWeight: 600,
          color: "var(--ink)",
          cursor: isPending ? "wait" : "pointer",
          opacity: isPending ? 0.6 : 1,
          transition: "box-shadow 0.1s, opacity 0.1s",
        }}
      >
        {isPending ? "Sending…" : "Send magic link"}
      </button>
    </form>
  );
}
