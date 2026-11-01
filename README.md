# ChallengeMe

**Tagline:** *Set a challenge. Prove you did it.*

ChallengeMe is a decentralized Web3 personal accountability platform deployed on **Botchain Testnet**. Users connect MetaMask to set personal challenges, commit to firm deadlines, and publicly record immutable proof of completion directly on-chain.

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

## ⛓️ Blockchain Configuration (Botchain Testnet)

| Parameter | Value |
| :--- | :--- |
| **Network Name** | Botchain Testnet |
| **Chain ID** | `968` |
| **RPC URL** | `https://rpc.bohr.life` |
| **Block Explorer** | [https://scan.bohr.life](https://scan.bohr.life) |
| **Native Currency** | BOHR (18 decimals) |

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
│   └── deploy.ts                  # Hardhat deployment script
├── src/
│   ├── app/
│   │   ├── globals.css            # Tailwind theme & custom styling
│   │   ├── layout.tsx             # Root layout with Web3 providers
│   │   ├── page.tsx               # Main single-page application
│   │   └── providers.tsx          # Wagmi & TanStack Query client providers
│   ├── components/
│   │   ├── ChallengeCard.tsx      # Individual challenge card with countdowns
│   │   ├── CompleteModal.tsx      # Modal for submitting proof & marking completed
│   │   ├── CreateChallengeForm.tsx# Form for creating new challenges with validation
│   │   ├── Navbar.tsx             # Header, logo, network switcher, and wallet connect
│   │   └── StatsOverview.tsx      # Metric cards (Total, Active, Completed, Your)
│   ├── config/
│   │   └── wagmi.ts               # Wagmi config & Botchain chain definition
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
Run the comprehensive test suite (all 14 unit tests):
```bash
npm test
```

---

## 🚢 Deployment

### Option A: Deploy to Botchain Testnet (Chain ID 968)

1. Create a `.env.local` file (or copy `.env.example`):
```bash
cp .env.example .env.local
```

2. Add your deployer wallet's private key to `.env.local` (ensure it has testnet BOHR for gas):
```env
PRIVATE_KEY=your_private_key_here
NEXT_PUBLIC_RPC_URL=https://rpc.bohr.life
NEXT_PUBLIC_CHAIN_ID=968
```

3. Run the deployment script:
```bash
npm run deploy:botchain
```

4. Copy the deployed contract address output by the script and set it in `.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

---

### Option B: Deploy Locally (Hardhat Network)

1. Start a local node in a separate terminal:
```bash
npx hardhat node
```

2. Deploy the contract to localhost:
```bash
npm run deploy:local
```

3. Set `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local` to the address logged in the terminal.

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

## 🦊 Adding Botchain Testnet to MetaMask

If MetaMask does not switch automatically:
* **Network Name:** Botchain Testnet
* **New RPC URL:** `https://rpc.bohr.life`
* **Chain ID:** `968`
* **Currency Symbol:** `BOHR`
* **Block Explorer URL:** `https://scan.bohr.life`

---

## 🔒 Security & Privacy Notes

* **Public Ledger:** All titles, descriptions, and completion proofs are publicly viewable on the blockchain. Users are advised not to publish sensitive, private, or confidential personal information.
* **Strict Constraints:**
  * Title: 1 to 60 characters
  * Description: 1 to 200 characters
  * Proof: 1 to 150 characters
  * Deadlines must be strictly in the future at the moment of creation.
  * Only the original creator address can mark a challenge completed.

---

## 📄 License
MIT License.

