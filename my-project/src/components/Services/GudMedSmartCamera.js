import React, { useState, useEffect } from "react";
import axios from "axios";
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
} from "react-icons/fa";
import SmartCameraImage from "../../img/Camera-removebg-preview.png";

// Icon mapping for dynamic rendering
const iconMap = {
  FaCamera: FaCamera,
  FaCog: FaCog,
  FaServer: FaServer,
  FaShieldAlt: FaShieldAlt,
  FaUserFriends: FaUserFriends,
  FaBolt: FaBolt,
  FaCheckCircle: FaCheckCircle,
  FaPrescriptionBottle: FaPrescriptionBottle,
  FaLock: FaLock,
  FaHospital: FaHospital
};

const GudMedSmartCamera = () => {
  const [cameraData, setCameraData] = useState({
    features: [],
    benefits: [],
    title: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCameraData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get("http://localhost:5000/api/smartCamera");
        
        if (response.data.success) {
          setCameraData({
            features: response.data.features || [],
            benefits: response.data.benefits || [],
            title: response.data.title || "GudMed Smart Camera: Transforming Prescription Management with Cutting-Edge Digitization"
          });
        }
      } catch (err) {
        console.error("Error fetching camera data:", err);
        setError("Failed to load camera data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCameraData();
  }, []);

  // Render icon dynamically
  const renderIcon = (iconName, size = "text-3xl") => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className={`text-blue-600 ${size}`} /> : null;
  };

  return (
    <div className="flex justify-center px-4 py-10 bg-gray-100">
      <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-8 w-full mx-auto">
        {/* Title Section */}
        <h2 className="md:text-4xl text-[1.1rem] md:font-semibold font-bold text-[#2E4168] text-center mb-8">
          {cameraData.title}
        </h2>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-10">
            <p className="text-gray-600">Loading data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-10">
            <p className="text-red-600">{error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <>
            <div className="flex flex-col lg:flex-row items-center lg:space-x-12">
              {/* Image */}
              <div className="w-full lg:w-1/2 flex justify-center mb-8 lg:mb-0">
                <img
                  src={SmartCameraImage}
                  alt="GudMed Smart Camera"
                  className="w-full max-w-md h-auto object-cover rounded-lg shadow-md"
                />
              </div>

              {/* Dynamic Features */}
              <div className="w-full lg:w-1/2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {cameraData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center text-center p-4 border border-gray-300 rounded-lg hover:shadow-lg transition-transform duration-300 transform hover:scale-105"
                    >
                      {renderIcon(feature.icon)}
                      <h3 className="text-lg font-bold text-[#2E4168] mt-4">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-2">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dynamic Benefits */}
            <div className="mt-10 w-full">
              <h3 className="text-4xl font-semibold text-[#2E4168] mb-6 mt-4 text-center">
                Key Benefits of GudMed Smart Camera
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cameraData.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg hover:bg-gray-200 transition duration-300"
                  >
                    {renderIcon(benefit.icon, "text-2xl")}
                    <span className="text-gray-800 font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GudMedSmartCamera;