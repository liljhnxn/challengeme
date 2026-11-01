"use client";

import React, { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CHALLENGE_ME_ABI, ChallengeItem } from "@/contracts/ChallengeMeABI";
import { CONTRACT_ADDRESS } from "@/config/wagmi";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

interface CompleteModalProps {
  challenge: ChallengeItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CompleteModal({
  challenge,
  isOpen,
  onClose,
  onSuccess,
}: CompleteModalProps) {
  const [proof, setProof] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    data: txHash,
    writeContract,
    isPending: isSubmitting,
    error: submitError,
    reset: resetWrite,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const trimmedProof = proof.trim();
    if (!trimmedProof) {
      setErrorMsg("Please provide a proof message or URL.");
      return;
    }

    if (trimmedProof.length > 150) {
      setErrorMsg("Proof cannot exceed 150 characters.");
      return;
    }

    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      setErrorMsg("Contract address not configured.");
      return;
    }

    writeContract(
      {
        address: CONTRACT_ADDRESS,
        abi: CHALLENGE_ME_ABI,
        functionName: "completeChallenge",
        args: [challenge.id, trimmedProof],
      },
      {
        onSuccess: () => {
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  const handleClose = () => {
    if (isSubmitting || isConfirming) return;
    resetWrite();
    setProof("");
    setErrorMsg("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-charcoal-700 bg-charcoal-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-charcoal-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-brand-green-muted/50 text-brand-green-light border border-brand-green-border/40">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Complete Challenge
              </h3>
              <p className="text-xs text-zinc-400">
                Submit on-chain proof for #{challenge.id.toString()}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting || isConfirming}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-charcoal-800 transition disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Challenge summary */}
        <div className="my-4 p-3.5 rounded-xl bg-charcoal-850/70 border border-charcoal-800">
          <span className="text-[11px] font-mono text-brand-purple-light uppercase tracking-wider">
            Goal
          </span>
          <h4 className="text-sm font-medium text-white line-clamp-2 mt-0.5">
            {challenge.title}
          </h4>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium text-zinc-300">
                Proof Message or URL <span className="text-brand-green-light">*</span>
              </label>
              <span
                className={`text-[11px] font-mono ${
                  proof.length > 150 ? "text-rose-400 font-semibold" : "text-zinc-500"
                }`}
              >
                {proof.length}/150
              </span>
            </div>
            <textarea
              rows={3}
              value={proof}
              onChange={(e) => setProof(e.target.value)}
              placeholder="e.g. Completed all 30 days! Check verified log at: https://github.com/..."
              maxLength={150}
              className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-green/60 focus:ring-1 focus:ring-brand-green/60 transition resize-none"
            />
            <p className="mt-1 text-[11px] text-zinc-400">
              Provide a verifiable link (GitHub, Strava, tweet, image) or a descriptive message.
            </p>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-900/50 text-rose-300 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {submitError && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-900/50 text-rose-300 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="break-all">
                {submitError.message?.slice(0, 160) || "Transaction failed."}
              </div>
            </div>
          )}

          {isConfirming && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-950/40 border border-purple-800/50 text-brand-purple-light text-xs animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin text-brand-purple-light" />
              <span>Submitting proof to Botchain... Waiting for confirmation.</span>
            </div>
          )}

          {isConfirmed && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-brand-green-light text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-green-light" />
                <span className="font-medium">Challenge completed and verified!</span>
              </div>
              {txHash && (
                <a
                  href={`https://scan.bohr.life/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex items-center gap-1 underline hover:text-white"
                >
                  <span>View on BohrScan</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting || isConfirming}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-300 hover:text-white hover:bg-charcoal-800 transition disabled:opacity-50"
            >
              {isConfirmed ? "Close" : "Cancel"}
            </button>
            {!isConfirmed && (
              <button
                type="submit"
                disabled={isSubmitting || isConfirming}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-brand-green hover:from-emerald-500 hover:to-brand-green-light transition shadow-md shadow-emerald-950/50 disabled:opacity-50"
              >
                {isSubmitting || isConfirming ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Mark as Completed</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

