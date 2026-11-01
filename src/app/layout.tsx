import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChallengeMe | Set a challenge. Prove you did it.",
  description:
    "Decentralized challenge platform where users create personal challenges, set deadlines, and publicly record their completion on Botchain.",
  icons: {
    icon: [
      { url: "/favicon.svg?v=2", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg?v=2",
    apple: "/favicon.svg?v=2",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml" />
      </head>
      <body className="bg-charcoal-950 text-zinc-200 antialiased min-h-screen flex flex-col selection:bg-brand-purple/30 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

