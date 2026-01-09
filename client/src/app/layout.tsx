import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import NavigationSidebar from "@/components/common/NavigationSidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Leadify - AI Email Outreach",
  description: "AI-powered cold email outreach tool for sales teams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="app-layout">
          <NavigationSidebar />
          <main className="main-app-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
