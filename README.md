# ChallengeMe

**Tagline:** *Set a challenge. Prove you did it.*

ChallengeMe is a decentralized Web3 personal accountability platform deployed natively on **BOT Chain**. Users connect MetaMask to set personal challenges, commit to firm deadlines, and publicly record immutable proof of completion directly on-chain.

---

## 🌟 Features

* **100% On-Chain Integrity:** Challenges and verified completion records are stored directly on the smart contract — no centralized databases, fake data, or off-chain servers.
* **Non-Custodial & Wallet-Powered:** One-click MetaMask connection using Wagmi and Viem.
* **Accountability Deadlines:** Real-time countdowns that calculate time remaining or clearly label expired challenges.
* **Creator-Only Completion:** Only the creator who initiated the challenge can mark it completed and record proof (URL or message).
* **Live Community Feed & Personal Dashboard:** Toggle between all global community challenges and your personal challenges.
* **Interactive Filters & Search:** Filter challenges by All, Active, Completed, or Expired, with real-time text search.
* **Premium Dark Mode Interface:** Minimal dark charcoal aesthetics with muted purple and emerald accents, rounded cards, and subtle hover animations.

---

## ⛓️ Blockchain Configuration (BOT Chain)

| Parameter | Value |
| :--- | :--- |
| **Network Name** | BOT Chain Mainnet |
| **Chain ID** | `677` |
| **RPC URL** | `https://rpc.botchain.ai` |
| **BOT Chain Explorer** | [https://scan.botchain.ai](https://scan.botchain.ai) |
| **BOT Chain Website** | [https://botchain.ai](https://botchain.ai) |
| **Native Token** | BOT (18 decimals) |
| **Total Supply** | 150 Million BOT |
| **Verified Contract** | [`0xdA38Ac96800Cb359419285b82242f43594173590`](https://scan.botchain.ai/address/0xdA38Ac96800Cb359419285b82242f43594173590#code) |

---

## 🛠️ Technology Stack

* **Frontend:** [Next.js](https://nextjs.org/) (App Router), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Web3 Integration:** [wagmi](https://wagmi.sh/), [viem](https://viem.sh/), [MetaMask](https://metamask.io/)
* **Smart Contract:** [Solidity](https://soliditylang.org/) `^0.8.20`
* **Development & Testing:** [Hardhat](https://hardhat.org/) (`@nomicfoundation/hardhat-toolbox`)

---

## 📂 Project Structure

```
ChallengeMe/
├── contracts/
│   └── ChallengeMe.sol            # Smart contract with validation, events, and getters
├── test/
│   └── ChallengeMe.test.ts        # Unit tests covering creation, completion, and queries
├── scripts/
│   └── deploy.ts                  # Hardhat deployment script for BOT Chain
├── src/
│   ├── app/
│   │   ├── globals.css            # Tailwind theme & custom styling
│   │   ├── layout.tsx             # Root layout with Web3 providers
│   │   ├── page.tsx               # Main single-page application with BOT Chain ecosystem links
│   │   └── providers.tsx          # Wagmi & TanStack Query client providers
│   ├── components/
│   │   ├── ChallengeCard.tsx      # Individual challenge card with countdowns
│   │   ├── CompleteModal.tsx      # Modal for submitting proof & marking completed
│   │   ├── CreateChallengeForm.tsx# Form for creating new challenges with validation
│   │   ├── Navbar.tsx             # Header, logo, network switcher, and wallet connect
│   │   └── StatsOverview.tsx      # Metric cards (Total, Active, Completed, Your)
│   ├── config/
│   │   └── wagmi.ts               # Wagmi config & BOT Chain definition
│   ├── contracts/
│   │   └── ChallengeMeABI.ts      # TypeScript contract ABI & types
│   └── lib/
│       └── utils.ts               # Timestamp formatting, countdowns, address shortening
├── hardhat.config.ts              # Hardhat configuration
├── package.json
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (v18, v20, or later)
* [MetaMask](https://metamask.io/) browser extension

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Compile Smart Contracts
Compile the Solidity smart contract and generate TypeScript typings:
```bash
npm run compile
```

### 4. Run Smart Contract Tests
Run the comprehensive test suite (all 14 unit tests pass):
```bash
npm test
```

---

## 🚢 Deployment

### Deploy to BOT Chain

1. Configure `.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xdA38Ac96800Cb359419285b82242f43594173590
NEXT_PUBLIC_RPC_URL=https://rpc.botchain.ai
NEXT_PUBLIC_CHAIN_ID=677
PRIVATE_KEY=your_private_key_here
```

2. Run the deployment script:
```bash
npm run deploy:botchain
```

---

## 💻 Running the Web Application

Start the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Build for production:
```bash
npm run build
npm run start
```

---

## 🦊 Adding BOT Chain to MetaMask

If MetaMask does not switch automatically:
* **Network Name:** BOT Chain
* **New RPC URL:** `https://rpc.botchain.ai`
* **Chain ID:** `677`
* **Currency Symbol:** `BOT`
* **Block Explorer URL:** `https://scan.botchain.ai`

---

## 🔗 Official Ecosystem Links

* **BOT Chain Website:** [https://botchain.ai](https://botchain.ai)
* **BOT Chain Explorer:** [https://scan.botchain.ai](https://scan.botchain.ai)
* **Verified Contract:** [https://scan.botchain.ai/address/0xdA38Ac96800Cb359419285b82242f43594173590#code](https://scan.botchain.ai/address/0xdA38Ac96800Cb359419285b82242f43594173590#code)

---

## 🔒 Security & Privacy Notes

* **Public Ledger:** All titles, descriptions, and completion proofs are publicly viewable on BOT Chain. Users are advised not to publish sensitive, private, or confidential personal information.
* **Strict Constraints:**
  * Title: 1 to 60 characters
  * Description: 1 to 200 characters
  * Proof: 1 to 150 characters
  * Deadlines must be strictly in the future at the moment of creation.
  * Only the original creator address can mark a challenge completed.

---

## 📄 License
MIT License.
