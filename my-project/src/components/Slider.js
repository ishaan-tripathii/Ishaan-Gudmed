import React, { useState, useEffect, useRef } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import "animate.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import io from "socket.io-client";
import axios from "axios";
import config from "../config/config";

// API and Socket.IO configuration
const API_BASE_URL = config.apiBaseUrl;
const socket = io(config.socketBaseUrl, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const Slider = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const carouselRef = useRef();
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchSliderPages = async () => {
      try {
        const response = await api.get("/pages");
        setData(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load slider pages");
        setLoading(false);
      }
    };

    fetchSliderPages();

    // Real-time updates with Socket.IO
    socket.on("connect", () => console.log("Slider connected to socket:", socket.id));
    socket.on("pageCreated", (newPage) => {
      console.log("Socket pageCreated received:", newPage);
      setData((prev) => [...prev, newPage]);
    });

    socket.on("pageUpdated", (updatedPage) => {
      console.log("Socket pageUpdated received:", updatedPage);
      setData((prev) =>
        prev.map((page) => (page._id === updatedPage._id ? updatedPage : page))
      );
    });

    socket.on("pageDeleted", (slug) => {
      console.log("Socket pageDeleted received:", slug);
      setData((prev) => prev.filter((page) => page.slug !== slug));
    });

    socket.on("disconnect", () => console.log("Slider disconnected from socket"));
    socket.on("connect_error", (error) => console.error("Socket connect error:", error.message));
    socket.on("error", (error) => console.error("Socket error:", error.message));

    return () => {
      socket.off("connect");
      socket.off("pageCreated");
      socket.off("pageUpdated");
      socket.off("pageDeleted");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("error");
      socket.disconnect();
    };
  }, []); // No state dependencies to avoid re-render loops

  useEffect(() => {
    const updateScreenSize = () => setIsMobile(window.innerWidth < 768);
    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  useEffect(() => {
    const startAutoSlide = () => {
      intervalRef.current = setInterval(() => {
        if (!isClicked && data.length > 1) {
          carouselRef.current?.slideNext();
        }
      }, 5000);
    };
    startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, [isClicked, data.length]);

  const handleClick = () => {
    setIsClicked(true);
    clearInterval(intervalRef.current);
  };

  const handleMouseUp = () => {
    setIsClicked(false);
    intervalRef.current = setInterval(() => {
      if (!isClicked && data.length > 1) {
        carouselRef.current?.slideNext();
      }
    }, 5000);
  };

  const handleNext = () => carouselRef.current?.slideNext();
  const handlePrev = () => carouselRef.current?.slidePrev();

  const carouselSettings = {
    autoPlay: false,
    infinite: data.length > 1,
    disableButtonsControls: true,
    disableDotsControls: true,
    onSlideChanged: (e) => setCurrentSlideIndex(e.item),
    responsive: {
      0: { items: 1 },
      768: { items: 1 },
      1024: { items: 1 },
    },
  };

  const renderTitle = (title, gradientWords, gradientClass) => {
    if (!title) return null;
    const lines = title.split("\n");
    const gradientWordsLower = (gradientWords || []).map((word) =>
      word.toLowerCase().trim()
    );

    const allWords = lines.flatMap((line) => line.trim().split(" ").filter(Boolean));

    return allWords.map((word, index) => {
      const cleanWord = word.toLowerCase().trim().replace(/[.,!?]/g, "");
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

  const renderFormattedTitle = (title, gradientWords, gradientClass) => {
    if (!title) return null;
    const safeTitle = title;
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px] bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[400px] bg-white">
        <p className="text-red-500 text-lg">Error loading slider: {error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-[400px] bg-white">
        <p className="text-gray-500 text-lg">No slider content available.</p>
      </div>
    );
  }

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
            items={data.map((slide, index) => (
              <div
                key={index}
                className="text-container animate__animated animate__slideInRight animate__faster"
              >
                <h1
                  className={`text-gray-800 text-center font-bold leading-tight ${(slide?.titleDesktop?.length || 0) > 100
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
        {data.length > 1 && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Slider;