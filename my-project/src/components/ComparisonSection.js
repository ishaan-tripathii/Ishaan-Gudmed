import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import {
  DocumentDuplicateIcon,
  DocumentTextIcon,
  MagnifyingGlassCircleIcon,
  ChartBarIcon,
  LinkIcon,
  ClipboardDocumentCheckIcon,
  BellAlertIcon,
  ShieldCheckIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import config from "../config/config";
const iconMap = {
  DocumentDuplicateIcon,
  DocumentTextIcon,
  MagnifyingGlassCircleIcon,
  ChartBarIcon,
  LinkIcon,
  ClipboardDocumentCheckIcon,
  BellAlertIcon,
  ShieldCheckIcon,
  LockClosedIcon,
};

const ComparisonSection = () => {
  const [data, setData] = useState({ title: "GudMed vs Other Technologies", items: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = io(config.socketBaseUrl, {
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/api/comparison`);
        setData({
          title: response.data.title || "GudMed vs Other Technologies",
          items: response.data.items || [],
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching comparison data:", err);
        setLoading(false);
      }
    };

    fetchData();

    socket.on("connect", () => {
      console.log("ComparisonSection (Hook) Socket.IO connected:", socket.id);
    });

    socket.on("comparison_created", (newData) => {
      console.log("Received comparison_created:", newData);
      setData({
        title: newData.title || "GudMed vs Other Technologies",
        items: newData.items || [],
      });
    });

    socket.on("comparison_updated", (updatedData) => {
      console.log("Received comparison_updated:", updatedData);
      setData({
        title: updatedData.title || "GudMed vs Other Technologies",
        items: updatedData.items || [],
      });
    });

    socket.on("connect_error", (err) => {
      console.error("ComparisonSection (Hook) Socket.IO connection error:", err.message);
    });

    return () => {
      socket.off("connect");
      socket.off("comparison_created");
      socket.off("comparison_updated");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <section className="bg-white py-0 sm:px-6 lg:px-8 px-1">
      <h1 className="text-center text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#2E4168] leading-snug sm:leading-normal mt-6 mb-8 space-x-4">
        {data.title.split("vs").map((part, index) => (
          <span
            key={index}
            className={`text-3xl sm:text-4xl lg:text-4xl ${index === 0 ? "font-bold ml-2" : index === 1 ? "ml-4" : ""} text-[#2E4168]`}
          >
            {part}
            {index === 0 ? "vs" : ""}
          </span>
        ))}
      </h1>

      <div className="overflow-hidden shadow-lg rounded-lg">
        <div className="overflow-x-hidden w-full">
          <table className="table-auto min-w-full bg-white rounded-lg text-sm sm:text-base">
            <thead className="bg-[#2E4168] text-white">
              <tr>
                <th className="border border-[#414c61] px-2 sm:px-4 py-2 sm:py-3 text-left font-bold">Aspect</th>
                <th className="border border-[#414c61] px-2 sm:px-4 py-2 sm:py-3 text-left font-medium">Other Technologies</th>
                <th className="border border-[#414c61] px-2 sm:px-4 py-2 sm:py-3 text-left font-bold text-2xl mx-auto">GudMed</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => {
                const OtherIcon = iconMap[item.other.icon] || DocumentDuplicateIcon;
                const GudmedIcon = iconMap[item.gudmed.icon] || DocumentTextIcon;
                return (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition-transform duration-300`}
                  >
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-4 text-blue-900 font-bold">{item.aspect}</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-4 text-gray-600">
                      <OtherIcon className="h-6 w-6 text-red-500 inline-block mr-2" />
                      {item.other.text}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-4 text-[#2E4168] font-bold">
                      <GudmedIcon className="h-6 w-6 text-green-500 inline-block mr-2" />
                      {item.gudmed.text}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;