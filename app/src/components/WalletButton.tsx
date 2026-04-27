"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getWalletClient } from "@/lib/wallet";

interface WalletButtonProps {
  currentWalletAddress?: string | null;
  onLinked?: () => void;
  label?: string;
}

export function WalletButton({
  currentWalletAddress: _unused,
  onLinked,
  label,
}: WalletButtonProps) {
  const router = useRouter();
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      const client = await getWalletClient();
      const accounts = (await client.request({
        method: "eth_requestAccounts",
        params: [],
      })) as string[];
      if (accounts.length === 0) return;

      const address = accounts[0];
      const res = await fetch("/api/profile/wallet", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ wallet_address: address }),
      });
      const j = (await res.json().catch(() => ({}))) as {
        error?: { message?: string };
      };
      if (!res.ok) {
        setError(j.error?.message ?? "Failed to save wallet");
        return;
      }

      if (onLinked) {
        onLinked();
      } else {
        startTransition(() => router.refresh());
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Connection failed";
      if (
        !message.toLowerCase().includes("rejected") &&
        !message.toLowerCase().includes("denied")
      ) {
        setError(message);
      }
    } finally {
      setConnecting(false);
    }
  }, [onLinked, router, startTransition]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <button
        onClick={connect}
        disabled={connecting}
        title={error ?? "Connect MetaMask"}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "8px 18px",
          borderRadius: "8px",
          background: connecting ? "var(--bg-elev2)" : "var(--accent)",
          border: "2px solid var(--ink)",
          boxShadow: connecting ? "none" : "2px 2px 0 var(--ink)",
          fontSize: "0.8125rem",
          fontWeight: 600,
          color: connecting ? "var(--text-muted)" : "white",
          cursor: connecting ? "wait" : "pointer",
          opacity: connecting ? 0.6 : 1,
          alignSelf: "flex-start",
          transition: "box-shadow 0.1s, opacity 0.1s",
        }}
      >
        {connecting ? "Connecting…" : (label ?? "Connect wallet")}
      </button>
      {error && (
        <div
          style={{
            fontSize: "0.75rem",
            color: "var(--ink)",
            background: "var(--pink-soft)",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1.5px solid var(--ink)",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
