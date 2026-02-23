import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";

const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || "130");
const isTestnet = chainId === 1301;

const unichainRpc =
  process.env.NEXT_PUBLIC_UNICHAIN_RPC ||
  (isTestnet
    ? "https://sepolia.unichain.org"
    : "https://mainnet.unichain.org");

const unichain = {
  id: chainId,
  name: isTestnet ? "Unichain Sepolia" : "Unichain",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: [unichainRpc],
    },
  },
  blockExplorers: {
    default: {
      name: "UnichainScan",
      url: isTestnet
        ? "https://sepolia.uniscan.xyz"
        : "https://unichains.org",
    },
  },
  testnet: isTestnet,
} as const;

export const config = getDefaultConfig({
  appName: "0xdead.church",
  projectId:
    process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "demo-project-id",
  chains: [unichain],
  transports: {
    [unichain.id]: http(unichainRpc),
  },
  ssr: true,
});
