import {
  Menu,
  House,
  Clapperboard,
  History,
  ListVideo,
  ThumbsUp,
  TvMinimalPlay,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator";
import NavLinks from "./NavLinks";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const [sidebarGrow, setSidebarGrow] = useState(false);
  const theme = localStorage.getItem("vite-ui-theme");
  const screenType = useSelector((state) => state.screen.screenType)

  if(screenType === 'mobile' || screenType === 'tablet') return null;
  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        sidebarGrow ? "w-[200px]" : "w-[80px]"
      } max-h-full rounded-xl flex flex-col items-center justify-between overflow-clip ${
        theme === "light" && "border-[1px] border-gray-500"
      }`}
    >
      <div className="flex flex-col overflow-x-clip items-start justify-between min-h-[150px] w-full">
        <Button className="w-full rounded-bl-none rounded-br-none" onClick={() => setSidebarGrow((prev) => !prev)}>
          <Menu />
        </Button>
        <div className="w-full h-full flex flex-col items-center">
          <NavLinks
            href={"/"}
            icon={House}
            label={sidebarGrow && "Home"}
            bgColor="bg-gray-600"
            bgHoverColor="hover:bg-gray-800"
            textColor="text-gray-100"
            textHoverColor="white"
          />
          <NavLinks
            href={"/"}
            icon={Clapperboard}
            label={sidebarGrow && "Shorts"}
            bgColor="bg-gray-600"
            bgHoverColor="hover:bg-gray-800"
            textColor="text-gray-100"
            textHoverColor="white"
          />
          <NavLinks
            href={"/"}
            icon={History}
            label={sidebarGrow && "History"}
            bgColor="bg-gray-600"
            bgHoverColor="hover:bg-gray-800"
            textColor="text-gray-100"
            textHoverColor="white"
          />
          <NavLinks
            href={"/"}
            icon={ListVideo}
            label={sidebarGrow && "Playlists"}
            bgColor="bg-gray-600"
            bgHoverColor="hover:bg-gray-800"
            textColor="text-gray-100"
            textHoverColor="white"
          />
          <NavLinks
            href={"/"}
            icon={ThumbsUp}
            label={sidebarGrow && "Liked videos"}
            bgColor="bg-gray-600"
            bgHoverColor="hover:bg-gray-800"
            textColor="text-gray-100"
            textHoverColor="white"
          />
          {!sidebarGrow && (
            <NavLinks
              href={"/"}
              icon={TvMinimalPlay}
              label=""
              bgColor="bg-gray-600"
              bgHoverColor="hover:bg-gray-800"
              textColor="text-gray-100"
              textHoverColor="white"
            />
          )}
        </div>
      </div>
      {sidebarGrow && <Separator className={`mt-1 mb-1 w-[95%] ${theme === "light" && "bg-gray-800"}`} />}
      {sidebarGrow && (
        <div className="w-full h-fit flex flex-col flex-grow">
          <h1 className="text-[17px] ml-2 font-semibold">Subscriptions</h1>
          <div>
            <NavLinks
              avatarURL={"https://github.com/shadcn.png"}
              label={"channel"}
              bgColor="bg-gray-600"
              bgHoverColor="hover:bg-gray-800"
              textColor="text-gray-100"
              textHoverColor="white"
            />
          </div>
        </div>
      )}
      <Separator className="mt-1 mb-1 w-[95%]" />
      <div className="bg-gray-400 w-full h-[150px] text-[14px] flex">Footer</div>
    </div>
  );
};

export default Sidebar;
