import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import { Toaster, toast } from "react-hot-toast";

const socket = io("http://localhost:5000");

const NewFooter = () => {
  const [footer, setFooter] = useState({
    copyright: {
      year: 2025,
      companyName: "Gud Medicare Solutions Private Limited",
      rightsReserved: "All rights reserved ®",
    },
    contact: {
      phone: "+91-9999196828",
      email: "cs@gudmed.in",
    },
    socialIcons: [
      { iconClass: "fab fa-whatsapp", link: "https://wa.me/919999196828" },
      { iconClass: "fab fa-facebook-f", link: "https://www.facebook.com/GudMedicare/" },
      { iconClass: "fab fa-twitter", link: "https://x.com/GudMedicare" },
      { iconClass: "fab fa-instagram", link: "https://www.instagram.com/gudmedicare/" },
      { iconClass: "fab fa-youtube", link: "https://www.youtube.com/channel/UC2qkjYWuIsmEuQ5dnMV3l9Q" },
      { iconClass: "fab fa-linkedin", link: "https://www.linkedin.com/company/gudmed/" },
    ],
    logoUrl: "https://gudmed.in/static/media/Gudmed1-removebg-preview.35f892b86290e3dc089a.png",
  });
  const [loading, setLoading] = useState(true);

  const fetchFooter = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/footer");
      setFooter({
        copyright: response.data.copyright || footer.copyright,
        contact: response.data.contact || footer.contact,
        socialIcons: response.data.socialIcons || footer.socialIcons,
        logoUrl: response.data.logoUrl || footer.logoUrl,
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching footer data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooter();
    socket.on("footerUpdated", () => {
      fetchFooter();
      toast.success("Footer updated in real-time!");
    });
    return () => socket.off("footerUpdated");
  }, []);

  if (loading) return <div className="text-center py-10 text-white">Loading...</div>;

  return (
    <footer className="bg-[#2E4168] text-white text-sm md:text-base py-6 px-4 sm:px-6 w-full md:mt-0 -mt-2">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-7xl mx-auto flex flex-col items-center space-y-6">
        <div className="w-full flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-6 lg:space-y-0">
          {/* Left Section */}
          <div className="text-center lg:text-left md:text-left sm:ml-0">
            {/* For mobile devices */}
            <div className="block sm:hidden">
              <p className="text-base sm:text-xl whitespace-nowrap ml-2 mr-2">
                © {footer.copyright.year} <strong>{footer.copyright.companyName}</strong>
              </p>
              <p className="text-lg sm:text-xl">{footer.copyright.rightsReserved}</p>
              <div className="mt-2 text-sm sm:text-base">
                <div className="flex justify-center gap-2">Privacy Policy Terms & Conditions</div>
              </div>
            </div>

            {/* For larger screens */}
            <div className="hidden sm:block">
              <p className="text-lg sm:text-xl lg:text-left xl:-ml-20 md:text-center">
                © {footer.copyright.year} <strong>{footer.copyright.companyName}</strong> <br />
                {footer.copyright.rightsReserved}
              </p>
              <div className="mt-2 text-sm sm:text-base">
                <div className="flex flex-wrap md:justify-center lg:justify-start gap-2 xl:-ml-20">
                  Privacy Policy Terms & Conditions
                </div>
              </div>
            </div>
          </div>

          {/* Logo Section */}
          <div className="flex justify-center lg:justify-center">
            <div className="relative w-36 h-16 bg-slate-100 p-2 rounded-lg md:mt-0 -mt-4">
              <img
                src={footer.logoUrl || "/placeholder.svg"}
                alt="Gudmed logo"
                className="object-contain w-full h-full"
              />
            </div>
          </div>

          {/* Contact Info and Social Icons */}
          <div className="text-center lg:text-right space-y-0 xl:-mr-20">
            <div className="flex flex-col items-center sm:items-center lg:items-end space-y-1 sm:space-y-3 w-full md:mt-0 -mt-5">
              <a
                href={`tel:${footer.contact.phone}`}
                className="flex items-center justify-center md:justify-center lg:justify-end text-sm sm:text-lg hover:text-gray-300"
              >
                <i className="fas fa-phone-alt rotate-90 text-xl sm:text-2xl md:text-2xl"></i>
                <span className="ml-2 text-base sm:text-lg md:text-xl"> Contact Us: {footer.contact.phone}</span>
              </a>

              <a
                href={`mailto:${footer.contact.email}`}
                className="flex items-center text-lg sm:text-xl md:text-xl text-center sm:text-center lg:text-right hover:text-gray-300"
              >
                <i className="fas fa-envelope text-xl mr-2"></i>
                Email Us: {footer.contact.email}
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center gap-4 xl:-mr-24 sm:justify-center md:justify-center lg:justify-end w-full md:gap-2 lg:gap-4 mt-4 lg:mt-2">
              {footer.socialIcons.map((icon, index) => (
                <a
                  key={index}
                  href={icon.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 flex items-center justify-center bg-[#2E4168] rounded-full"
                  style={{
                    width: "clamp(2.4rem, 3vw, 3rem)",
                    height: "clamp(2.4rem, 3.5vw, 3.2rem)",
                    fontSize: "clamp(1.50rem, 3vw, 1.4rem)",
                  }}
                >
                  <i className={icon.iconClass}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default NewFooter;