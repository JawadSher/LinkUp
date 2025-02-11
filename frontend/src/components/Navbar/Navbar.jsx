import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import Profile from "./Profile";

const Navbar = ({userData}) => {
  console.log(userData)
  
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
      <div>
        {userData?.statusCode === 200 ? (
          <Profile userData={userData} />
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
