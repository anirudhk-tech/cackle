"use client";

import { useCheckUser } from "@/lib/hooks/useCheckUser";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  useCheckUser();
  return <>{children}</>;
};
