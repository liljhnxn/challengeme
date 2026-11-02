# ChallengeMe — Whitepaper & Pitch Deck

**Platform:** ChallengeMe  
**Tagline:** *Set a challenge. Prove you did it.*  
**Network:** Botchain Testnet (Chain ID: 968)  
**Contract Address:** [`0x29c6F99EBCE7739B5571bF0a8B85afE06fA34498`](https://scan.bohr.life/address/0x29c6F99EBCE7739B5571bF0a8B85afE06fA34498#code)  
**Repository:** [https://github.com/liljhnxn/challengeme](https://github.com/liljhnxn/challengeme)  
**Date:** November 2026  
**Document Version:** 1.0  

---

## Executive Summary

**ChallengeMe** is a decentralized personal accountability protocol built on **Botchain**. It bridges human intention and digital execution by transforming personal goals, habits, and fitness milestones into immutable, on-chain commitments.

In traditional Web2 personal productivity apps, commitments are private, easily deleted, and held in centralized databases prone to data harvesting. ChallengeMe introduces public, cryptographic accountability: users connect MetaMask, set a challenge with a rigid deadline, and publicly record permanent proof upon completion.

---

## 1. Problem Statement

1. **The Intention-Action Gap:** Over 80% of personal goals and new habits are abandoned within 30 days due to a lack of public commitment and social stakes.
2. **Web2 Centralization & Ephemeral Data:** Existing habit trackers (Notion, Habitica, Strava) store data off-chain in private silos where records can be quietly deleted, falsified, or lost if services shut down.
3. **Overengineered Web3 Platforms:** Many existing Web3 social platforms force users through predatory tokenomics, complex staking requirements, or multi-signature bureaucracy before letting them perform simple actions.

---

## 2. The ChallengeMe Solution

ChallengeMe strips away unnecessary friction to deliver a **lean, trust-minimized Web3 accountability platform**:

* **Immutable On-Chain Records:** Every challenge creation and completion is anchored on the Botchain ledger.
* **Firm Deadlines with Dynamic Countdowns:** Challenges display live ticking clocks; expired challenges are permanently distinguished from active ones.
* **Cryptographic Proof of Completion:** Creators link verifiable evidence (GitHub PRs, Strava activities, tweets, portfolio links) directly to their smart contract record.
* **Sovereign & Non-Custodial:** No email, password, or third-party login. MetaMask wallet address is your permanent identity.
* **Zero Backend Overhead:** Pure client-to-contract communication via Wagmi and Viem with zero centralized servers or databases.

---

## 3. System Architecture & Smart Contract Design

### 3.1 Smart Contract (`ChallengeMe.sol`)
Deployed and verified on Botchain Testnet at `0x29c6F99EBCE7739B5571bF0a8B85afE06fA34498`.

```solidity
struct Challenge {
    uint256 id;
    string title;
    string description;
    address creator;
    uint256 deadline;
    uint256 createdAt;
    bool isCompleted;
    string proof;
    uint256 completedAt;
}
```

#### Core Invariants & Rules:
* **String Guardrails:** Titles limited to 60 bytes; descriptions limited to 200 bytes; proof messages limited to 150 bytes (prevents gas exhaustion and spam).
* **Time Enforcement:** Challenge deadlines must strictly be in the future at timestamp of creation (`deadline > block.timestamp`).
* **Creator-Only Authority:** Only the original creator address (`msg.sender == creator`) can submit proof and mark a challenge complete.
* **Re-entrancy & State Safety:** State updates execute synchronously before event emissions (`ChallengeCreated`, `ChallengeCompleted`).

### 3.2 Frontend Stack
* **Framework:** Next.js 14 (App Router) with TypeScript
* **Styling:** Tailwind CSS with custom dark charcoal design system (`#0b0c10`), muted purple (`#9061f9`), and emerald (`#10b981`) accents.
* **Client-Side Web3:** Wagmi v2 + Viem + TanStack Query with automatic chain detection and network-switching prompts.

---

## 4. Pitch Deck (10-Slide Deck Format)

### Slide 1: Title & Vision
* **Header:** ChallengeMe
* **Tagline:** Set a challenge. Prove you did it.
* **Subtext:** The on-chain accountability protocol powered by Botchain.
* **Visual:** Minimal dark theme logo, shielded checkmark emblem.

### Slide 2: The Problem
* People fail their goals when there is zero public accountability.
* Centralized productivity apps let you delete missed goals with no consequence.
* Web3 lacks intuitive, everyday utility dApps that non-crypto natives can adopt immediately.

### Slide 3: The Solution
* Transform personal goals into immutable, on-chain commitments.
* Transparent deadlines visible to the entire community.
* Permanent proof of work anchored to your Web3 wallet forever.

### Slide 4: How It Works (User Flow)
1. **Connect:** Connect MetaMask to Botchain Testnet.
2. **Commit:** Set title, description, and target deadline.
3. **Execute:** Live countdown ticks down publicly.
4. **Prove:** Submit verifiable proof (URL or proof text) and mark completed on-chain.

### Slide 5: Product Features
* **Global Community Feed:** Discover peer commitments across the ecosystem.
* **Personal Dashboard:** Track your active and completed streaks.
* **Status Filtering:** Instant filtering across All, Active, Completed, and Expired states.
* **100% On-Chain:** Zero databases, zero mock data, zero censorship.

### Slide 6: Market Opportunity
* $4.5B Global Personal Development & Productivity App Market.
* Rapidly growing Web3 consumer application sector seeking real utility beyond DeFi speculation.
* Natural synergy with developer hackathons, fitness streaks, and DAO contributor tasks.

### Slide 7: Technical Highlights & Botchain Synergies
* Deployed on Botchain Testnet (Chain ID 968).
* Low gas consumption and fast finality on Botchain RPC.
* Full test coverage (14 passing unit tests via Hardhat).
* Verified contract code accessible publicly on BohrScan Explorer.

### Slide 8: Roadmap & Milestones
* **Phase 1 (Completed):** Core smart contract deployment, BohrScan verification, responsive Next.js dApp, and testnet launch.
* **Phase 2:** Peer verification (community voting/attestation on proof validity).
* **Phase 3:** Optional stake-to-commit mechanics (pledge BOHR tokens returned upon proof verification).
* **Phase 4:** Mainnet deployment, DAO bounties, and mobile PWA release.

### Slide 9: Co-Marketing & Growth Strategy
* Botchain ecosystem directory placement.
* Community challenge sprints (e.g. "Build on Botchain 14-Day Challenge").
* Joint AMAs and social spotlights on X and Telegram.

### Slide 10: The Ask & Call to Action
* **Try the dApp:** Connect and set your first on-chain challenge.
* **Explorer Verification:** [BohrScan Verified Code](https://scan.bohr.life/address/0x29c6F99EBCE7739B5571bF0a8B85afE06fA34498#code)
* **GitHub Repository:** [https://github.com/liljhnxn/challengeme](https://github.com/liljhnxn/challengeme)
