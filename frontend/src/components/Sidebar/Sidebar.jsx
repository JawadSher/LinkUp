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
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const Sidebar = ({ children }) => {
  const [sidebarGrow, setSidebarGrow] = useState(false);

  return (
    <div
      className={` transition-all duration-300 ease-in-out ${
        sidebarGrow ? "w-[200px]" : " w-[80px]"
      } max-h-full rounded-xl flex flex-col items-center justify-between overflow-clip`}
    >
      <div className=" flex flex-col overflow-x-clip items-start justify-between min-h-[150px] w-full">
        <Button
          className={`w-full rounded-bl-none rounded-br-none`}
          onClick={() => setSidebarGrow((prev) => !prev)}
        >
          <Menu />
        </Button>
        <div className="w-full h-full flex flex-col items-center">
          <Button
            className={`w-[90%] mt-3 flex items-center ${
              sidebarGrow ? "justify-between" : "justify-center"
            }`}
          >
            <House />
            {sidebarGrow ? <p className="mr-[60px]">Home</p> : null}
          </Button>
          <Button
            className={`w-[90%] mt-1 flex items-center ${
              sidebarGrow ? "justify-between" : "justify-center"
            }`}
          >
            <Clapperboard />
            {sidebarGrow ? <p className="mr-[60px]">Shorts</p> : null}
          </Button>
          <Button
            className={`w-[90%] mt-1 flex items-center ${
              sidebarGrow ? "justify-between" : "justify-center"
            }`}
          >
            <History />
            {sidebarGrow ? <p className="mr-[60px]">History</p> : null}
          </Button>
          <Button
            className={`w-[90%] mt-1 flex items-center ${
              sidebarGrow ? "justify-between" : "justify-center"
            }`}
          >
            <ListVideo />
            {sidebarGrow ? <p className="mr-[60px]">Playlists</p> : null}
          </Button>
          <Button
            className={`w-[90%] mt-1 flex items-center ${
              sidebarGrow ? "justify-between" : "justify-center"
            }`}
          >
            <ThumbsUp />
            {sidebarGrow ? <p className="mr-[60px]">Liked videos</p> : null}
          </Button>
          {!sidebarGrow ? (
            <Button
              className={`w-[90%] mt-1 flex items-center ${
                sidebarGrow ? "justify-between" : "justify-center"
              }`}
            >
              <TvMinimalPlay />
            </Button>
          ) : null}
        </div>
      </div>
      {
        sidebarGrow && <Separator className="mt-1 mb-1 w-[95%]" />
      }
      {
        sidebarGrow && <div className="w-full h-fit flex-grow">
        <h1 className="text-[20px]">Subscriptions</h1>
        <div className="mt-3">
          <Button className="flex items-center justify-between w-full ">
            <Avatar className=" w-[40px]">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" className="w-[30ppx] h-[30px] rounded-2xl" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className=" w-full text-left pl-1">xyz channel</h1>
          </Button>
        </div>
      </div>
      }
      <Separator className="mt-1 mb-1 w-[95%]" />
      <div className="bg-gray-400 w-full h-[150px] text-[14px] flex">
        Footer
      </div>
    </div>
  );
};

export default Sidebar;
