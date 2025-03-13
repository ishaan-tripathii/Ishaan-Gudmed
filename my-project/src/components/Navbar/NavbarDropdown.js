import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";

const NavbarDropdown = ({ dropdown, isMobile, closeMenu }) => {
  return (
    <div
      className={`${
        isMobile ? "absolute top-2 left-0 w-full" : "relative"
      } bg-white mt-12 md:mt-0 text-black rounded-lg shadow-lg p-2 md:px-4 z-50 border border-bg-white`}
    >
      <div className="grid grid-cols-1 gap-6 md:flex md:gap-8">
        {dropdown.map((section, index) => (
          <div key={index} className="flex flex-col gap-6">
            {/* Section Title */}
            {section?.title && (
              <h3
                className="text-lg font-semibold text-white mb-4 flex items-center gap-2  hover:rotate-45"
                aria-label={`Section title: ${section.title}`}
              >
                <ArrowRightRoundedIcon
                  className="text-white hover:text-red-400 transition-transform duration-300 "
                />
                {section.title}
              </h3>
            )}

            {/* Section Items */}
            {section?.items && (
              <ul className="flex flex-col gap-3">
                {section.items.map((item, subIndex) => (
                  <li
                    key={subIndex}
                    className="cursor-pointer hover:bg-slate-100 hover:translate-x-2 transition-transform duration-300 rounded-lg flex items-center gap-2 p-2 mb-2 text-black"
                    tabIndex="0"
                    onClick={closeMenu} // Close menu when submenu item is clicked
                  >
                    <ArrowRightRoundedIcon
                      size={12}
                      className="text-black transition-transform duration-300 "
                    />
                    {typeof item === "object" && item?.name && item?.link ? (
                      <Link
                        to={item.link}
                        className="text-sm font-medium  text-black transition-all duration-300 px-2"
                        aria-label={`Navigate to ${item.name}`}
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <span className="text-sm font-medium text-white hover:text-red-400">
                        {item}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavbarDropdown;
