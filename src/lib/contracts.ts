export const UNICHAIN_ID = 130 as const;

export const PRAYER_BURN = {
  address: (process.env.NEXT_PUBLIC_PRAYER_BURN_ADDRESS || "0x") as `0x${string}`,
  abi: [
    {
      type: "function",
      name: "pray",
      inputs: [
        { name: "amount", type: "uint256" },
        { name: "message", type: "bytes" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "prayerCount",
      inputs: [],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "minimumBurn",
      inputs: [],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "cooldownPeriod",
      inputs: [],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "lastPrayer",
      inputs: [{ name: "", type: "address" }],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "event",
      name: "Prayer",
      inputs: [
        { name: "sender", type: "address", indexed: true },
        { name: "amount", type: "uint256", indexed: false },
        { name: "message", type: "bytes", indexed: false },
      ],
    },
  ] as const,
} as const;

export const DAODEGEN_TOKEN = {
  address: (process.env.NEXT_PUBLIC_DAODEGEN_TOKEN_ADDRESS ||
    "0x9BbF24fDE364b328943ee2A21E818d6446Ff5a16") as `0x${string}`,
  abi: [
    {
      type: "function",
      name: "balanceOf",
      inputs: [{ name: "account", type: "address" }],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "approve",
      inputs: [
        { name: "spender", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      outputs: [{ name: "", type: "bool" }],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "allowance",
      inputs: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
      ],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "decimals",
      inputs: [],
      outputs: [{ name: "", type: "uint8" }],
      stateMutability: "view",
    },
  ] as const,
} as const;
