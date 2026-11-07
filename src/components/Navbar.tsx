"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { shortenAddress } from "@/lib/utils";
import { botchainMainnet, targetChainId, EXPLORER_URL } from "@/config/wagmi";
import {
  ShieldCheck,
  Wallet,
  LogOut,
  ChevronDown,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

export function Navbar({ onOpenCreateModal }: { onOpenCreateModal?: () => void }) {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isWrongNetwork = isConnected && chain && chain.id !== targetChainId && chain.id !== 31337;
  const isMainnet = targetChainId === 677;

  const handleConnect = () => {
    const metaMaskConnector =
      connectors.find((c) => c.name.toLowerCase().includes("metamask") || c.id === "metaMaskSDK" || c.id === "injected") ||
      connectors[0];

    if (metaMaskConnector) {
      connect({ connector: metaMaskConnector });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-charcoal-700/60 bg-charcoal-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-brand-purple/20 to-brand-green/20 border border-brand-purple/40 flex items-center justify-center text-brand-purple-light shadow-sm">
              <ShieldCheck className="h-6 w-6 text-brand-purple-light" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">
                  Challenge<span className="text-brand-purple-light">Me</span>
                </span>
                <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                  isMainnet
                    ? "bg-emerald-950/60 text-brand-green-light border-brand-green-border/50"
                    : "bg-brand-purple-muted/60 text-brand-purple-light border-brand-purple-border/50"
                }`}>
                  {isMainnet ? "Botchain Mainnet" : "Botchain Testnet"}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-normal hidden sm:block">
                Set a challenge. Prove you did it.
              </p>
            </div>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            {/* Create Challenge Quick Trigger if passed */}
            {onOpenCreateModal && (
              <button
                onClick={onOpenCreateModal}
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-charcoal-850 hover:bg-charcoal-800 text-zinc-200 border border-charcoal-700/80 transition shadow-sm"
              >
                <span>+ New Challenge</span>
              </button>
            )}

            {/* Wrong Network Warning */}
            {isWrongNetwork && (
              <button
                onClick={() => switchChain({ chainId: targetChainId })}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-950/60 text-amber-300 border border-amber-600/50 hover:bg-amber-900/60 transition"
                title={`Click to switch to ${isMainnet ? "Botchain Mainnet (677)" : "Botchain Testnet (968)"}`}
              >
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden xs:inline">Switch to {isMainnet ? "Mainnet" : "Testnet"}</span>
              </button>
            )}

            {/* Wallet Connection */}
            {!isConnected ? (
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-purple-700 to-brand-purple hover:from-purple-600 hover:to-brand-purple-light transition-all shadow-md hover:shadow-purple-900/30 active:scale-[0.98] disabled:opacity-60"
              >
                <Wallet className="h-4 w-4" />
                <span>{isConnecting ? "Connecting..." : "Connect MetaMask"}</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-charcoal-850 border border-charcoal-700 hover:border-brand-purple/50 transition text-sm text-zinc-200"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs">{shortenAddress(address)}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-xl bg-charcoal-900 border border-charcoal-700 shadow-xl py-2 z-50 text-xs text-zinc-300"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-charcoal-800">
                      <div className="text-[11px] text-zinc-500 font-mono">Connected Account</div>
                      <div className="font-mono font-medium text-white break-all">{address}</div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-400">
                        <span>Network:</span>
                        <span className="text-brand-purple-light font-medium">
                          {chain?.name || (isMainnet ? "Botchain (677)" : "Botchain (968)")}
                        </span>
                      </div>
                    </div>

                    <a
                      href={`${EXPLORER_URL}/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 hover:bg-charcoal-800 text-zinc-300 hover:text-white transition"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>View on {isMainnet ? "BotchainScan" : "BohrScan"}</span>
                    </a>

                    <button
                      onClick={() => {
                        disconnect();
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-rose-950/40 text-rose-300 transition text-left"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Disconnect Wallet</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Tagline bar */}
        <div className="pb-3 sm:hidden text-center">
          <p className="text-xs text-zinc-400">Set a challenge. Prove you did it.</p>
        </div>
      </div>
    </header>
  );
}
