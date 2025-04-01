import React, { useState, useEffect } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import NavList from "./NavList";
import NavbarItem from "./NavbarItem";
import NavbarDropdown from "./NavbarDropdown";
import Logo from "../../img/Gudmed1.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700); // For mobile (phones)
  const [isLaptop, setIsLaptop] = useState(window.innerWidth <= 1200 && window.innerWidth > 700); // For laptop (tablets and small laptops)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1200); // For desktop

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 700);
      setIsLaptop(window.innerWidth <= 1200 && window.innerWidth > 700);
      setIsDesktop(window.innerWidth > 1200);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseEnter = (list) => {
    if (!isMobile) setActiveDropdown(list); // Only handle hover for non-mobile devices
  };

  const handleMouseLeave = () => {
    if (!isMobile) setActiveDropdown(null); // Only handle hover for non-mobile devices
  };

  const handleDropdownToggle = (list, event) => {
    if (event) event.stopPropagation();
    setActiveDropdown((prev) => (prev === list ? null : list));
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <div className="p-4 bg-gray-100">
      <div className="bg-white shadow-md rounded-lg px-4 py-4 lg:px-12 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link to="/" onClick={closeMobileMenu}>
            <img
              src={Logo || "https://via.placeholder.com/150"}
              alt="logo"
              className="h-8 sm:h-10 md:h-12 lg:h-14 xl:h-16 w-auto"
            />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="xl:hidden  block items-center">
  <button className="text-3xl" onClick={toggleMobileMenu}>
    {mobileMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
  </button>
</div>


        {/* Desktop Navigation */}
        {isDesktop && (
          <div className="hidden lg:flex flex-1 justify-center">
            <ul className="flex gap-6 items-center font-medium text-base">
              {NavList.map((item) => (
                <li
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.list)}
                  onMouseLeave={handleMouseLeave}
                >
                  <NavbarItem
                    list={item.list}
                    link={item.link}
                    isActive={activeDropdown === item.list}
                  />
                  {item.dropdown && activeDropdown === item.list && (
                    <div className="absolute top-full left-0 z-20 bg-white shadow-lg rounded-md p-2">
                      <NavbarDropdown
                        key={item.id}
                        dropdown={item.dropdown}
                        isMobile={isMobile}
                        closeMenu={closeMobileMenu}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contact Button (Visible in Desktop) */}
        {isDesktop && (
          <div className="hidden lg:flex items-center">
            <Link to="/contacts" onClick={closeMobileMenu}>
              <button className="px-6 py-3 text-lg font-semibold rounded-full border border-[#2E4168] text-black transition hover:bg-[#2E4168] hover:text-white">
                Get in Touch
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Navigation (Visible only in Mobile/Tablet) */}
      {mobileMenuOpen && (isMobile || isLaptop) && (
        <div className="xl:hidden mt-4 bg-white rounded-lg shadow-lg p-4">
          <ul className="flex flex-col gap-4">
            {NavList.map((item) => (
              <li
                key={item.id}
                className="relative"
                onClick={(e) => handleDropdownToggle(item.list, e)}
              >
                <Link to={item.link} onClick={closeMobileMenu}>
                  <NavbarItem
                    list={item.list}
                    link={item.link}
                    isActive={activeDropdown === item.list}
                  />
                </Link>
                {item.dropdown && activeDropdown === item.list && (
                  <div className="mt-2 mb-32 md:mb-0">
                    <NavbarDropdown
                      key={item.id}
                      dropdown={item.dropdown}
                      isMobile={isMobile}
                      closeMenu={closeMobileMenu}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
          <Link to="/contacts" onClick={closeMobileMenu}>
            <button className="mt-6 w-full px-6 py-3 text-lg font-semibold rounded-full border border-[#2E4168] text-black transition hover:bg-[#2E4168] hover:text-white">
              Get in Touch
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
