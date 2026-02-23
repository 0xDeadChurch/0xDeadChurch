import type { Metadata } from "next";
import { Cinzel, Cinzel_Decorative, Crimson_Pro, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-decorative",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const crimsonPro = Crimson_Pro({
  variable: "--font-crimson-pro",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://0xdead.church";

export const metadata: Metadata = {
  title: "0xdead.church",
  description: "Burn tokens. Receive sermons. The temple of Dao DeGen.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "0xdead.church",
    description: "Burn tokens. Receive sermons. The temple of Dao DeGen.",
    siteName: "0xdead.church",
    url: siteUrl,
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "0xdead.church -- The temple of Dao DeGen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "0xdead.church",
    description: "Burn tokens. Receive sermons. The temple of Dao DeGen.",
    images: [`${siteUrl}/og-image.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${cinzel.variable} ${cinzelDecorative.variable} ${crimsonPro.variable} ${jetbrainsMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
