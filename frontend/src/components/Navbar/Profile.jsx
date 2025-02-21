import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import "./profile.css";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice.js";

const Profile = ({ user, screen }) => {
    const dispatch = useDispatch();
    
    const handleLogoutUser =  () => {
      dispatch(logout()).then(()=>{
        window.location.href = "/api/v1/user/auth"
      });
    }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild >
        <div className="flex flex-col items-center justify-center cursor-pointer">
          <Avatar className={screen === 'mobile' && 'w-8 h-8'}>
            <AvatarImage src={`${user?.data?.Avatar || "https://github.com/shadcn.png"}`} alt="Profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-gray-900 text-white">
        <div className="flex items-center justify-between p-2">
          <div className="flex flex-col items-center justify-center cursor-pointer max-w-[30%]">
            <Avatar>
              <AvatarImage src={`${user?.data?.Avatar || "https://github.com/shadcn.png"}`} alt="Profile" />
              <AvatarFallback className="text-[18px]">
                {/* {user.firstName[0] + user.lastName[0]} */}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="min-w-[70%] h-fit flex items-start justify-center flex-col">
            <h1 className="text-[18px] font-semibold">
              {user?.data?.user?.firstName + " " + user?.data?.user?.lastName}
            </h1>
            <h1 className="text-[15px] font-semibold">
              {user?.data?.user?.channelName}
            </h1>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Visit Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center justify-center bg-red-600 font-semibold text-[15px]" onClick={handleLogoutUser}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;