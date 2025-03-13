import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import CountUp from "react-countup";
import BreadImage from "../img/bread-bg.jpg";
import { Toaster, toast } from "react-hot-toast";

const socket = io("http://localhost:5000");

const CounterSection = () => {
  const [counter, setCounter] = useState({
    title: "Our Impact",
    items: [
      {
        icon: "http://localhost:5000/images/prescription.png",
        number: 2650627,
        label: "Prescriptions Served",
      },
      {
        icon: "http://localhost:5000/images/fa-file-prescription.jpg",
        number: 877645,
        label: "Hindi Prescriptions Served",
      },
      {
        icon: "http://localhost:5000/images/doctor-image.jpg",
        number: 3850,
        label: "Doctors With Us",
      },
      {
        icon: "http://localhost:5000/images/patient-image.jpg",
        number: 180000,
        label: "Happy Patients",
      },
    ],
  });
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  const fetchCounter = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/counter");
      setCounter({
        title: response.data.title || "Our Impact",
        items: response.data.items || counter.items,
      });
      setIsVisible(false); // Reset visibility to re-trigger animation on update
      setLoading(false);
    } catch (err) {
      console.error("Error fetching counter data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounter();
    socket.on("counterUpdated", () => {
      fetchCounter();
      toast.success("Counter updated in real-time!");
    });
    return () => socket.off("counterUpdated");
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        console.log("Intersection:", entry.isIntersecting); // Debug visibility
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false); // Reset when out of view to allow re-trigger
        }
      },
      { threshold: 0.1, rootMargin: "0px" } // Trigger when 10% is visible
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    setIsVisible(false); // Reset to trigger animation
    setTimeout(() => setIsVisible(true), 100); // Small delay to restart animation
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div
      ref={sectionRef}
      className="relative py-12 md:py-16 lg:py-24 min-h-[400px]" // Ensure enough height
      onMouseEnter={handleMouseEnter} // Trigger animation on hover
    >
      <Toaster position="top-right" reverseOrder={false} />
      {/* Background Image Layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${BreadImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      {/* Background Color Layer */}
      <div className="absolute inset-0 bg-[#2E4168] opacity-80"></div>
      {/* Content Layer */}
      <div className="relative z-10 container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 text-center text-white">
        {counter.items.map((stat, index) => (
          <div key={index} className="group">
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto flex items-center justify-center rounded-full bg-[#2E4168] group-hover:bg-white border-2 border-transparent border-white group-hover:border-customBlue transition-all duration-300">
              <div className="text-white group-hover:text-[#2E4168] group-hover:bg-transparent hover:text-white">
                <img src={stat.icon} alt={`${stat.label} Icon`} className="w-10 h-10" />
              </div>
            </div>
            <div className="text-4xl md:text-5xl font-bold mt-4">
              {isVisible ? (
                <CountUp
                  start={0}
                  end={stat.number}
                  duration={5}
                  separator=","
                  redraw={true}
                  key={`${stat.number}-${isVisible}`} // Unique key to force re-render
                />
              ) : (
                "0"
              )}
            </div>
            <p className="text-base md:text-lg mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CounterSection;