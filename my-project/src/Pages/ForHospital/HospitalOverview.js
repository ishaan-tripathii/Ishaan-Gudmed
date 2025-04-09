import React, { useState, useEffect } from 'react';
import io from "socket.io-client";
import axios from "axios";
import config from "../../config/config";

const HospitalOverview = () => {
  const [smartCareData, setSmartCareData] = useState(null);

  useEffect(() => {
    const socket = io(config.socketBaseUrl, {
      autoConnect: true,
      reconnection: true,
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/api/smartCare`);
        if (response.data.success && response.data.data) {
          setSmartCareData(response.data.data); // 👈 no [0] here
        } else {
          console.log("Data not found");
        }
      } catch (error) {
        console.log("Failed to fetch data", error);
      }
    };

    fetchData();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      {smartCareData ? (
        <section className="py-10 px-4 sm:px-6 lg:px-16 bg-white rounded-lg shadow-md">
          <div className="max-w-4xl mx-auto space-y-6 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2E4168] md:gap-4">
              {smartCareData.title}
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-[#2E4168] leading-relaxed font-medium">
              {smartCareData.description1}
            </p>

            <p className="text-sm sm:text-base md:text-lg text-[#2E4168] leading-relaxed font-medium">
              {smartCareData.description2}
            </p>
          </div>
        </section>
      ) : (
        <p className="text-center text-gray-500 mt-10">No data found</p>
      )}
    </div>
  );
};

export default HospitalOverview;
