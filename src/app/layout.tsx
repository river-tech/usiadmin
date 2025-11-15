import type { Metadata } from "next";
import "./globals.css";
import { AlertProvider } from "@/contexts/AlertContext";
import { AlertContainer } from "@/components/ui/Alert";
import { ReduxProvider } from "@/components/providers/ReduxProvider";

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
      <body className="antialiased">
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
