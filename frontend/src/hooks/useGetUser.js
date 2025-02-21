import { fetchUser } from "@/features/auth/authSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetUser = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) useDispatch(fetchUser());
  }, [dispatch, user]);

  return user;
};

export default useGetUser;
