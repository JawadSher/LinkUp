import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import Profile from "./Profile";

const Navbar = ({ user }) => {
  return (
    <div className="m-3 w-full h-[70px] bg-gray-950 flex items-center justify-between px-5 rounded-xl">
      <div className="flex items-center justify-center">
        <Link to="/">
          <Button className="border-none outline-none bg-transparent text-white text-[30px] flex items-center justify-center w-full h-full hover:bg-transparent hover:text-blue-500">
            Linkup
          </Button>
        </Link>
      </div>
      <div className="min-w-[500px] min-h-8 rounded-full border-2 border-gray-500 flex items-center pr-2">
        <Input
          className="w-full h-full rounded-full mr-2 border-0 focus-visible:ring-0 focus:outline-none focus:border-0"
          placeholder="Search here"
        />
        <Search
          color="#808080"
          className="border-l-2 border-gray-500 pl-1 w-7"
        />
      </div>
      <div>
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
