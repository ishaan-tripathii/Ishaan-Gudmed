// OurClient.jsx
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { socket } from "../socket";
import api from "../utils/api";

const ClientLogo = ({ src, alt }) => (
  <div className="flex justify-center items-center mx-auto w-32 h-32 lg:w-40 lg:h-40">
    <img src={src} alt={alt} className="object-contain w-full h-full" />
  </div>
);

const OurClient = () => {
  const [settings, setSettings] = useState({
    clients: [],
    swiperSettings: {
      slidesPerView: { default: 4, breakpoints: { 1200: 4, 1024: 3, 768: 3, 480: 2, 320: 2 } },
      slidesPerGroup: { default: 4, breakpoints: { 1200: 4, 1024: 3, 768: 3, 480: 2, 320: 2 } },
    },
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await api.get("/api/clients");
      console.log("Fetched client settings:", response.data);
      setSettings(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching client settings:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    socket.on("connect", () => {
      console.log("Client: Connected to Socket.IO server");
    });

    socket.on("clientSettingsUpdated", (eventData) => {
      console.log("Client: Received clientSettingsUpdated event:", eventData);
      const updatedSettings = eventData?.data;
      if (updatedSettings && updatedSettings.clients && updatedSettings.swiperSettings) {
        setSettings(updatedSettings);
        console.log("Client: Settings updated successfully");
      } else {
        console.error("Client: Invalid data structure received:", eventData);
        fetchSettings();
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Client: Socket.IO connection error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("Client: Socket.IO disconnected:", reason);
    });

    return () => {
      socket.off("clientSettingsUpdated");
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
    };
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  const swiperBreakpoints = {
    1200: {
      slidesPerView: settings.swiperSettings.slidesPerView.breakpoints[1200],
      slidesPerGroup: settings.swiperSettings.slidesPerGroup.breakpoints[1200],
    },
    1024: {
      slidesPerView: settings.swiperSettings.slidesPerView.breakpoints[1024],
      slidesPerGroup: settings.swiperSettings.slidesPerGroup.breakpoints[1024],
    },
    768: {
      slidesPerView: settings.swiperSettings.slidesPerView.breakpoints[768],
      slidesPerGroup: settings.swiperSettings.slidesPerGroup.breakpoints[768],
    },
    480: {
      slidesPerView: settings.swiperSettings.slidesPerView.breakpoints[480],
      slidesPerGroup: settings.swiperSettings.slidesPerGroup.breakpoints[480],
    },
    320: {
      slidesPerView: settings.swiperSettings.slidesPerView.breakpoints[320],
      slidesPerGroup: settings.swiperSettings.slidesPerGroup.breakpoints[320],
    },
  };

  return (
    <div className="bg-white py-10">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-semibold tracking-wide mb-4 space-x-4">
          <span className="text-[#2E4168] mr-2">Our</span>
          <span className="text-[#2E4168]">Clientele</span>
        </h2>
      </div>
      <div className="w-11/12 mx-auto">
        <Swiper
          spaceBetween={14}
          slidesPerView={settings.swiperSettings.slidesPerView.default}
          slidesPerGroup={settings.swiperSettings.slidesPerGroup.default}
          modules={[Autoplay]}
          autoplay={{ delay: 0, disableOnInteraction: false }}
          speed={5000}
          loop={true}
          breakpoints={swiperBreakpoints}
        >
          {settings.clients.concat(settings.clients).map((client, index) => (
            <SwiperSlide key={index}>
              <ClientLogo src={client.src} alt={client.alt} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default OurClient;