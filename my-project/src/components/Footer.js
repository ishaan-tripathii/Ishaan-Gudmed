/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const quickLinksLeft = [
    { name: "Home", link: "/" },
    { name: "About Us", link: "/about" },
    { name: "Services", link: "/services" },
    { name: "Doctors", link: "/doctors" }
  ];
  
  const quickLinksRight = [
    { name: "IPD", link: "/hospital/ipd" },
    { name: "OPD", link: "/hospital/opd" },
    { name: "Hospital", link: "/hospital" },
    { name: "Team", link: "/team" }
  ];
  
  const socialIcons = [
    { iconClass: "fab fa-facebook-f", link: "https://www.facebook.com/GudMedicare/" },

    { iconClass: "fab fa-twitter", link: "https://x.com/GudMedicare" },
    { iconClass: "fab fa-instagram", link: "https://www.instagram.com/gudmedicare/" },
    { iconClass: "fab fa-youtube", link: "https://www.youtube.com/channel/UC2qkjYWuIsmEuQ5dnMV3l9Q" },
    { iconClass: "fab fa-linkedin", link: "https://www.linkedin.com/company/gudmed/" }
  ];

  return (
    <footer className="bg-gray-100 text-black py-8 mx-auto w-full">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-6">
        {/* About Us Section */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-black tracking-wide">About Us</h2>
          <hr className="border-t-2 w-12 border-primaryLight mb-6" />
          <p className="leading-relaxed mb-6 text-black text-lg">
            Gudmed's unique platform converts prescriptions into digital form, creates secure health records, sends dosage reminders, and allows patients to track vitals. This service is clinic-agnostic and can be accessed anytime via WhatsApp.
          </p>
          <div className="flex space-x-7 mb-4">
            {socialIcons.map((icon, index) => (
              <Link key={index} to={icon.link} className="text-2xl text-black hover:text-primaryLight transition-transform duration-300 transform hover:scale-110">
                <i className={icon.iconClass}></i>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links Section */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-black tracking-wide">Quick Links</h2>
          <hr className="border-t-2 w-12 border-primaryLight mb-6" />
          <ul className="grid grid-cols-2 gap-6 text-sm space-y-2">
  {quickLinksLeft.map((item, index) => (
    <li key={index}>
      <Link to={item.link} className="hover:text-primaryLight transition-colors duration-300">
        {item.name}
      </Link>
    </li>
  ))}
  {quickLinksRight.map((item, index) => (
    <li key={index}>
      <Link to={item.link} className="hover:text-primaryLight transition-colors duration-300">
        {item.name}
      </Link>
    </li>
  ))}
</ul>

        </div>

        {/* Get In Touch Section */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-black tracking-wide">Get In Touch</h2>
          <hr className="border-t-2 w-12 border-primaryLight mb-6" />
          <p className="text-black text-lg mb-4">Corporate Office Address:</p>
          <p className="text-black text-lg mb-4">MM Tower, Plot No 8 & 9, Udyog Vihar-IV Sec 18, Gurugram - 122017</p>
          <div className="flex items-center space-x-4 mb-4">
            <i className="fas fa-phone-alt text-lg"></i>
            <a href="tel:+919999196828" className="text-lg text-black">
              +91-9999196828
            </a>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <i className="fas fa-envelope text-lg"></i>
            <a href="mailto:cs@gudmed.in" className="text-lg text-black">
              cs@gudmed.in
            </a>
          </div>

        </div>

        {/* Google Map Section */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-black tracking-wide">Location</h2>
          <hr className="border-t-2 w-12 border-primaryLight mb-6" />
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.6257960733506!2d77.078248!3d28.490814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19409c876b99%3A0xcbb1f17f595e75f3!2sGudMed!5e0!3m2!1sen!2sin!4v1729791743072!5m2!1sen!2sin"
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="GudMed Google Map"
          ></iframe>
          <div className="flex flex-row items-center space-x-4 mt-2">
            <i className="fas fa-map-marker-alt text-lg"></i>
            <Link
              to="https://maps.app.goo.gl/9ALKd9Jb18nmeAa68"
              target="_blank"
              className="text-lg text-black underline hover:text-primaryLight transition-colors duration-300"
            >
              View on Google Maps
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center mt-12 text-black font-sans text-sm opacity-85">
        &copy; Copyright 2024 | All Rights Reserved by <Link to="https://www.gudmed.in/" className="underline hover:text-primaryLight transition-colors duration-300">Gudmed.in</Link>
      </div>
    </footer>
  );
};

export default Footer;
