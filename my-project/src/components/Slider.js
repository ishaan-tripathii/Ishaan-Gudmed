import React, { useState, useEffect, useRef } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import "animate.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import { socket } from "../socket";

const Slider = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const carouselRef = useRef();
  const [isMobile, setIsMobile] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const intervalRef = useRef(null);

  // Fetch slides from the backend
  const fetchSlides = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/pages");
      setSlides(response.data);
    } catch (error) {
      console.error("Error fetching slides:", error);
    }
  };

  // Setup slide fetching and real-time updates
  useEffect(() => {
    fetchSlides();
    socket.on("contentUpdated", fetchSlides);
    return () => socket.off("contentUpdated");
  }, []);

  // Handle screen size changes
  useEffect(() => {
    const updateScreenSize = () => setIsMobile(window.innerWidth < 768);
    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  // Auto-slide logic
  useEffect(() => {
    const startAutoSlide = () => {
      intervalRef.current = setInterval(() => {
        if (!isClicked) {
          carouselRef.current?.slideNext();
        }
      }, 5000);
    };
    startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, [isClicked]);

  // Handle manual interaction
  const handleClick = () => {
    setIsClicked(true);
    clearInterval(intervalRef.current);
  };

  const handleMouseUp = () => {
    setIsClicked(false);
    intervalRef.current = setInterval(() => {
      if (!isClicked) {
        carouselRef.current?.slideNext();
      }
    }, 5000);
  };

  const handleNext = () => carouselRef.current?.slideNext();
  const handlePrev = () => carouselRef.current?.slidePrev();

  // Carousel settings
  const carouselSettings = {
    autoPlay: false,
    infinite: true,
    disableButtonsControls: true,
    disableDotsControls: true,
    onSlideChanged: (e) => setCurrentSlideIndex(e.item),
    responsive: {
      0: { items: 1 },
      768: { items: 1 },
      1024: { items: 1 },
    },
  };

  // Render title with gradient for specified words
  const renderTitle = (title, gradientWords, gradientClass) => {
    const lines = (title || "").split("\n"); // Split by line breaks first
    const gradientWordsLower = (gradientWords || []).map((word) =>
      word.toLowerCase().trim()
    );

    // Flatten lines into words, splitting by spaces within each line
    const allWords = lines.flatMap((line) => line.trim().split(" ").filter(Boolean));

    return allWords.map((word, index) => {
      const cleanWord = word.toLowerCase().trim().replace(/[.,!?]/g, ""); // Normalize word
      const isGradientWord = gradientWordsLower.some(
        (gradientWord) => cleanWord === gradientWord
      );
      return (
        <span
          key={index}
          className={isGradientWord ? `text-transparent bg-clip-text ${gradientClass}` : ""}
        >
          {word}{" "}
        </span>
      );
    });
  };

  // Render formatted title with line breaks
  const renderFormattedTitle = (title, gradientWords, gradientClass) => {
    const safeTitle = title || ""; // Default to empty string if undefined
    if (isMobile) {
      return safeTitle
        .split(/<br\s*\/?>/)
        .map((chunk, index) => (
          <React.Fragment key={index}>
            {renderTitle(chunk, gradientWords, gradientClass)}
            {index < safeTitle.split(/<br\s*\/?>/).length - 1 && <br />}
          </React.Fragment>
        ));
    }
    return safeTitle
      .split(/<br\s*\/?>/)
      .map((chunk, index) => (
        <React.Fragment key={index}>
          {renderTitle(chunk, gradientWords, gradientClass)}
          {index < safeTitle.split(/<br\s*\/?>/).length - 1 && <br />}
        </React.Fragment>
      ));
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white">
      <div
        className="relative w-full px-6 sm:px-12 lg:px-24 py-4 sm:py-8 flex flex-col items-center sm:mt-6"
        onClick={handleClick}
        onMouseUp={handleMouseUp}
      >
        <div className="relative w-full">
          <AliceCarousel
            ref={carouselRef}
            {...carouselSettings}
            activeIndex={currentSlideIndex}
            items={slides.map((slide, index) => (
              <div
                key={index}
                className="text-container animate__animated animate__slideInRight animate__faster"
              >
                <h1
                  className={`text-gray-800 text-center font-bold leading-tight ${
                    (slide?.titleDesktop?.length || 0) > 100
                      ? "text-[1.5rem] sm:text-3xl lg:text-[4.6rem] md:text-2rem"
                      : (slide?.titleDesktop?.length || 0) > 60
                      ? "mt-10 md:mt-0 text-[1.6rem] sm:text-4xl lg:text-7xl"
                      : "text-5xl sm:text-5xl lg:text-8xl ipad-pro:text-[3rem] fold:text-[2rem] ipad-pro:leading-snug fold:leading-snug"
                  }`}
                >
                  {renderFormattedTitle(
                    isMobile ? slide?.titleMobile : slide?.titleDesktop,
                    slide?.gradientWords,
                    slide?.gradient || "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
                  )}
                </h1>
                {slide?.benefits && slide.benefits.length > 0 && (
                  <ul className="mt-6 space-y-3 mx-auto sm:px-12">
                    {slide.benefits.map((benefit, i) => (
                      <li
                        key={i}
                        className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 text-center"
                      >
                        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text font-semibold">
                          {benefit?.heading || ""}
                        </span>{" "}
                        <span>{benefit?.description || ""}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          />
        </div>
        <button
          onClick={handlePrev}
          className="absolute left-4 sm:left-8 top-[15rem] md:top-1/2 transform -translate-y-1/2 bg-[#2E4168] w-12 h-12 sm:w-14 sm:h-14 rounded-full text-white hover:bg-customDark shadow-lg flex items-center justify-center transition-all duration-300 z-50"
        >
          <FaChevronLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 sm:right-8 top-[15rem] md:top-1/2 transform -translate-y-1/2 bg-[#2E4168] w-12 h-12 sm:w-14 sm:h-14 rounded-full text-white hover:bg-customDark shadow-lg flex items-center justify-center transition-all duration-300 z-50"
        >
          <FaChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Slider;