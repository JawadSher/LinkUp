import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import "./profile.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/features/auth/authSlice.js";

const Profile = ({ userData }) => {
    const dispatch = useDispatch();
    
    const handleLogoutUser =  () => {
        const response = dispatch(logout());
        console.log(response);
    }

  const [darkTheme, setDarkTheme] = useState(() => {
    // Initialize from localStorage
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    // Update document class and localStorage when theme changes
    if (darkTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkTheme]);

  const handleThemeToggle = () => {
    setDarkTheme(prev => !prev);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex flex-col items-center justify-center cursor-pointer">
          <Avatar>
            <AvatarImage src={`${userData.Avatar || "https://github.com/shadcn.png"}`} alt="Profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-gray-900 text-white">
        <div className="flex items-center justify-between p-2">
          <div className="flex flex-col items-center justify-center cursor-pointer max-w-[30%]">
            <Avatar>
              <AvatarImage src={`${userData.Avatar || "https://github.com/shadcn.png"}`} alt="Profile" />
              <AvatarFallback className="text-[18px]">
                {/* {userData.firstName[0] + userData.lastName[0]} */}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="min-w-[70%] h-fit flex items-start justify-center flex-col">
            <h1 className="text-[18px] font-semibold">
              {userData.firstName + " " + userData.lastName}
            </h1>
            <h1 className="text-[15px] font-semibold">
              {userData.channelName}
            </h1>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="dropdown-sub-trigger">
              Settings
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="dropdown-sub-content bg-gray-900">
                <DropdownMenuItem 
                  className="dropdown-sub-item flex items-center justify-between" 
                  onClick={handleThemeToggle}
                >
                  <span>{darkTheme ? "Light Theme" : "Dark Theme"}</span>
                  {darkTheme ? (
                    <Sun className="ml-2 h-4 w-4" />
                  ) : (
                    <Moon className="ml-2 h-4 w-4" />
                  )}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center justify-center bg-red-600 font-semibold text-[15px]" onClick={handleLogoutUser}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;