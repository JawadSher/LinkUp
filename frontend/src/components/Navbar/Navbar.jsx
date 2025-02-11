import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUser } from "@/features/auth/authSlice";
import Profile from "./Profile";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = dispatch(fetchUser());
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    user.then((result) => {
      const fullname = result.payload.data.firstName + " " + result.payload.data.lastName
      setFullName(fullname)
    })
  }, [user])

  return (
    <div className="w-full h-[70px] bg-gray-950 flex items-center justify-between px-5">
      <div>LinkUp</div>
      <div className="min-w-[500px] min-h-7 rounded-full border-2 border-gray-500 flex items-center pr-2">
        <Input
          className="w-full  h-full rounded-full border-none outline-none"
          placeholder="Search here"
        />
        <Search
          color="#808080"
          className="border-l-2 border-gray-500 pl-1 w-7"
        />
      </div>
      <Profile />
      <div>
        {user ? (
          <div className="flex flex-col items-center justify-center cursor-pointer"> 
            <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="text-[15px]">{fullName}</h1>
          </div>
        ) : (
          <Link to="/api/v1/user/auth/">
            {" "}
            <Button className="flex items-center justify-center hover:bg-slate-600" mode="login">Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
