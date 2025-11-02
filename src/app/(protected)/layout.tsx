import type { Metadata } from "next";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";

export const metadata: Metadata = {
  title: "UsITech Admin Portal",
  description: "Admin dashboard for UsITech workflow management",
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <LayoutWrapper>
      {children}
    </LayoutWrapper>
  );
}
