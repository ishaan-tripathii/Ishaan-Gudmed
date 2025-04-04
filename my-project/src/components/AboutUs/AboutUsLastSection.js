import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import config from "../../config/config"; // Adjust path as needed
const socket = io('http://localhost:5000');

const AboutUsLastSectionDisplay = () => {
  const [sectionData, setSectionData] = useState(null);

  useEffect(() => {
    const socket = io(config.socketBaseUrl, {
      autoConnect: true,
      reconnection: true,
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    // Initial fetch (optional, if API is accessible to frontend)
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/api/thirdsection`);
        const data = await response.json();
        if (data.success) setSectionData(data.data);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };
    fetchData();

    // Real-time listeners
    socket.on("third_section_created", (data) => {
      setSectionData(data);
    });

    socket.on("third_section_updated", (data) => {
      setSectionData(data);
    });

    socket.on("third_section_deleted", () => {
      setSectionData(null);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-4">
      {sectionData ? (
        <>
          <h2 className="text-xl font-bold">{sectionData.heading}</h2>
          <p>{sectionData.description}</p>
        </>
      ) : (
        <p>No content available.</p>
      )}
    </div>
  );
};

export default AboutUsLastSectionDisplay;