import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import clsx from "clsx";
import "./globals.css";
import { Providers } from "@/components/provider";
import { SolanaProvider } from "../components/solana/solana-provider";
import { ClusterProvider } from "../components/cluster/cluster-data-access";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blockweave AI",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(dmSans.className, "antialiased")}>
        <ClusterProvider>
          <SolanaProvider>
            <Providers>
              {children}
            </Providers> 
          </SolanaProvider>
        </ClusterProvider>
      </body>
    </html>
  );
}
