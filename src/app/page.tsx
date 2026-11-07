"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAccount, useReadContract } from "wagmi";
import { Navbar } from "@/components/Navbar";
import { StatsOverview } from "@/components/StatsOverview";
import { CreateChallengeForm } from "@/components/CreateChallengeForm";
import { ChallengeCard } from "@/components/ChallengeCard";
import { CHALLENGE_ME_ABI, ChallengeItem } from "@/contracts/ChallengeMeABI";
import { CONTRACT_ADDRESS, EXPLORER_URL, BOTCHAIN_WEBSITE } from "@/config/wagmi";
import {
  Sparkles,
  Filter,
  Users,
  User,
  RefreshCw,
  Search,
  ExternalLink,
  Globe,
  Layers,
} from "lucide-react";

type FilterType = "all" | "active" | "completed" | "expired";
type TabType = "community" | "mine";

export default function HomePage() {
  const { address, isConnected } = useAccount();

  // Dynamic live clock for accurate countdowns and expiration calculation
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(() =>
    Math.floor(Date.now() / 1000)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeSec(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter & tab states
  const [activeTab, setActiveTab] = useState<TabType>("community");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Read all challenges on-chain from contract
  const {
    data: rawChallenges,
    isLoading: isLoadingChallenges,
    isRefetching,
    refetch: refetchChallenges,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CHALLENGE_ME_ABI,
    functionName: "getAllChallenges",
    query: {
      enabled:
        Boolean(CONTRACT_ADDRESS) &&
        CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000",
      refetchInterval: 12000,
    },
  });

  const challenges: ChallengeItem[] = useMemo(() => {
    if (!rawChallenges || !Array.isArray(rawChallenges)) return [];
    // Clone and reverse so newest challenges show at the top
    return [...rawChallenges].reverse();
  }, [rawChallenges]);

  // Filtered challenges based on tab, filter, and search
  const filteredChallenges = useMemo(() => {
    return challenges.filter((c) => {
      // Tab filter
      if (activeTab === "mine") {
        if (!address) return false;
        if (c.creator.toLowerCase() !== address.toLowerCase()) return false;
      }

      // Status filter
      const isPast = Number(c.deadline) <= currentTimeSec;
      if (activeFilter === "completed" && !c.isCompleted) return false;
      if (activeFilter === "active" && (c.isCompleted || isPast)) return false;
      if (activeFilter === "expired" && (c.isCompleted || !isPast)) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchDesc = c.description.toLowerCase().includes(q);
        const matchCreator = c.creator.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCreator) return false;
      }

      return true;
    });
  }, [challenges, activeTab, activeFilter, searchQuery, address, currentTimeSec]);

  return (
    <div className="min-h-screen flex flex-col bg-charcoal-950">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Hero Section */}
        <div className="relative mb-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-charcoal-850 border border-brand-purple-border/40 text-xs font-medium text-brand-purple-light mb-3">
              <img src="/botchain-logo.png" alt="BOT Chain" className="h-3.5 w-3.5 rounded-sm object-contain" />
              <span>BOT Chain Mainnet Ecosystem</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Set a challenge. <br className="sm:hidden" />
              <span className="gradient-purple-text">Prove you did it.</span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-2xl">
              Lock in your personal targets on BOT Chain. Meet your deadlines, submit proof of completion, and immortalize your achievements on-chain.
            </p>
          </div>

          <div className="mt-6 sm:mt-0 flex flex-col sm:items-end gap-2 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500">Network:</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                <img src="/botchain-logo.png" alt="BOT Chain" className="h-3.5 w-3.5 rounded-sm object-contain" />
                <span>BOT Chain (Chain ID: 677)</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500">Mainnet Contract:</span>
              <a
                href={`${EXPLORER_URL}/address/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-brand-purple-light underline hover:text-white"
              >
                <img src="/botchain-logo.png" alt="BOT Chain" className="h-3 w-3 rounded-sm object-contain" />
                <span>{CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-1">
              <a
                href={BOTCHAIN_WEBSITE}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-charcoal-850 hover:bg-charcoal-800 border border-charcoal-700 text-[11px] text-zinc-300 hover:text-white transition"
              >
                <img src="/botchain-logo.png" alt="BOT Chain" className="h-3 w-3 rounded-sm object-contain" />
                <span>botchain.ai</span>
                <ExternalLink className="h-2.5 w-2.5 opacity-60" />
              </a>

              <a
                href={`${EXPLORER_URL}/address/${CONTRACT_ADDRESS}#code`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-600/50 text-[11px] text-emerald-300 hover:text-white transition"
              >
                <img src="/botchain-logo.png" alt="BOT Chain" className="h-3 w-3 rounded-sm object-contain" />
                <span>Verified Contract on Explorer</span>
                <ExternalLink className="h-2.5 w-2.5 opacity-70" />
              </a>
            </div>
          </div>
        </div>

        {/* Global Statistics */}
        <StatsOverview
          challenges={challenges}
          userAddress={address}
          currentTimeSec={currentTimeSec}
        />

        {/* Main Grid: Left = Create Challenge, Right = Challenges List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Create Challenge Form Column */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
            <CreateChallengeForm
              onSuccess={() => {
                refetchChallenges();
              }}
            />
          </div>

          {/* Challenges Listing Column */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Header controls: Tabs, Filters, Refresh */}
            <div className="rounded-2xl border border-charcoal-700/80 bg-charcoal-850/80 p-4 sm:p-5 shadow-sm space-y-4">
              {/* Tab selector */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center p-1 rounded-xl bg-charcoal-900 border border-charcoal-700">
                  <button
                    onClick={() => setActiveTab("community")}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                      activeTab === "community"
                        ? "bg-charcoal-800 text-white shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <Users className="h-3.5 w-3.5" />
                    <span>Community Challenges</span>
                    <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-charcoal-700 text-zinc-300">
                      {challenges.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("mine")}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                      activeTab === "mine"
                        ? "bg-charcoal-800 text-white shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <User className="h-3.5 w-3.5" />
                    <span>My Challenges</span>
                    {isConnected && (
                      <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-charcoal-700 text-zinc-300">
                        {
                          challenges.filter(
                            (c) =>
                              address &&
                              c.creator.toLowerCase() === address.toLowerCase()
                          ).length
                        }
                      </span>
                    )}
                  </button>
                </div>

                {/* Refresh and Search row */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-48">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Search title, description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-brand-purple/60 transition"
                    />
                  </div>

                  <button
                    onClick={() => refetchChallenges()}
                    disabled={isRefetching || isLoadingChallenges}
                    title="Refresh data from blockchain"
                    className="p-2 rounded-xl bg-charcoal-900 border border-charcoal-700 hover:bg-charcoal-800 text-zinc-400 hover:text-white transition disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${
                        isRefetching || isLoadingChallenges ? "animate-spin" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-charcoal-800">
                <span className="text-xs text-zinc-400 flex items-center gap-1 mr-1">
                  <Filter className="h-3 w-3" /> Filter:
                </span>

                {(["all", "active", "completed", "expired"] as FilterType[]).map(
                  (f) => {
                    const label =
                      f === "all"
                        ? "All Challenges"
                        : f.charAt(0).toUpperCase() + f.slice(1);
                    const isCurrent = activeFilter === f;

                    return (
                      <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`px-3 py-1 rounded-xl text-xs font-medium transition ${
                          isCurrent
                            ? f === "completed"
                              ? "bg-emerald-950/70 text-brand-green-light border border-brand-green-border"
                              : f === "active"
                              ? "bg-brand-purple-muted/70 text-brand-purple-light border border-brand-purple-border"
                              : "bg-charcoal-800 text-white border border-zinc-600/80"
                            : "bg-charcoal-900 text-zinc-400 hover:text-zinc-200 border border-charcoal-700"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Loading state */}
            {isLoadingChallenges && (
              <div className="py-16 text-center">
                <div className="inline-block p-4 rounded-2xl bg-charcoal-850 border border-charcoal-700 mb-3 animate-pulse">
                  <RefreshCw className="h-6 w-6 text-brand-purple-light animate-spin mx-auto" />
                </div>
                <p className="text-sm font-medium text-zinc-300">
                  Loading challenges from BOT Chain...
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  Querying immutable ledger state
                </p>
              </div>
            )}

            {/* Empty state: Not connected for My Challenges */}
            {!isLoadingChallenges && activeTab === "mine" && !isConnected && (
              <div className="rounded-2xl border border-charcoal-700/80 bg-charcoal-850/50 p-10 text-center">
                <div className="w-12 h-12 rounded-2xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center mx-auto mb-3 text-zinc-400">
                  <User className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-white">
                  Connect your MetaMask Wallet
                </h3>
                <p className="mt-1 text-xs text-zinc-400 max-w-sm mx-auto">
                  Connect your wallet to view challenges you have created, submit proof of completion, and track your active commitments.
                </p>
              </div>
            )}

            {/* Empty state: No items found */}
            {!isLoadingChallenges &&
              filteredChallenges.length === 0 &&
              (activeTab !== "mine" || isConnected) && (
                <div className="rounded-2xl border border-dashed border-charcoal-700/90 bg-charcoal-850/40 p-12 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-charcoal-800/80 border border-charcoal-700 flex items-center justify-center mx-auto mb-3 text-brand-purple-light">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-medium text-white">
                    {searchQuery
                      ? "No matching challenges found"
                      : activeTab === "mine"
                      ? "You haven't created any challenges yet"
                      : activeFilter === "all"
                      ? "No challenges on-chain yet"
                      : `No ${activeFilter} challenges`}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-400 max-w-sm mx-auto">
                    {searchQuery
                      ? "Try searching for a different keyword or reset your filter."
                      : activeTab === "mine"
                      ? "Set your first challenge using the form on the left!"
                      : "Be the pioneer: submit the first verifiable challenge to BOT Chain."}
                  </p>
                </div>
              )}

            {/* Challenges Cards Grid */}
            {!isLoadingChallenges && filteredChallenges.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {filteredChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id.toString()}
                    challenge={challenge}
                    userAddress={address}
                    currentTimeSec={currentTimeSec}
                    onRefresh={refetchChallenges}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* BOT Chain Ecosystem Feature Banner */}
        <section className="mt-16 rounded-2xl border border-charcoal-700/80 bg-gradient-to-br from-charcoal-900 via-charcoal-850 to-charcoal-900 p-6 sm:p-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center md:text-left">
              <img
                src="/botchain-logo.png"
                alt="BOT Chain"
                className="h-16 w-16 rounded-2xl object-cover bg-black p-1 border border-emerald-500/40 shadow-lg shrink-0"
              />
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Powered by BOT Chain
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-600/50">
                    Chain ID: 677
                  </span>
                </div>
                <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-xl">
                  ChallengeMe leverages BOT Chain’s high-throughput consensus to record immutable personal goals and cryptographic completion proofs.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={BOTCHAIN_WEBSITE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-charcoal-800 hover:bg-charcoal-700 border border-charcoal-600/80 transition shadow-sm"
              >
                <img src="/botchain-logo.png" alt="BOT Chain" className="h-4 w-4 rounded-sm object-contain shrink-0" />
                <span>BOT Chain Website</span>
                <ExternalLink className="h-3 w-3 text-zinc-400" />
              </a>

              <a
                href={EXPLORER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-brand-green hover:from-emerald-500 hover:to-brand-green-light transition shadow-md shadow-emerald-950/40"
              >
                <img src="/botchain-logo.png" alt="BOT Chain" className="h-4 w-4 rounded-sm object-contain shrink-0" />
                <span>BOT Chain Explorer</span>
                <ExternalLink className="h-3 w-3 text-white" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-charcoal-800 bg-charcoal-950 py-8 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-charcoal-850">
            <div className="flex items-center gap-3">
              <img src="/botchain-logo.png" alt="BOT Chain" className="h-8 w-8 rounded-lg object-contain bg-black p-0.5 border border-emerald-500/30" />
              <div>
                <span className="font-semibold text-white">ChallengeMe</span>
                <span className="mx-2 text-zinc-600">•</span>
                <span className="text-zinc-400">Set a challenge. Prove you did it.</span>
              </div>
            </div>

            {/* Required Ecosystem Links with Logo at Front */}
            <div className="flex flex-wrap items-center gap-6 text-xs">
              <a
                href={BOTCHAIN_WEBSITE}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition inline-flex items-center gap-2 group"
              >
                <img src="/botchain-logo.png" alt="BOT Chain" className="h-4 w-4 rounded-sm object-contain shrink-0 group-hover:scale-105 transition" />
                <span>BOT Chain Website:</span>
                <span className="text-emerald-400 underline">https://botchain.ai</span>
              </a>

              <a
                href={EXPLORER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition inline-flex items-center gap-2 group"
              >
                <img src="/botchain-logo.png" alt="BOT Chain" className="h-4 w-4 rounded-sm object-contain shrink-0 group-hover:scale-105 transition" />
                <span>BOT Chain Explorer:</span>
                <span className="text-emerald-400 underline">https://scan.botchain.ai</span>
              </a>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-500">
            <div className="inline-flex items-center gap-1.5">
              <img src="/botchain-logo.png" alt="BOT Chain" className="h-3.5 w-3.5 rounded-sm object-contain shrink-0" />
              <span>Mainnet Contract:</span>
              <a
                href={`${EXPLORER_URL}/address/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-zinc-300 hover:text-emerald-400 underline font-semibold"
              >
                {CONTRACT_ADDRESS}
              </a>
            </div>
            <div>
              © 2026 ChallengeMe. Running natively on BOT Chain (Chain ID: 677).
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
