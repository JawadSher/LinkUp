import Navbar from "./components/Navbar/Navbar";
import { fetchUser } from "@/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setUser } from "@/features/auth/authSlice";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-600 text-white text-[50px] flex flex-col items-center justify-start">
      <Navbar user={user} />
      <h1>Home Page</h1>
    </div>
  );
};

export default App;
