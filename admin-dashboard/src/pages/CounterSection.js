// src/components/CounterSection.jsx
import React, { useState, useEffect, useRef } from "react";
import useDynamicData from "../hooks/useDynamicData";
import CountUp from "react-countup";
import BreadImage from "../img/bread-bg.jpg";

const CounterSection = () => {
  const defaultData = { title: "Our Impact", items: [] };
  const { data, loading } = useDynamicData("/counter", defaultData, "counterUpdated");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const currentRef = sectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div ref={sectionRef} className="relative py-12 md:py-16 lg:py-24">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${BreadImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="absolute inset-0 bg-[#2E4168] opacity-80" />
      <div className="relative z-10 container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 text-center text-white">
        {data.items.map((stat, index) => (
          <div key={index} className="group">
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto flex items-center justify-center rounded-full bg-[#2E4168] group-hover:bg-white border-2 border-transparent border-white group-hover:border-customBlue transition-all duration-300">
              <div className="text-white group-hover:text-[#2E4168] group-hover:bg-transparent hover:text-white">
                <img src={stat.icon} alt={`${stat.label} Icon`} className="w-10 h-10" />
              </div>
            </div>
            <div className="text-4xl md:text-5xl font-bold mt-4">
              {isVisible ? <CountUp start={0} end={stat.number} duration={5} separator="," /> : "0"}
            </div>
            <p className="text-base md:text-lg mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CounterSection;