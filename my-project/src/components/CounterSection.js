import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { socket } from "../socket";
import api, { getImageUrl } from "../utils/api";
import CountUp from "react-countup";
import BreadImage from "../img/bread-bg.jpg";
import { Toaster, toast } from "react-hot-toast";

const CounterSection = () => {
  const [counters, setCounters] = useState([
    {
      title: "Prescriptions",
      count: 0,
      icon: getImageUrl("/images/prescription.png"),
    },
    {
      title: "Files",
      count: 0,
      icon: getImageUrl("/images/fa-file-prescription.jpg"),
    },
    {
      title: "Doctors",
      count: 0,
      icon: getImageUrl("/images/doctor-image.jpg"),
    },
    {
      title: "Patients",
      count: 0,
      icon: getImageUrl("/images/patient-image.jpg"),
    },
  ]);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/counter");
        // Transform the data structure to match our frontend expectations
        const transformedCounters = response.data.items.map(item => ({
          title: item.label,
          count: item.number,
          icon: item.icon || getImageUrl("/images/default-icon.png")
        }));
        setCounters(transformedCounters);
        setIsVisible(false); // Reset visibility to re-trigger animation on update
        setLoading(false);
      } catch (error) {
        console.error("Error fetching counter data:", error);
        setLoading(false);
      }
    };

    fetchData();

    socket.on("counterUpdate", (data) => {
      // Transform the data structure to match our frontend expectations
      const transformedCounters = data.items.map(item => ({
        title: item.label,
        count: item.number,
        icon: item.icon || getImageUrl("/images/default-icon.png")
      }));
      setCounters(transformedCounters);
      toast.success("Counter updated in real-time!");
    });

    return () => {
      socket.off("counterUpdate");
    };
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
        {counters.map((stat, index) => (
          <div key={index} className="group">
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto flex items-center justify-center rounded-full bg-[#2E4168] group-hover:bg-white border-2 border-transparent border-white group-hover:border-customBlue transition-all duration-300">
              <div className="text-white group-hover:text-[#2E4168] group-hover:bg-transparent hover:text-white">
                <img src={stat.icon} alt={`${stat.title} Icon`} className="w-10 h-10" />
              </div>
            </div>
            <div className="text-4xl md:text-5xl font-bold mt-4">
              {isVisible ? (
                <CountUp
                  start={0}
                  end={stat.count}
                  duration={5}
                  separator=","
                  redraw={true}
                  key={`${stat.count}-${isVisible}`} // Unique key to force re-render
                />
              ) : (
                "0"
              )}
            </div>
            <p className="text-base md:text-lg mt-2">{stat.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CounterSection;