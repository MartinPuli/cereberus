"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function DisconnectWalletButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function disconnect() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/profile/wallet", { method: "DELETE" });
        if (!res.ok) {
          const j = await res.json().catch(() => ({})) as { error?: { message?: string } };
          setError(j.error?.message ?? "Failed to disconnect wallet");
          return;
        }
        router.refresh();
      } catch {
        setError("Failed to disconnect wallet");
      }
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <button
        onClick={disconnect}
        disabled={isPending}
        style={{
          padding: "4px 12px",
          border: "1.5px solid var(--ink)",
          borderRadius: "8px",
          background: "transparent",
          fontSize: "0.75rem",
          fontWeight: 600,
          color: "var(--ink)",
          cursor: isPending ? "wait" : "pointer",
          opacity: isPending ? 0.5 : 1,
          transition: "opacity 0.1s",
        }}
      >
        {isPending ? "Disconnecting…" : "Disconnect"}
      </button>
      {error && (
        <div
          style={{
            fontSize: "0.75rem",
            color: "var(--ink)",
            background: "var(--pink-soft)",
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid var(--ink)",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
