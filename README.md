# TipPost — Sepolia dApp

Pay-to-like social posts: creators publish an image URL and caption on-chain; likers send **0.0001 ETH** per like to the creator. Smart contract lives in [`hardhat/`](hardhat/); React UI in [`frontend/`](frontend/).

## Deployed (fill in after you deploy)

| Item | Value |
|------|--------|
| **Sepolia contract** | _Paste your `TipPost` address here_ |
| **Etherscan (Sepolia)** | `https://sepolia.etherscan.io/address/<YOUR_CONTRACT_ADDRESS>` |
| **Live app (Vercel)** | _Paste your production URL here_ |

## Prerequisites

- Node.js 20+ recommended  
- MetaMask on **Sepolia** (chain ID `11155111`)  
- Sepolia ETH for gas + likes (see faucets below)

## Smart contract (Hardhat)

```bash
cd hardhat
npm install
npx hardhat test
npx hardhat compile
```

### Configure secrets (never commit)

1. Copy `hardhat/.env.example` to `hardhat/.env`.
2. Set `SEPOLIA_RPC_URL`, `PRIVATE_KEY` (deployer), and `ETHERSCAN_API_KEY` (for verification bonus).

### Deploy to Sepolia

```bash
cd hardhat
npx hardhat run scripts/deploy.ts --network sepolia
```

Copy the printed contract address into `frontend/.env` as `VITE_CONTRACT_ADDRESS`, then refresh the ABI if you changed the contract:

```bash
copy hardhat\artifacts\contracts\TipPost.sol\TipPost.json frontend\src\abi\TipPost.json
```

_(Use `cp` on macOS/Linux.)_

### Verify on Etherscan (optional +5 bonus)

```bash
cd hardhat
npx hardhat verify --network sepolia <YOUR_CONTRACT_ADDRESS>
```

## Frontend (Vite + React + TypeScript)

```bash
cd frontend
cp .env.example .env
# Edit .env: set VITE_CONTRACT_ADDRESS (and optionally VITE_CHAIN_ID=11155111)
npm install
npm run dev
```

Production build:

```bash
cd frontend
npm run build
```

## Host on Vercel

1. Push this repo to GitHub (public for submission).  
2. [Vercel](https://vercel.com) → **New Project** → import the repo.  
3. Set **Root Directory** to `frontend`.  
4. Environment variables: `VITE_CONTRACT_ADDRESS`, optional `VITE_CHAIN_ID` (`11155111`).  
5. Deploy; paste the production URL into the table at the top of this README.

## Sepolia ETH faucets

- [Google Cloud Sepolia faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)  
- [sepoliafaucet.com](https://sepoliafaucet.com)  
- [Infura Sepolia faucet](https://www.infura.io/faucet/sepolia)

## Repo layout

- `hardhat/contracts/TipPost.sol` — on-chain posts, likes, and tips  
- `hardhat/test/` — Hardhat tests (`npx hardhat test`)  
- `frontend/src/components`, `frontend/src/hooks`, `frontend/src/abi` — UI and contract ABI  

## Monorepo shortcuts (from repository root)

```bash
npm run test:hardhat
npm run dev:frontend
npm run build:frontend
```

## Security

- Do **not** commit `hardhat/.env`, `frontend/.env`, or private keys.  
- Use a **dedicated test wallet** with no mainnet funds.
