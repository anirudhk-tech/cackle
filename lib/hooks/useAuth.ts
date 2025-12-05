import { useDispatch } from "react-redux";
import { supabase } from "../supabase";
import { updateUser } from "../store/slices/authSlice";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    router.push("/auth");
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      return;
    }

    dispatch(updateUser(null));
  };

  return {
    handleLogin,
    handleLogout,
  };
};
