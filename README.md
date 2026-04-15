# TipPost — Sepolia dApp

Pay-to-like social posts on **Ethereum Sepolia**: creators publish an **image URL** and **caption** on-chain; likers send **0.0001 ETH** per like to the creator. This repo is a **monorepo**: smart contract in [`hardhat/`](hardhat/), React + Vite + TypeScript UI in [`frontend/`](frontend/).

---

## Deployed links (submission)

Replace the placeholders below with your real values after deploy and Vercel setup.

| Item                                | Link / value                                                   |
| ----------------------------------- | -------------------------------------------------------------- |
| **GitHub repository**               | `https://github.com/<your-username>/<your-repo>`               |
| **Live app (Vercel)**               | `https://<your-project>.vercel.app`                            |
| **TipPost contract (Sepolia)**      | `0x…`                                                          |
| **Contract on Etherscan (Sepolia)** | `https://sepolia.etherscan.io/address/<YOUR_CONTRACT_ADDRESS>` |

---

## Prerequisites

- **Node.js** 20+ ([nodejs.org](https://nodejs.org))
- **MetaMask** ([metamask.io](https://metamask.io)) on **Sepolia** (chain ID **11155111**)
- **Sepolia ETH** for deploy gas, post creation, and likes (see [Sepolia faucets](#sepolia-eth-faucets))
- **Infura** or **Alchemy** (or similar) for a **Sepolia HTTPS RPC** URL used by Hardhat deploy
- **Etherscan API key** (optional, for [contract verification](#verify-on-sepolia-etherscan-bonus))

---

## Local setup

### 1. Clone and install

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

Install **Hardhat** and **frontend** dependencies separately:

```bash
cd hardhat && npm install && cd ..
cd frontend && npm install && cd ..
```

From the **repository root** you can run shortcuts (no root `npm install` required; dependencies live in `hardhat/` and `frontend/`):

```bash
npm run test:hardhat
```

Root [`package.json`](package.json) defines:

| Script                   | Command                               |
| ------------------------ | ------------------------------------- |
| `npm run test:hardhat`   | Runs Hardhat tests in `hardhat/`      |
| `npm run dev:frontend`   | Starts Vite dev server in `frontend/` |
| `npm run build:frontend` | Production build of `frontend/`       |

### 2. Smart contract (`hardhat/`)

```bash
cd hardhat
npm install
npx hardhat compile
npx hardhat test
```

**Secrets (never commit):**

1. Copy [`hardhat/.env.example`](hardhat/.env.example) → `hardhat/.env`.
2. Set:
   - `SEPOLIA_RPC_URL` — Sepolia endpoint (not mainnet).
   - `PRIVATE_KEY` — deployer wallet (use a **test-only** wallet).
   - `ETHERSCAN_API_KEY` — for verification bonus.

**Deploy to Sepolia:**

```bash
cd hardhat
npx hardhat run scripts/deploy.ts --network sepolia
```

Copy the printed **contract address** into [`frontend/.env`](frontend/.env) as `VITE_CONTRACT_ADDRESS`.

**Keep the ABI in sync** (after any contract change):

```bash
# Windows (PowerShell / cmd)
copy hardhat\artifacts\contracts\TipPost.sol\TipPost.json frontend\src\abi\TipPost.json

# macOS / Linux
cp hardhat/artifacts/contracts/TipPost.sol/TipPost.json frontend/src/abi/TipPost.json
```

### 3. Frontend (`frontend/`)

```bash
cd frontend
cp .env.example .env
```

Edit **`frontend/.env`**:

```env
VITE_CONTRACT_ADDRESS=0xYourDeployedTipPostAddress
# optional; defaults to Sepolia in code:
VITE_CHAIN_ID=11155111
```

**Run locally:**

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Connect MetaMask on **Sepolia**.

**Production build (local check):**

```bash
cd frontend
npm run build
npm run preview
```

### 4. Deploy frontend to Vercel

1. Push this repo to **GitHub**.
2. [Vercel](https://vercel.com) → **Add New…** → **Project** → import the repo.
3. Set **Root Directory** to **`frontend`**.
4. **Environment variables** (Production + Preview):
   - `VITE_CONTRACT_ADDRESS` = your deployed TipPost address
   - `VITE_CHAIN_ID` = `11155111` (optional)
5. Deploy, then put the **production URL** in the [Deployed links](#deployed-links-submission) table above.

**Netlify (alternative):** base directory `frontend`, build `npm run build`, publish `frontend/dist`, same env vars.

---

## Verify on Sepolia Etherscan (bonus)

After a successful deploy:

```bash
cd hardhat
npx hardhat verify --network sepolia <YOUR_CONTRACT_ADDRESS>
```

## Repo layout

| Path                                                             | Purpose                                        |
| ---------------------------------------------------------------- | ---------------------------------------------- |
| [`hardhat/contracts/TipPost.sol`](hardhat/contracts/TipPost.sol) | Solidity: posts, likes, tips                   |
| [`hardhat/test/`](hardhat/test/)                                 | Hardhat + TypeScript tests                     |
| [`hardhat/scripts/deploy.ts`](hardhat/scripts/deploy.ts)         | Deploy script                                  |
| [`frontend/src/components/`](frontend/src/components/)           | React UI                                       |
| [`frontend/src/hooks/`](frontend/src/hooks/)                     | Wallet, contract, feed hooks                   |
| [`frontend/src/abi/TipPost.json`](frontend/src/abi/TipPost.json) | ABI artifact (copy from Hardhat after compile) |

---

## Submissions


### Evidence (browser + MetaMask)
<img width="1767" height="419" alt="Screenshot 2026-04-15 143030" src="https://github.com/user-attachments/assets/299cb39f-3bbf-4cce-8cf5-3f2e826715a7" />
<img width="2482" height="1364" alt="Screenshot 2026-04-15 172635" src="https://github.com/user-attachments/assets/6dfabc4b-50a3-4ffd-bbf9-fa0dce164fa7" />
<img width="2498" height="1455" alt="Screenshot 2026-04-15 172611" src="https://github.com/user-attachments/assets/eb313805-7e63-4ac8-affe-fff8d4fed2d1" />
<img width="2289" height="1441" alt="Screenshot 2026-04-15 172433" src="https://github.com/user-attachments/assets/e5bb3981-44eb-48c8-b864-aa6a1ef0b528" />

### Tests

-  **Hardhat tests** — screenshot of terminal after `cd hardhat && npx hardhat test` with **all tests passing**.
-  <img width="951" height="514" alt="Screenshot 2026-04-15 172038" src="https://github.com/user-attachments/assets/6f9c19b3-a3dd-4636-868f-9d45c3c96a06" />
