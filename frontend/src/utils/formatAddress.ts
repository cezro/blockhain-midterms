export function shortenAddress(address: string, chars = 4): string {
  if (!address.startsWith("0x") || address.length < 2 + chars * 2) {
    return address;
  }
  return `${address.slice(0, 2 + chars)}…${address.slice(-chars)}`;
}
