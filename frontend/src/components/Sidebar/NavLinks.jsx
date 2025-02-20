import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";

const NavLinks = ({
  href,
  icon: Icon,
  bgColor = "",
  bgHoverColor = "",
  textColor = "",
  textHoverColor = "",
  label = "",
  avatarURL = "",
}) => {
  return (
    <Link
      href={href}
      className="w-full flex items-center justify-center pt-2 group"
      aria-label={label}
    >
      <div
        className={`w-[90%] flex items-center p-1 rounded-lg text-[15px] font-semibold h-10 transition-colors duration-300 ${bgColor} ${bgHoverColor} ${
          !label ? "justify-center" : "justify-between"
        }`}
      >
        <div className={`w-[30%] flex items-center justify-center`}>
          {avatarURL ? (
            <Avatar className=" w-[40px]">
              <AvatarImage
                src={avatarURL}
                alt="@shadcn"
                className="w-[30ppx] h-[30px] rounded-2xl"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ) : (
            <Icon
              size={22}
              className={`${textColor} group-hover:${textHoverColor} transition-colors duration-300`}
              aria-hidden="true"
            />
          )}
        </div>
        {label && (
          <p
            className={`w-[60%] ${textColor} group-hover:${
              textHoverColor || "text-blue-200"
            } transition-colors duration-300`}
          >
            {label}
          </p>
        )}
      </div>
    </Link>
  );
};

export default NavLinks;
