import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AlertProvider } from "@/contexts/AlertContext";
import { AlertContainer } from "@/components/ui/Alert";
import { ReduxProvider } from "@/components/providers/ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UsITech Admin Portal",
  description: "Admin dashboard for UsITech workflow management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AlertProvider>
          <ReduxProvider>
            
              {children}
          </ReduxProvider>
          <AlertContainer />
        </AlertProvider>
      </body>
    </html>
  );
}
