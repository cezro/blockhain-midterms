import { isError } from "ethers";

export function getUserFriendlyError(error: unknown): string {
  const code = typeof error === "object" && error && "code" in error ? (error as { code?: number }).code : undefined;
  if (code === 4001) {
    return "Request was rejected in the wallet.";
  }
  if (isError(error, "ACTION_REJECTED") || isError(error, "INSUFFICIENT_FUNDS")) {
    return "Transaction was rejected or could not be paid.";
  }
  if (isError(error, "CALL_EXCEPTION")) {
    return error.reason ?? error.shortMessage ?? "Contract call failed.";
  }
  if (isError(error, "NETWORK_ERROR")) {
    return "Your wallet network changed. Wait a second, then try the action again on Sepolia.";
  }
  if (error instanceof Error && /network changed/i.test(error.message)) {
    return "Your wallet network changed. Wait a second, then try again on Sepolia.";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong.";
}
