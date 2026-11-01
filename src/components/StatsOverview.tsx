"use client";

import React from "react";
import { ChallengeItem } from "@/contracts/ChallengeMeABI";
import { Award, CheckCircle2, Clock, Flame, UserCheck } from "lucide-react";

interface StatsOverviewProps {
  challenges: readonly ChallengeItem[] | ChallengeItem[];
  userAddress?: `0x${string}`;
  currentTimeSec: number;
}

export function StatsOverview({
  challenges,
  userAddress,
  currentTimeSec,
}: StatsOverviewProps) {
  const total = challenges.length;

  let completed = 0;
  let active = 0;
  let userCount = 0;

  for (const c of challenges) {
    if (c.isCompleted) {
      completed++;
    } else if (Number(c.deadline) > currentTimeSec) {
      active++;
    }

    if (userAddress && c.creator.toLowerCase() === userAddress.toLowerCase()) {
      userCount++;
    }
  }

  const statItems = [
    {
      label: "Total Challenges",
      value: total,
      subtext: "On-chain platform goals",
      icon: Award,
      accentClass: "text-zinc-300 border-charcoal-700 bg-charcoal-850/60",
      iconBg: "bg-charcoal-800 text-zinc-300",
    },
    {
      label: "Active Challenges",
      value: active,
      subtext: "In progress & ticking",
      icon: Clock,
      accentClass: "border-brand-purple/30 bg-charcoal-850/60 hover:border-brand-purple/50",
      iconBg: "bg-brand-purple-muted/50 text-brand-purple-light",
    },
    {
      label: "Completed",
      value: completed,
      subtext: "Proven with on-chain records",
      icon: CheckCircle2,
      accentClass: "border-brand-green/30 bg-charcoal-850/60 hover:border-brand-green/50",
      iconBg: "bg-brand-green-muted/50 text-brand-green-light",
    },
    {
      label: "Your Challenges",
      value: userAddress ? userCount : "—",
      subtext: userAddress ? "Personal commitments" : "Connect MetaMask",
      icon: UserCheck,
      accentClass: "border-charcoal-700 bg-charcoal-850/60 hover:border-zinc-500/50",
      iconBg: "bg-charcoal-800 text-zinc-300",
    },
  ];

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 my-6">
      {statItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className={`p-5 rounded-2xl border transition-all duration-200 shadow-sm ${item.accentClass}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-medium text-zinc-400">
                {item.label}
              </span>
              <div className={`p-2 rounded-xl ${item.iconBg}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
                {item.value}
              </span>
            </div>
            <p className="mt-1 text-[11px] sm:text-xs text-zinc-400 truncate">
              {item.subtext}
            </p>
          </div>
        );
      })}
    </section>
  );
}

