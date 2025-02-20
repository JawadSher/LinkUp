import Navbar from "./components/Navbar/Navbar";
import { fetchUser } from "@/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  
  useEffect(() => {
    if(!user) dispatch(fetchUser());
  }, [dispatch, user]);

  return (
    <div className="min-h-screen text-white text-[50px] ml-3 mr-3 flex flex-col items-center justify-start">
      <Navbar user={user} />
      
      <div className=" w-full flex-grow flex pb-2">
          <Sidebar />
        <dev className="w-[90%] flex items-center justify-center flex-grow bg-gray-400 ml-2 rounded-xl">
          main Area
        </dev>
      </div>
    </div>
  );
};

export default App;
