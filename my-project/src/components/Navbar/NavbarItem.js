import React, { useState } from "react";
import { Link } from "react-router-dom"; // Assuming React Router is being used
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";

const NavbarItem = ({
  list,
  link,
  onMouseEnter,
  onMouseLeave,
  isActive,
  children,
  isFirstItem,
}) => {
  return (
    <li
      className={`relative flex items-center gap-2 cursor-pointer transition-all duration-200 ease-in-out ${
        isFirstItem
          ? "bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg hover:bg-blue-700"
          : isActive
          ? "bg-gray-100 text-black px-6 py-3 rounded-full shadow-md hover:shadow-lg hover:bg-gray-200"
          : "hover:text-gray-700 px-5 py-2 rounded-full hover:bg-gray-100"
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Wrap List Text in Link */}
      <Link
        to={link}
        className="flex items-center gap-2 text-lg font-semibold transition-all duration-300"
      >
        <span className="whitespace-nowrap">{list}</span>

        {/* Conditionally render the ArrowRightRoundedIcon only for "Hospital" */}
        {list === "Hospital" && (
          <ArrowRightRoundedIcon
            size={16}
            className={`transition-transform duration-200 ease-in-out ${
              isFirstItem
                ? "text-white transform hover:rotate-90"
                : "text-black transform hover:rotate-90"
            }`}
          />
        )}
      </Link>

      {/* Render Dropdown or Children */}
      {(children || isActive) && (
        <div
          className={`absolute ${isActive ? "block" : "hidden"} top-full left-0 mt-2 bg-slate-100 shadow-lg rounded-lg w-full sm:w-auto z-50 transition-all duration-300 ease-in-out`}
        >
          {children}
        </div>
      )}
    </li>
  );
};

export default NavbarItem;
