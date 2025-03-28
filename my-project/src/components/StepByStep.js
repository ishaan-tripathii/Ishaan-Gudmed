import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { getStepByStep } from "./Service/apiService"; // Assuming this is correct
import { connectSocket, onStepByStepUpdate, onStepByStepCreate, onStepByStepDelete, disconnectSocket } from "./Service/socketService"; // Corrected path
import config from "../config/config"; // Import config

const StepByStep = () => {
  const [data, setData] = useState({ steps: [], heading: "", subheading: "", description: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize both API and Socket.IO in a single lifecycle
    const socket = connectSocket(config.socketBaseUrl); // Use socketBaseUrl from config

    // Fetch initial data via API
    const fetchData = async () => {
      try {
        const initialData = await getStepByStep(config.apiBaseUrl); // Use apiBaseUrl from config
        setData(initialData);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load initial data");
        setLoading(false);
      }
    };

    fetchData();

    // Set up Socket.IO event listeners for real-time updates
    onStepByStepUpdate((updatedData) => {
      setData(updatedData);
      toast.success("Step-by-step data updated!");
    });

    onStepByStepCreate((newData) => {
      setData(newData);
      toast.success("Step-by-step data created!");
    });

    onStepByStepDelete(() => {
      setData({ steps: [], heading: "", subheading: "", description: "" });
      toast.success("Step-by-step data deleted!");
    });

    // Cleanup Socket.IO connection on unmount
    return () => {
      disconnectSocket();
    };
  }, []); // Empty dependency array ensures this runs once on mount

  // Arrow icon component
  const ArrowIcon = ({ size }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-${size} w-${size} text-[#2E4168]`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );

  // Down arrow icon component
  const DownArrowIcon = ({ size }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-${size} w-${size} text-[#2E4168]`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 13l5 5m0 0l5-5m-5 5V6" />
    </svg>
  );

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="px-4 sm:px-8 lg:px-16">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="-mt-20 md:-mt-16 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-4xl font-semibold text-[#2E4168] mb-6">
          {data.heading || "🔧 HOW WE WORKS?"}
        </h2>
        <h3 className="text-lg sm:text-xl lg:text-3xl text-[#2E4168] font-medium max-w-2xl mx-auto text-center -mt-4 md:mt-0">
          {data.subheading || "Simplifying Healthcare with GudMed: 🔧"}
        </h3>
        <p className="text-sm sm:text-base lg:text-lg text-[#2E4168] mt-4 max-w-3xl mx-auto">
          {data.description ||
            "At GudMed, we believe that technology should enhance the work you already do, not complicate it."}
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 md:gap-32 gap-3 relative">
        {data.steps.map((step, index) => (
          <React.Fragment key={step._id || index}>
            <div className="flex flex-col items-center text-center">
              <div className="bg-gradient-to-r from-[#2E4168] to-[#4A5C84] text-white md:p-8 p-10 rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105">
                <div className="font-bold text-lg sm:text-xl lg:text-2xl mb-2">{step.title}</div>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 mt-4">
                {step.description}
              </p>
              {index < data.steps.length - 1 && (
                <div className="sm:hidden mt-6">
                  <DownArrowIcon size={12} />
                </div>
              )}
            </div>
            {index === 0 && data.steps.length > 1 && (
              <div className="hidden sm:block lg:flex justify-center items-center absolute top-1/3 left-[40%] sm:left-[48%] md:left-[22%] lg:left-[28%] transform -translate-y-1/2 font-medium">
                <ArrowIcon size={32} />
              </div>
            )}
            {index === 1 && data.steps.length > 2 && (
              <div className="hidden sm:block lg:flex justify-center items-center absolute top-1/3 left-[50%] sm:left-[48%] md:left-[62%] lg:left-[64%] transform -translate-y-1/2 font-medium">
                <ArrowIcon size={32} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepByStep;