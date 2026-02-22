import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://0xdead.church";
const DAODEGEN_URL = process.env.DAODEGEN_API_URL || "https://daodegen.com";
const PRAYER_BURN_ADDRESS = process.env.NEXT_PUBLIC_PRAYER_BURN_ADDRESS || null;

export async function GET() {
  return NextResponse.json(
    {
      name: "0xdead.church",
      version: "1.0.0",
      soul: `${BASE_URL}/soul.md`,
      description:
        "Temple frontend for the Dao DeGen ritual protocol. Burns tokens, returns sermons from 81 sacred verses.",
      canon: {
        verses: `${DAODEGEN_URL}/api/verse`,
        count: 81,
        source: "Tao Te Ching (DeFi adaptation)",
      },
      endpoints: {
        pray: {
          type: "contract",
          chain: "unichain",
          chainId: 130,
          address: PRAYER_BURN_ADDRESS,
          function: "pray(uint256,bytes)",
          description:
            "Burn DAODEGEN tokens with an optional message. Emits Prayer event.",
        },
        sermon: {
          type: "api",
          url: `${BASE_URL}/api/sermon`,
          method: "POST",
          auth: "jwt",
          description:
            "Submit a prayer payload, receive a sermon response. Requires SIWE JWT.",
        },
        congregation: {
          type: "api",
          url: `${BASE_URL}/api/congregation/state`,
          method: "GET",
          auth: "none",
          description: "Current congregation sentiment index.",
        },
      },
      license: "CC0-1.0",
      repository: "https://github.com/0xDeadChurch/0xDeadChurch",
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    },
  );
}
