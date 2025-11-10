"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "@/lib/supabase";
import { setUser } from "@/lib/store/slices/authSlice";
import { MainState } from "@/lib/store/store";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: MainState) => state.auth.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth");
        return;
      }

      dispatch(setUser(session.user));
      setLoading(false);
    };
    checkUser();
  }, [dispatch, router]);

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return <>{children}</>;
}
