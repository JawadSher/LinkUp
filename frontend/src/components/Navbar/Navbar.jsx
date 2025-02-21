import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, Bell, Plus, Video, File } from "lucide-react";
import { Link } from "react-router-dom";
import Profile from "./Profile";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { ModeToggle } from "../dark-mode/ModeToggle";
import { useSelector } from "react-redux";

const Navbar = ({ user }) => {
  const screen = useSelector((state) => state.screen.screenType);

  return (
    <div className="m-3 w-full h-[70px] bg-gray-950 flex items-center justify-between px-5 rounded-xl">
      {/* Left: Logo */}

      <div className="flex items-center">
        <Link to="/">
          <span className="border-none text-white flex items-center xl:text-[35px] 2xl:text[40px] lg:text-[30px] md:text-[20px] xxsm:text-[18px] xxxsm:text-[18px] xxxxsm:text-[18px] xxxxxsm:text-[18px]  hover:text-blue-500">
            Linkup
          </span>
        </Link>
      </div>

      {/* Center: Search Bar */}
      <div className="flex items-center w-full max-w-[600px] h-9 rounded-full border-2 border-gray-600 px-3 ml-3">
        {screen !== "mobile" && (
          <Input
            className="w-full border-none bg-transparent focus:ring-0 focus:outline-none tracking-wider font-semibold outline-none focus-visible:ring-0"
            placeholder="Search here"
          />
        )}
        <Search color="#808080" className="w-6 h-6" />
      </div>

      {/* Right: Icons and Profile */}
      <div className="flex items-center gap-4">
        {/* Create Button */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center text-base bg-gray-800 text-white hover:bg-gray-500 dark:bg-gray-950 dark:hover:bg-gray-800 px-3 py-2 rounded-lg">
                {screen === "mobile" ? <Plus className="w-5 h-5" /> : "Create"}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[200px] bg-white dark:bg-gray-900">
                  <li>
                    <NavigationMenuLink className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400">
                      <Video className="w-5 h-5 mr-3" />
                      Upload Video
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400">
                      <File className="w-5 h-5 mr-3" />
                      Create Post
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Theme Toggle */}
        {screen !== "mobile" && <ModeToggle />}

        {/* Notification Bell */}
        <Bell color="#ffffff" className="w-6 h-6 cursor-pointer hover:text-red-500" />

        {/* Profile or Login Button */}
        {user?.statusCode === 200 ? (
          <Profile user={user} screen={screen} />
        ) : (
          <Link to="/api/v1/user/auth/">
            <Button className="px-4 py-2 text-white bg-gray-800 hover:bg-gray-700 rounded-lg">
              Login
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
