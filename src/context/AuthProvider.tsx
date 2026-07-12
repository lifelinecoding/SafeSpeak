"use client"; // It is written to tell next js that this compnent will be rendered at client side
import { SessionProvider } from "next-auth/react";
import React from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
