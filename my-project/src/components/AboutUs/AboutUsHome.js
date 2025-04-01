import React from "react";
import { FaHandsHelping, FaLaptopMedical, FaHeartbeat } from "react-icons/fa"; // Import icons
import AboutUsImage from "../../img/AboutUs.pnj.png"; // Adjust the path if needed
import Achievements from "./AchievMent";

// Reusable Component for Section Title
const SectionTitle = ({ title }) => (
  <h2 className="text-3xl md:text-5xl font-bold  text-center mb-6  sm:mb-16 md:mb-32 lg:mb-16 text-[#2E4168]">
    {title}
  </h2>
);

// Reusable Component for About Section
const AboutSection = ({ title, text, image }) => (
  <div className="flex flex-col md:flex-row items-center gap-16    ">
    {/* Image Section */}
    <div className="w-full md:w-1/2 flex justify-center mt-0 md:-mt-32 lg:mt-3  sm:mt-80 ">
      <img
        src={AboutUsImage}
        alt={title}
        className="w-full max-h-[300px]  sm:max-h-[450px] md:max-h-[750px] lg:max-h-[350px] xl: rounded-lg shadow-lg object-cover transition-transform duration-300"
      />
    </div>

    {/* Text Section */}
    <div className="w-full md:w-1/2 mt-0 md:-mt-20   lg:-mt-16 sm:-mt-80 ">
      <div className="flex items-center space-x-3 mb-4 text-center  ">
        <FaHandsHelping className="text-[#2E4168] text-4xl" />
        <h3 className="text-4xl md:text-3xl font-semibold ml-4 md:text-center text-[#2E4168]">{title}</h3>
      </div>
      <p className="text-[#2E4168]text-base md:text-lg leading-relaxed">{text}</p>
    </div>
  </div>
);



// Main About Us Page Component
const AboutUsHome = () => {
  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto ">
      {/* Page Title */}
      <SectionTitle title="About Us"  className="text-[#2E4168]"/>

      {/* About Section */}
      <AboutSection
        title="Who We Are"
        text="At GudMed, we believe that technology can bridge the gap between healthcare providers and patients. Founded by experts in healthcare and technology, we are dedicated to making healthcare smarter and more efficient. Our mission is to simplify healthcare operations while ensuring better patient outcomes. Through innovation and collaboration, GudMed is transforming how hospitals, doctors, and patients interact in the digital age."
        image={AboutUsImage}
        
      />

      
      <Achievements></Achievements>
    </div>
  );
};

export default AboutUsHome;
