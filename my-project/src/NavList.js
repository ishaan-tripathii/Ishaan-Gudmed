import React, { useState } from "react";
import NavbarItem from "./NavbarItem"; // Import NavbarItem component
import NavList from "./NavList"; // Assuming NavList is your data file

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleMouseEnter = (list) => {
    setActiveDropdown(list);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <div className="flex-1 ml-48 relative">
      <ul className="flex gap-10 items-center font-medium text-xl text-center">
        {NavList.map((item, index) => (
          <NavbarItem
            key={item.id}
            list={item.list}
            onMouseEnter={() => handleMouseEnter(item.list)}
            onMouseLeave={handleMouseLeave}
            isActive={activeDropdown === item.list}
            isFirstItem={index === 0} // Check if it's the first item
          >
            {item.dropdown && activeDropdown === item.list && (
              <div>{/* Dropdown menu goes here */}</div>
            )}
          </NavbarItem>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
