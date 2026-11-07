"use client";

import React, { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CHALLENGE_ME_ABI } from "@/contracts/ChallengeMeABI";
import { CONTRACT_ADDRESS, EXPLORER_URL } from "@/config/wagmi";
import {
  Calendar,
  Clock,
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";

interface CreateChallengeFormProps {
  onSuccess?: () => void;
}

export function CreateChallengeForm({ onSuccess }: CreateChallengeFormProps) {
  const { isConnected } = useAccount();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadlineInput, setDeadlineInput] = useState("");
  const [formError, setFormError] = useState("");

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

  // Shortcut setter for common deadlines
  const setQuickDeadline = (hoursFromNow: number) => {
    const target = new Date(Date.now() + hoursFromNow * 3600 * 1000);
    // Format to YYYY-MM-DDTHH:mm for datetime-local
    const offset = target.getTimezoneOffset();
    const local = new Date(target.getTime() - offset * 60 * 1000);
    setDeadlineInput(local.toISOString().slice(0, 16));
    setFormError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!isConnected) {
      setFormError("Please connect your MetaMask wallet first.");
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    if (!trimmedTitle) {
      setFormError("Please enter a challenge title.");
      return;
    }

    if (trimmedTitle.length > 60) {
      setFormError("Title cannot exceed 60 characters.");
      return;
    }

    if (!trimmedDesc) {
      setFormError("Please enter a short description.");
      return;
    }

    if (trimmedDesc.length > 200) {
      setFormError("Description cannot exceed 200 characters.");
      return;
    }

    if (!deadlineInput) {
      setFormError("Please set a deadline date and time.");
      return;
    }

    const deadlineTimestamp = Math.floor(new Date(deadlineInput).getTime() / 1000);
    const nowTimestamp = Math.floor(Date.now() / 1000);

    if (isNaN(deadlineTimestamp) || deadlineTimestamp <= nowTimestamp) {
      setFormError("Deadline must be in the future.");
      return;
    }

    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      setFormError("Smart contract address is not configured. Please check deployment.");
      return;
    }

    writeContract(
      {
        address: CONTRACT_ADDRESS,
        abi: CHALLENGE_ME_ABI,
        functionName: "createChallenge",
        args: [trimmedTitle, trimmedDesc, BigInt(deadlineTimestamp)],
      },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          setDeadlineInput("");
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  return (
    <div className="rounded-2xl border border-charcoal-700/80 bg-charcoal-850/80 p-5 sm:p-7 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-brand-purple-muted/50 text-brand-purple-light border border-brand-purple-border/40">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-white">
            Create a New Challenge
          </h2>
          <p className="text-xs text-zinc-400">
            Commit to a goal on BOT Chain. Store it immutably until you prove it.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-medium text-zinc-300">
              Challenge Title <span className="text-brand-purple-light">*</span>
            </label>
            <span
              className={`text-[11px] font-mono ${
                title.length > 60 ? "text-rose-400 font-semibold" : "text-zinc-500"
              }`}
            >
              {title.length}/60
            </span>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Write 500 lines of code every day"
            maxLength={60}
            className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple/60 transition"
          />
        </div>

        {/* Description */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-medium text-zinc-300">
              Description <span className="text-brand-purple-light">*</span>
            </label>
            <span
              className={`text-[11px] font-mono ${
                description.length > 200 ? "text-rose-400 font-semibold" : "text-zinc-500"
              }`}
            >
              {description.length}/200
            </span>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Outline your goal, terms, and how you will prove completion..."
            maxLength={200}
            className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple/60 transition resize-none"
          />
        </div>

        {/* Deadline */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-medium text-zinc-300">
              Deadline <span className="text-brand-purple-light">*</span>
            </label>
            <span className="text-[11px] text-zinc-500">Local time</span>
          </div>

          <div className="relative">
            <input
              type="datetime-local"
              value={deadlineInput}
              onChange={(e) => {
                setDeadlineInput(e.target.value);
                setFormError("");
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple/60 transition [color-scheme:dark]"
            />
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="text-[11px] text-zinc-500 mr-1">Quick pick:</span>
            <button
              type="button"
              onClick={() => setQuickDeadline(24)}
              className="px-2 py-1 rounded-lg text-xs bg-charcoal-800 hover:bg-charcoal-700 text-zinc-300 border border-charcoal-700/80 transition"
            >
              +24 Hours
            </button>
            <button
              type="button"
              onClick={() => setQuickDeadline(72)}
              className="px-2 py-1 rounded-lg text-xs bg-charcoal-800 hover:bg-charcoal-700 text-zinc-300 border border-charcoal-700/80 transition"
            >
              +3 Days
            </button>
            <button
              type="button"
              onClick={() => setQuickDeadline(168)}
              className="px-2 py-1 rounded-lg text-xs bg-charcoal-800 hover:bg-charcoal-700 text-zinc-300 border border-charcoal-700/80 transition"
            >
              +7 Days
            </button>
            <button
              type="button"
              onClick={() => setQuickDeadline(720)}
              className="px-2 py-1 rounded-lg text-xs bg-charcoal-800 hover:bg-charcoal-700 text-zinc-300 border border-charcoal-700/80 transition"
            >
              +30 Days
            </button>
          </div>
        </div>

        {/* Error states */}
        {formError && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-900/50 text-rose-300 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{formError}</span>
          </div>
        )}

        {submitError && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-900/50 text-rose-300 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="break-all">
              {submitError.message?.slice(0, 160) || "Failed to submit transaction."}
            </div>
          </div>
        )}

        {/* Confirmation status */}
        {isConfirming && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-950/40 border border-purple-800/50 text-brand-purple-light text-xs animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin text-brand-purple-light" />
            <span>Broadcasting challenge to BOT Chain... Waiting for confirmation.</span>
          </div>
        )}

        {isConfirmed && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-brand-green-light text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-green-light" />
              <span>Challenge successfully published on-chain!</span>
            </div>
            {txHash && (
              <a
                href={`${EXPLORER_URL}/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-white"
              >
                View Tx
              </a>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isConfirming}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-700 via-brand-purple to-purple-600 hover:opacity-90 active:scale-[0.99] transition shadow-md shadow-purple-950/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || isConfirming ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{isSubmitting ? "Approve in MetaMask..." : "Confirming On-Chain..."}</span>
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              <span>Create Challenge</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-zinc-400 text-center">
          Challenges and proof records are publicly visible on BOT Chain. Avoid submitting sensitive information.
        </p>
      </form>
    </div>
  );
}

