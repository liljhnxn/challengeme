"use client";

import React, { useState } from "react";
import { ChallengeItem } from "@/contracts/ChallengeMeABI";
import {
  shortenAddress,
  formatTimestamp,
  calculateTimeRemaining,
} from "@/lib/utils";
import { CompleteModal } from "./CompleteModal";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  User,
  Calendar,
  Sparkles,
  Link as LinkIcon,
  Check,
} from "lucide-react";

interface ChallengeCardProps {
  challenge: ChallengeItem;
  userAddress?: `0x${string}`;
  currentTimeSec: number;
  onRefresh?: () => void;
}

export function ChallengeCard({
  challenge,
  userAddress,
  currentTimeSec,
  onRefresh,
}: ChallengeCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const isCreator =
    !!userAddress &&
    challenge.creator.toLowerCase() === userAddress.toLowerCase();

  const isCompleted = challenge.isCompleted;
  const timeInfo = calculateTimeRemaining(challenge.deadline, currentTimeSec);
  const isExpired = !isCompleted && timeInfo.isExpired;

  // Check if proof looks like a valid web URL
  const isProofUrl =
    challenge.proof &&
    (challenge.proof.startsWith("http://") || challenge.proof.startsWith("https://"));

  return (
    <>
      <div
        className={`group relative rounded-2xl border transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between ${
          isCompleted
            ? "border-brand-green/30 bg-charcoal-850/70 hover:border-brand-green/50 hover:shadow-lg hover:shadow-emerald-950/20"
            : isExpired
            ? "border-charcoal-700/70 bg-charcoal-850/50 hover:border-zinc-600/60"
            : "border-charcoal-700/80 bg-charcoal-850/80 hover:border-brand-purple/50 hover:shadow-lg hover:shadow-purple-950/20"
        }`}
      >
        <div>
          {/* Top badges bar */}
          <div className="flex items-center justify-between gap-2 mb-3.5">
            {/* Status Badge */}
            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/60 text-brand-green-light border border-brand-green-border/50">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Completed</span>
              </span>
            ) : isExpired ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-900/80 text-zinc-400 border border-zinc-700/60">
                <AlertCircle className="h-3.5 w-3.5 text-zinc-400" />
                <span>{timeInfo.text}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-purple-muted/50 text-brand-purple-light border border-brand-purple-border/50">
                <Clock className="h-3.5 w-3.5 text-brand-purple-light" />
                <span className="font-mono">{timeInfo.text}</span>
              </span>
            )}

            {/* Ownership tag & ID */}
            <div className="flex items-center gap-2 text-xs">
              {isCreator && (
                <span className="px-2 py-0.5 rounded-md bg-purple-950/40 text-brand-purple-light border border-purple-800/40 font-mono text-[10px]">
                  Your Challenge
                </span>
              )}
              <span className="font-mono text-zinc-500 text-[11px]">
                #{challenge.id.toString()}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight group-hover:text-zinc-100 transition break-words">
            {challenge.title}
          </h3>

          {/* Description */}
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed break-words">
            {challenge.description}
          </p>

          {/* Proof Section if Completed */}
          {isCompleted && (
            <div className="mt-4 p-3.5 rounded-xl bg-charcoal-900/80 border border-brand-green-border/40 text-xs">
              <div className="flex items-center justify-between text-[11px] text-brand-green-light font-medium mb-1">
                <span className="flex items-center gap-1">
                  <Check className="h-3 w-3" /> Submitted Proof
                </span>
                {challenge.completedAt > 0n && (
                  <span className="text-zinc-500 font-mono">
                    {formatTimestamp(challenge.completedAt)}
                  </span>
                )}
              </div>
              <div className="text-zinc-200 break-all font-sans">
                {isProofUrl ? (
                  <a
                    href={challenge.proof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-brand-green-light underline hover:text-white transition"
                  >
                    <LinkIcon className="h-3 w-3 shrink-0" />
                    <span>{challenge.proof}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                ) : (
                  <span>{challenge.proof}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer info & Actions */}
        <div className="mt-5 pt-4 border-t border-charcoal-800/80 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            {/* Creator and Deadline Meta */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <User className="h-3.5 w-3.5 text-zinc-500" />
                <span>Creator:</span>
                <a
                  href={`https://scan.bohr.life/address/${challenge.creator}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-zinc-300 hover:text-brand-purple-light transition inline-flex items-center gap-1"
                >
                  <span>{shortenAddress(challenge.creator)}</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                </a>
              </div>

              <div className="flex items-center gap-1.5 text-zinc-400">
                <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                <span>Deadline:</span>
                <span className="text-zinc-300 font-mono text-[11px]">
                  {formatTimestamp(challenge.deadline)}
                </span>
              </div>
            </div>

            {/* Action button for Creator if not completed */}
            {isCreator && !isCompleted && (
              <div className="pt-2 sm:pt-0">
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-brand-green hover:from-emerald-500 hover:to-brand-green-light transition shadow-sm active:scale-[0.98]"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Submit Proof & Complete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complete Modal */}
      <CompleteModal
        challenge={challenge}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          if (onRefresh) onRefresh();
        }}
      />
    </>
  );
}

