import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - UsITech Admin",
  description: "Secure admin access to UsITech Admin Portal",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
