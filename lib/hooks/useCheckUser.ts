import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";
import { setUserData } from "../store/slices/userSlice";
import { Session } from "@supabase/supabase-js";

export const useCheckUser = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname.startsWith("/auth") || pathname.startsWith("/callback")) {
      return;
    }

    let isMounted = true;

    const fetchUserData = async (session: Session | null) => {
      if (!isMounted) return;

      if (!session) {
        dispatch(setUser(null));
        dispatch(setUserData(null));
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/supabase/user/${session.user.id}`);

      if (!response.ok) {
        console.error("Failed to fetch user data");
        setLoading(false);
        return;
      }

      const userData = await response.json();
      dispatch(setUser(session.user));
      dispatch(setUserData(userData));
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchUserData(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoading(true);
      fetchUserData(session);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [dispatch, pathname]);

  return { loading };
};
