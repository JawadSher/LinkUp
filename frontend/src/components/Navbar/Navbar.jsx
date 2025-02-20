import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, Bell, Plus, Video, File } from "lucide-react";
import { Link } from "react-router-dom";
import Profile from "./Profile";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

const Navbar = ({ user }) => {
  const theme = localStorage.getItem('theme');

  return (
    <div className="m-3 w-full h-[70px] bg-gray-950 flex items-center justify-between px-5 rounded-xl">
      <div className="flex items-center justify-center">
        <Link to="/">
          <Button className="border-none outline-none bg-transparent text-white text-[30px] flex items-center justify-center w-full h-full hover:bg-transparent hover:text-blue-500">
            Linkup
          </Button>
        </Link>
      </div>
      <div className="min-w-[40%] h-9 rounded-full border-2 border-gray-600 flex items-center pr-2 ">
        <Input
          className="w-full  flex-grow rounded-full mr-2 border-0 focus-visible:ring-0 focus:outline-none focus:border-0 tracking-wider mb-[3px] font-sans font-semibold"
          placeholder="Search here"
        />
        <Search
          color="#808080"
          className=" pl-1 w-7 b"
        />
      </div>
      <div className="flex items-center gap-5">
        <Menubar className={`w-25 rounded-full ${theme == 'light' && 'bg-gray-900'} border-none`}>
          <MenubarMenu className="w-25">
            <MenubarTrigger className={`w-full h-full rounded-full data-[state=open]:bg-gray-500 `}>
              <Plus color={theme == 'light' ? "#ffffff" : "#ffffff"} />{" "}
              <p className="ml-1 text-[16px] font-normal text-white">Create</p>
            </MenubarTrigger>
            <MenubarContent className={theme == 'light' && 'border-none bg-gray-500 text-white'}>
              <MenubarItem className={`flex items-center justify-between ${theme == 'light' && 'border-none'}`}>
                <Video color="#ffffff" className="w-[20px]" />
                <p className=" min-w-24 font-normal">Upload video</p>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem className="flex items-center justify-between">
                <File color="#ffffff" className="w-[20px]" />
                <p className=" min-w-24 font-normal">Create post</p>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        <Bell color="#ffffff" className="cursor-pointer hover:fill-red-700" />
        {user?.statusCode === 200 ? (
          <Profile user={user} />
        ) : (
          <Link to="/api/v1/user/auth/">
            {" "}
            <Button
              className="flex items-center justify-center hover:bg-slate-600"
              mode="login"
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
