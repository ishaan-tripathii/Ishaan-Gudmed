import React from "react";
import { 
  FaCamera, 
  FaCog, 
  FaServer, 
  FaShieldAlt, 
  FaUserFriends, 
  FaBolt, 
  FaCheckCircle, 
  FaPrescriptionBottle, 
  FaLock, 
  FaHospital 
} from "react-icons/fa"; // Importing additional icons
import SmartCameraImage from "../../img/Camera-removebg-preview.png"; // Adjust the path to where your image is stored

const GudMedSmartCamera = () => {
  // Features list with icons
  const features = [
    { 
      icon: <FaCamera className="text-blue-600 text-3xl" />, 
      title: "High-Quality Image Capture", 
      description: "Clear, high-resolution images ensure precision, even with poor handwriting." 
    },
    { 
      icon: <FaCog className="text-blue-600 text-3xl" />, 
      title: "Real-Time AI Processing", 
      description: "AI instantly processes images using OCR for accurate digitization." 
    },
    { 
      icon: <FaServer className="text-blue-600 text-3xl" />, 
      title: "Seamless Integration", 
      description: "Digitized prescriptions are sent directly to hospital systems." 
    },
    { 
      icon: <FaBolt className="text-blue-600 text-3xl" />, 
      title: "Automatic Validation", 
      description: "AI detects and flags errors for review to ensure accuracy." 
    },
    { 
      icon: <FaShieldAlt className="text-blue-600 text-3xl" />, 
      title: "Secure Data Transfer", 
      description: "Encrypted channels protect sensitive patient data." 
    },
    { 
      icon: <FaUserFriends className="text-blue-600 text-3xl" />, 
      title: "User-Friendly Design", 
      description: "Intuitive interface requires minimal training for healthcare staff." 
    },
  ];

  // Benefits list with icons
  const benefits = [
    { 
      icon: <FaPrescriptionBottle className="text-blue-600 text-2xl" />, 
      text: "Reduces time spent on manual data entry." 
    },
    { 
      icon: <FaCheckCircle className="text-blue-600 text-2xl" />, 
      text: "Minimizes errors with high-accuracy OCR." 
    },
    { 
      icon: <FaHospital className="text-blue-600 text-2xl" />, 
      text: "Connects directly to hospital systems for real-time access." 
    },
    { 
      icon: <FaBolt className="text-blue-600 text-2xl" />, 
      text: "Speeds up workflows, reducing patient waiting time." 
    },
    { 
      icon: <FaLock className="text-blue-600 text-2xl" />, 
      text: "Safeguards sensitive medical data with secure protocols." 
    },
    { 
      icon: <FaUserFriends className="text-blue-600 text-2xl" />, 
      text: "Adopted quickly without disrupting routines." 
    },
  ];

  return (
    <div className="flex justify-center px-4 py-10 bg-gray-100">
      <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-8 w-full  mx-auto">
        {/* Title Section */}
        <h2 className="md:text-4xl text-[1.1rem] md:font-semibold font-bold  text-[#2E4168] text-center mb-8">
        GudMed Smart Camera: Transforming Prescription Management with Cutting-Edge Digitization
        </h2>

        {/* Image and Features Section */}
        <div className="flex flex-col lg:flex-row items-center lg:space-x-12">
          {/* Image */}
          <div className="w-full lg:w-1/2 flex justify-center mb-8 lg:mb-0">
            <img
              src={SmartCameraImage}
              alt="GudMed Smart Camera"
              className="w-full max-w-md h-auto object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Features */}
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-4 border border-gray-300 rounded-lg hover:shadow-lg transition-transform duration-300 transform hover:scale-105"
                >
                  {feature.icon}
                  <h3 className="text-lg font-bold text-[#2E4168] mt-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-10 w-full">
          <h3 className="text-4xl font-semibold text-[#2E4168] mb-6 mt-4 text-center">
            Key Benefits of GudMed Smart Camera
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg hover:bg-gray-200 transition duration-300"
              >
                {benefit.icon}
                <span className="text-gray-800 font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GudMedSmartCamera;