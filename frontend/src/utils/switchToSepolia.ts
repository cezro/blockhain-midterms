import type { Eip1193Provider } from "ethers";

const SEPOLIA_HEX = "0xaa36a7";

function isMissingChainError(error: unknown): boolean {
  const e = error as { code?: number };
  return e?.code === 4902;
}

export async function switchToSepolia(ethereum: Eip1193Provider): Promise<void> {
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_HEX }],
    });
  } catch (error: unknown) {
    if (!isMissingChainError(error)) {
      throw error;
    }
    await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: SEPOLIA_HEX,
          chainName: "Sepolia",
          nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
          rpcUrls: ["https://rpc.sepolia.org"],
          blockExplorerUrls: ["https://sepolia.etherscan.io"],
        },
      ],
    });
  }
}
