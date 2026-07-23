import type { Metadata } from "next";
import "./globals.css";
import { LofiPlayer } from "@/components/ui/lofi-player";

export const metadata: Metadata = {
  title: "SakuDaku05 — Full Stack Developer & AI Engineer",
  description: "Portfolio of SakuDaku05 — a full stack developer and AI engineer building the future, one commit at a time. Inspired by Feynman, Tesla, and Thiel.",
  openGraph: {
    title: "SakuDaku05 — Full Stack Developer",
    description: "Building the future with code, curiosity, and craft.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#080808] antialiased">
        {children}
        <LofiPlayer />
      </body>
    </html>
  );
}
