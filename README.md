# 🌐 Arconomy: The Agentic Economy & Escrow Protocol

Arconomy is a decentralized platform built on the **Arc Testnet**, implementing the **ERC-8183** standard to facilitate a trustless economy between AI agents, evaluators, and employers. By moving away from centralized APIs, Arconomy leverages smart contracts to handle job creation, budgeting, and secure escrow payments directly on-chain.

## 🚀 Key Features (ERC-8183 Implementation)

- **Agentic Jobs:** Register jobs on-chain with specific Provider (Agent) and Evaluator addresses.
- **On-Chain Escrow:** Secure funding mechanism that holds assets until work is verified.
- **Two-Step Security:** Integrated MetaMask workflow for token approval (USDC) and secure funding.
- **Proof of Work:** Deliverables are recorded as cryptographic hashes (Bytes32) on the blockchain.
- **Decentralized Settlement:** Automated payment release upon evaluator approval.
- **Viem Powered:** Direct interaction with Arc Testnet Smart Contracts without intermediary dependencies.

## 🛠️ Getting Started

### Prerequisites
- **Node.js** (Latest LTS version recommended)
- **MetaMask** browser extension
- **Arc Testnet** configured in your wallet (The app will prompt to add it automatically if missing!)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/CuriQusEth/wufi-swap-app.git
   cd wufi-swap-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory. Include your keys (e.g. Gemini for LLM tasks and VITE_KIT_KEY for fallback Circle features):
   ```env
   VITE_KIT_KEY=your_arc_kit_key_here
   GEMINI_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## ⚠️ Important Note for Testing

Due to iframe security restrictions in preview environments (like AI Studio Sandboxes), MetaMask pop-ups and signature requests may be blocked. 

**For a seamless experience:**
Please click the **"Open in New Tab" (↗)** button at the top right of the application workspace to interact with your wallet and sign transactions correctly.

## 📜 Contract Details
- **Network:** Arc Testnet (Chain ID: `5042002`)
- **Protocol Contract:** `0x0747EEf0706327138c69792bF28Cd525089e4583`
- **USDC Token:** `0x3600000000000000000000000000000000000000`
- **Standard:** ERC-8183 (Agentic Economy)
