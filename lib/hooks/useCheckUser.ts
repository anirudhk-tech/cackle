import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useRouter } from "next/navigation";
import { setUser } from "../store/slices/authSlice";
import { useDispatch } from "react-redux";

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

      dispatch(setUser(session.user));
      setLoading(false);
    };
    checkUser();
  }, [dispatch, router]);

  return { loading };
};
