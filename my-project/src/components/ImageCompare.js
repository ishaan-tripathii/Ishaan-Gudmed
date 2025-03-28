// src/components/ImageCompare.js
import React, { useState, useEffect } from "react";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import axios from "axios";
import io from "socket.io-client"; // Import Socket.IO client
import { Toaster, toast } from "react-hot-toast";
import config from "../config/config";

// Initialize Socket.IO client within the file
const socket = io(config.socketBaseUrl, {
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  autoConnect: true,
  transports: ["websocket", "polling"],
  withCredentials: true,
});

const ImageSection = ({ title, beforeImage, afterImage }) => (
  <div className="w-full md:w-1/2 p-4 rounded-lg shadow-lg bg-white">
    <h2
      className="text-center text-xl md:text-2xl font-semibold mb-4 text-[#2E4168]"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {title}
    </h2>
    <ReactCompareSlider
      itemOne={<ReactCompareSliderImage src={afterImage} alt="After" />}
      itemTwo={<ReactCompareSliderImage src={beforeImage} alt="Before" />}
      portrait={false}
      boundsPadding={0}
      position={50}
      changePositionOnHover={false}
      onlyHandleDraggable={false}
    />
  </div>
);

const ImageCompare = () => {
  const defaultData = {
    heading: "Sample Prescription",
    description: "Move the slider left and right to see the magic!",
    sections: [
      {
        title: "In English",
        beforeImage: "http://localhost:5000/images/compare-image.png",
        afterImage: "http://localhost:5000/images/compare-image-english.png",
      },
      {
        title: "हिन्दी में",
        beforeImage: "http://localhost:5000/images/compare-image.png",
        afterImage: "http://localhost:5000/images/compare-image-hindi.png",
      },
    ],
    updatedAt: null,
  };
  const [imageComparison, setImageComparison] = useState(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImageComparison = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/api/image-comparison`);
        setImageComparison({ ...response.data, updatedAt: response.data.updatedAt || Date.now() });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching image comparison data:", err);
        setLoading(false);
      }
    };

    fetchImageComparison();

    socket.on("connect", () => { });

    socket.on("imageComparison_created", (newData) => {
      setImageComparison({ ...newData, updatedAt: newData.updatedAt || Date.now() });
      toast.success("Image comparison created in real-time!");
    });

    socket.on("imageComparison_updated", (updatedData) => {
      setImageComparison({ ...updatedData, updatedAt: updatedData.updatedAt || Date.now() });
      toast.success("Image comparison updated in real-time!");
    });

    socket.on("connect_error", (err) => { });

    return () => {
      socket.off("connect");
      socket.off("imageComparison_created");
      socket.off("imageComparison_updated");
      socket.off("connect_error");
      // Do NOT disconnect the socket instance to keep it alive
    };
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  const timestamp = new Date(imageComparison.updatedAt).getTime();

  return (
    <div className="container mx-auto p-6 lg:p-12 bg-white rounded-lg shadow-md">
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className="text-center text-4xl md:text-4xl mt-0 mb-4 text-[#2E4168] font-semibold">
        {imageComparison.heading}
      </h1>
      <p className="text-center mb-6 text-lg md:text-2xl text-gray-700 font-medium font-sans">
        <span className="text-[#2E4168] font-semibold">Move the slider</span>{" "}
        {imageComparison.description}
      </p>
      <div className="flex flex-col text-3xl md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-10 text-[#2E4168]">
        {imageComparison.sections.map((section, index) => (
          <ImageSection
            key={index}
            title={section.title}
            beforeImage={`${section.beforeImage}?v=${timestamp}`}
            afterImage={`${section.afterImage}?v=${timestamp}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCompare;