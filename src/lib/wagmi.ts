import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";

const unichainRpc =
  process.env.NEXT_PUBLIC_UNICHAIN_RPC || "https://mainnet.unichain.org";

const unichain = {
  id: 130,
  name: "Unichain",
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
    default: { name: "UnichainScan", url: "https://unichains.org" },
  },
  testnet: false,
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
