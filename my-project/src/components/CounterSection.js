

// src/components/CounterSection.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import io from "socket.io-client";
import CountUp from "react-countup";
import BreadImage from "../img/bread-bg.jpg";
import { Toaster, toast } from "react-hot-toast";
import config from "../config/config";

const CounterSection = () => {
  const [counters, setCounters] = useState([
    {
      title: "Prescriptions",
      count: 0,
      icon: `${config.apiBaseUrl}/images/prescription.png`,
    },
    {
      title: "Files",
      count: 0,
      icon: `${config.apiBaseUrl}/images/fa-file-prescription.jpg`,
    },
    {
      title: "Doctors",
      count: 0,
      icon: `${config.apiBaseUrl}/images/doctor-image.jpg`,
    },
    {
      title: "Patients",
      count: 0,
      icon: `${config.apiBaseUrl}/images/patient-image.jpg`,
    },
  ]);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    const socket = io(config.socketBaseUrl, {
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
      path: "/socket.io",
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/api/counter`);
        const transformedCounters = response.data.items.map(item => ({
          title: item.label,
          count: item.number,
          icon: item.icon || `${config.apiBaseUrl}/images/default-icon.png`,
        }));
        setCounters(transformedCounters);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching counter data:", error);
        setLoading(false);
      }
    };

    fetchData();

    socket.on("counter_updated", (data) => {
      const transformedCounters = data.items.map(item => ({
        title: item.label,
        count: item.number,
        icon: item.icon || `${config.apiBaseUrl}/images/default-icon.png`,
      }));
      setCounters(transformedCounters);
      setIsVisible(false);
      setTimeout(() => setIsVisible(true), 100);
      toast.success("Counter updated in real-time!");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "0px" }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      socket.disconnect();
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div
      ref={sectionRef}
      className="relative py-12 md:py-16 lg:py-24 min-h-[400px]"
    >
      <Toaster position="top-right" reverseOrder={false} />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${BreadImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <div className="absolute inset-0 bg-[#2E4168] opacity-80"></div>
      <div className="relative z-10 container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 text-center text-white">
        {counters.map((stat, index) => (
          <div key={index} className="group">
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto flex items-center justify-center rounded-full bg-[#2E4168] group-hover:bg-white border-2 border-transparent border-white group-hover:border-customBlue transition-all duration-300">
              <img src={stat.icon} alt={`${stat.title} Icon`} className="w-10 h-10" />
            </div>
            <div className="text-4xl md:text-5xl font-bold mt-4">
              {isVisible ? (
                <CountUp start={0} end={stat.count} duration={5} separator="," />
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