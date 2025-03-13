import React, { useState, useEffect } from "react";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import axios from "axios";
import io from "socket.io-client";
import { Toaster, toast } from "react-hot-toast";

const socket = io("http://localhost:5000");

const ImageSection = ({ title, beforeImage, afterImage }) => (
  <div className="w-full md:w-1/2 p-4 rounded-lg shadow-lg bg-white">
    <h2
      className="text-center text-xl md:text-2xl font-semibold mb-4 text-"
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

const ImageComparison = () => {
  const [imageComparison, setImageComparison] = useState({
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
  });
  const [loading, setLoading] = useState(true);

  const fetchImageComparison = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/image-comparison");
      setImageComparison({
        heading: response.data.heading || "Sample Prescription",
        description: response.data.description || "Move the slider left and right to see the magic!",
        sections: response.data.sections || imageComparison.sections,
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching image comparison data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImageComparison();
    socket.on("imageComparisonUpdated", () => {
      fetchImageComparison();
      toast.success("Image comparison updated in real-time!");
    });
    return () => socket.off("imageComparisonUpdated");
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

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
            beforeImage={section.beforeImage}
            afterImage={section.afterImage}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageComparison;