import React from "react";
import { FaCamera, FaBrain, FaServer, FaHeartbeat, FaLaptopMedical, FaCheckCircle } from "react-icons/fa";

// Doctor image (replace this with your actual doctor image path)


const icons = {
    camera: <FaCamera className="text-blue-600 text-4xl mb-4" />,
    ai: <FaBrain className="text-blue-600 text-4xl mb-4" />,
    data: <FaServer className="text-blue-600 text-4xl mb-4" />,
    monitoring: <FaHeartbeat className="text-blue-600 text-4xl mb-4" />,
    platform: <FaLaptopMedical className="text-blue-600 text-4xl mb-4" />,
};

const FeatureCard = ({ title, description, features, icon }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-transform transform flex flex-col md:flex-row justify-between items-center">
            

            {/* Content Section (Right Side) */}
            <div className="w-full md:w-2/3 mt-4 md:mt-0">
                {/* Icon */}
                <div className="flex justify-center">{icons[icon]}</div>

                {/* Text Section */}
                <div className="mt-4">
                    <h3 className="text-2xl font-bold text-blue-800 text-center mb-4">{title}</h3>
                    <p className="text-gray-700 text-center mb-6">{description}</p>
                    <h4 className="text-lg font-semibold text-blue-800 mb-3">Features:</h4>
                    <ul className="space-y-3">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2">
                                <FaCheckCircle className="text-blue-600" />
                                <span className="text-gray-700">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default FeatureCard;
