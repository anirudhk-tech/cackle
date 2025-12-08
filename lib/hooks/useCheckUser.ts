import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useRouter } from "next/navigation";
import { setUser } from "../store/slices/authSlice";
import { useDispatch } from "react-redux";
import { setUserData } from "../store/slices/userSlice";

export const useCheckUser = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return;
      }

      const response = await fetch(`/api/supabase/user/` + session.user.id);

      if (!response.ok) {
        console.error("Failed to fetch user data");
        return;
      }

      const userData = await response.json();

      dispatch(setUser(session.user));
      dispatch(setUserData(userData));

      setLoading(false);
    };
    checkUser();
  }, [dispatch, router]);

  return { loading };
};
