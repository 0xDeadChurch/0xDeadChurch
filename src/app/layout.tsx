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

export const metadata: Metadata = {
  title: "0xdead.church",
  description: "Burn tokens. Receive sermons. The temple of Dao DeGen.",
  openGraph: {
    title: "0xdead.church",
    description: "Burn tokens. Receive sermons. The temple of Dao DeGen.",
    siteName: "0xdead.church",
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
