import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { WalletButton } from "@/components/WalletButton";
import { DisconnectWalletButton } from "@/components/DisconnectWalletButton";

export const metadata: Metadata = { title: "Profile" };

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?next=/profile");

  const displayName =
    user.display_name ?? user.github_username ?? user.email ?? "Anonymous";
  const initial = displayName[0].toUpperCase();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "36px",
        maxWidth: "560px",
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
          § profile
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
          Your account.
        </h1>
      </header>

      {/* Identity card */}
      <div
        className="card"
        style={{
          padding: "24px",
          display: "flex",
          gap: "20px",
          alignItems: "flex-start",
        }}
      >
        {user.avatar_url ? (
          <Image
            src={user.avatar_url}
            alt={displayName}
            width={56}
            height={56}
            style={{
              borderRadius: "50%",
              border: "2px solid var(--ink)",
              flexShrink: 0,
            }}
          />
        ) : (
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "var(--accent)",
              border: "2px solid var(--ink)",
              color: "white",
              fontSize: "1.25rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {initial}
          </div>
        )}

        <div
          style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}
        >
          <div
            style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--text)" }}
          >
            {displayName}
          </div>
          {user.github_username && (
            <div
              style={{
                fontSize: "0.8125rem",
                color: "var(--text-muted)",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              @{user.github_username}
            </div>
          )}
          {user.email && (
            <div style={{ fontSize: "0.8125rem", color: "var(--text-dim)" }}>
              {user.email}
            </div>
          )}
        </div>
      </div>

      {/* Wallet section */}
      <div
        className="card"
        style={{
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
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
          Connected wallet
        </div>

        {user.wallet_address ? (
          <div
            style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}
          >
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.875rem",
                color: "var(--text)",
              }}
            >
              {shortenAddress(user.wallet_address)}
            </span>
            <span
              style={{
                fontSize: "0.6875rem",
                fontWeight: 600,
                color: "var(--savings)",
                background: "var(--yerba-soft)",
                border: "1.5px solid var(--savings)",
                padding: "2px 8px",
                borderRadius: "999px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Connected
            </span>
            <DisconnectWalletButton />
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--text-dim)",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Link a wallet to your account to pay for runs and receive agent
              payouts.
            </p>
            <WalletButton
              currentWalletAddress={null}
              label="Connect a wallet to your account"
            />
          </div>
        )}
      </div>
    </div>
  );
}
