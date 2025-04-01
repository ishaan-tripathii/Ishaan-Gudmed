import React from "react";
import { FaHandsHelping, FaRegSmileBeam, FaPiggyBank, FaBrain } from "react-icons/fa";
import { Link } from "react-router-dom";

const benefits = [
  {
    icon: <FaHandsHelping className="w-10 h-10 text-purple-600" />,
    title: "Operational Excellence",
    description:
      "Automated workflows that free up time and reduce errors.",
  },
  {
    icon: <FaRegSmileBeam className="w-10 h-10 text-red-500" />,
    title: "Improved Patient Outcomes",
    description:
      "Faster access to care, better engagement, and continuous follow-ups lead to better health results.",
  },
  {
    icon: <FaPiggyBank className="w-10 h-10 text-green-600" />,
    title: "Cost Efficiency",
    description:
      "By digitizing records and automating processes, hospitals save on costs related to paper, storage, and staff resources.",
  },
  {
    icon: <FaBrain className="w-10 h-10 text-blue-600" />,
    title: "Data-Driven Decision Making",
    description:
      "AI-driven insights help hospitals predict trends, manage resources, and provide more personalized care.",
  },
];

const CTASection = () => {
  return (
    <section className="py-12 px-6 bg-gray-100 rounded-xl shadow-lg text-center md:py-16 lg:px-20">
      <h3 className="text-2xl font-semibold text-[#2E4168] mb-6 sm:text-3xl md:text-4xl">
        The Smart Hospital of Tomorrow – Today with{" "}
        <span className="text-[#2E4168] font-bold">GudMed</span>
      </h3>
      <p className="text-base text-gray-800 mb-8 sm:text-lg md:text-xl">
        Transform your hospital into a smart, efficient, and patient-centered
        facility with GudMed's innovative solutions.
      </p>
      <ul className="space-y-6 text-left md:space-y-8 lg:space-y-10">
        {benefits.map((benefit, index) => (
          <li
            key={index}
            className="flex flex-col md:flex-row items-center md:items-start bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="mb-4 md:mb-0 md:mr-6">{benefit.icon}</div>
            <div>
              <strong className="text-[#2E4168] text-lg md:text-xl">
                {benefit.title}
              </strong>
              <p className="text-gray-700 mt-2">{benefit.description}</p>
            </div>
          </li>
        ))}
      </ul>
      <h4 className="text-2xl font-semibold text-[#2E4168] mt-10 mb-6 sm:text-2xl md:text-4xl">
        Join the Future of Healthcare Today
      </h4>
      <p className="text-base text-gray-800 mb-8 sm:text-lg md:text-xl">
      Embrace GudMed’s smart hospital solutions and leave behind the inefficiencies of physical records and manual processes. Together, we can revolutionize how hospitals operate, ensuring better outcomes for patients and streamlined efficiency for healthcare providers.
      </p>
      <Link to="/contacts">
      <button className="px-6 py-3 bg-[#2E4168] text-white font-semibold rounded-full shadow-lg transition-all duration-300 hover:bg-[#2f4e87] sm:px-8 sm:py-4">
        Get Started with GudMed
      </button>
      </Link>
      
    </section>
  );
};

export default CTASection;
