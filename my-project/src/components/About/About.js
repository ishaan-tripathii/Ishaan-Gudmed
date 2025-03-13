import React from "react";
import PersonImage from "../../img/ManBackgroundImage.jpg"

const AboutPage = () => {
  return (
    <div className="relative bg-black text-white min-h-screen flex items-center justify-center ">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url('https://www.svgrepo.com/show/327601/topographic-map.svg')`, // Replace with appropriate wavy background
            opacity: 0.1,
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative flex flex-col lg:flex-row items-center max-w-7xl mx-auto px-6 gap-32">
        {/* Left Graphic Section */}
        <div className="flex-1 flex items-center justify-center relative">
          {/* Red overlapping graphic */}
          <div className="absolute">
            <div className="flex flex-col gap-3 transform rotate-45">
              <div className="bg-gradient-to-r from-red-500 to-red-700 w-24 h-48 rounded-full z-50"></div>
              <div className="bg-gradient-to-r from-red-500 to-red-700 w-24 h-48 rounded-full"></div>
              <div className="bg-gradient-to-r from-red-500 to-red-700 w-24 h-48 rounded-full"></div>
            </div>
          </div>
          {/* Human Silhouette */}
          <img
            src={PersonImage} // Replace with actual image
            alt="Person"
            className="relative z-1 rounded-full bg-white"
          />
        </div>

        {/* Right Text Section */}
        <div className="flex-1 text-left space-y-6">
          {/* About Pre-text */}
          
          {/* Main Heading */}
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight flex-wrap w-full">
            Welcome to new era of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-500">
              Neural networks
            </span>
          </h1>
          {/* Description */}
          <p className="text-lg leading-relaxed text-gray-300">
            Artificial intelligence refers to the development of computer
            systems that can perform tasks that would typically require human
            intelligence. It involves the creation of algorithms and models
            that enable machines to learn, reason, perceive, and make decisions.
            <br />
            <br />
            There are generally two types of AI: Narrow AI or Weak AI, which is
            designed to perform specific tasks, and General or Strong AI, which
            possesses human-level intelligence and can handle a wide range of
            tasks.
          </p>
          {/* Button */}
          <button className="px-6 py-3 bg-white text-black font-semibold rounded-lg flex items-center gap-2 hover:bg-gray-200">
            <span>Explore more</span>
            <span>&gt;</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
