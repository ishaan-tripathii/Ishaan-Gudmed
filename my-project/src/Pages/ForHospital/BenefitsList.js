import React, { useState, useEffect } from 'react';
import { FaBrain, FaHeartbeat, FaCheckCircle } from 'react-icons/fa';
import axios from "axios";
import io from "socket.io-client";
import config from "../../config/config";
import Camera from '../../img/Tred_Soft.jpeg';

const benefits = [
    "Instant Access to Patient Data",
    "Improved Patient Care Continuity",
    "Enhanced Data Security",
    "Save Space and Reduce Costs",
    "Compliance and Reporting",
];

const iconMap = {
    brain: FaBrain,
    heartbeat: FaHeartbeat,
};

const BenefitsList = () => {
    const [benefitsData, setBenefitsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const socket = io(config.socketBaseUrl, {
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            transports: ["websocket", "polling"],
            withCredentials: true,
        });

        const fetchData = async () => {
            try {
                console.log("Fetching data from:", `${config.apiBaseUrl}/api/mrd`);
                const response = await axios.get(`${config.apiBaseUrl}/api/mrd`);
                console.log("API Response:", response.data);
                if (response.data.success && response.data.data && response.data.data.length > 0) {
                    setBenefitsData(response.data.data[0]);
                } else {
                    console.log("No valid data found in response");
                    setError("No data available");
                }
            } catch (error) {
                console.error("Fetch error:", error.message, error.response?.data);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        socket.on("connect", () => console.log("Socket connected"));
        socket.on("mrd_create", (data) => { // Updated to match endpoint
            console.log("Socket mrd_create:", data);
            setBenefitsData(data[0]);
        });
        socket.on("mrd_update", (data) => { // Updated to match endpoint
            console.log("Socket mrd_update:", data);
            setBenefitsData(data[0]);
        });
        socket.on("mrd_delete", () => { // Updated to match endpoint
            console.log("Socket mrd_delete");
            setBenefitsData(null);
        });
        socket.on("connect_error", (err) => console.error("Socket error:", err.message));

        return () => socket.disconnect();
    }, []);

    const renderIcon = (iconName) => {
        const IconComponent = iconMap[iconName] || FaCheckCircle;
        return <IconComponent className="text-[#2E4168] mr-3" size={22} />;
    };

    if (loading) {
        return <p className="text-center">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">Error: {error}</p>;
    }

    return (
        <section className="py-12 px-6 sm:px-10 bg-gray-50 rounded-lg shadow-md">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-10">
                <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
                    <img
                        src={benefitsData?.image || Camera}
                        alt="Digital Transformation for Hospitals"
                        className="w-4/5 sm:w-3/4 lg:w-full max-w-md object-cover rounded-lg shadow-lg transition-transform transform hover:scale-105"
                    />
                </div>
                <div className="w-full lg:w-1/2 space-y-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#2E4168] text-center lg:text-left">
                        {benefitsData?.heading || "Default Heading"}
                    </h3>
                    <p className="text-sm sm:text-base lg:text-lg text-[#2E4168] leading-relaxed">
                        {benefitsData?.description || "Default description goes here."}
                    </p>
                    <ul className="space-y-4">
                        {(benefitsData?.features || benefits).map((benefit, index) => (
                            <li key={index} className="flex items-center">
                                {benefitsData?.features ? (
                                    renderIcon(benefit.icon)
                                ) : (
                                    <FaCheckCircle className="text-[#2E4168] mr-3" size={22} />
                                )}
                                <span className="text-[#2E4168] font-medium text-sm sm:text-base lg:text-lg">
                                    {benefitsData?.features ? benefit.content : benefit}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default BenefitsList;