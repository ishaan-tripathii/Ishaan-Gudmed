import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHospital, FaUserMd, FaGlobe, FaAward, FaChartLine } from 'react-icons/fa';
import { MdHealthAndSafety, MdOutlineScience } from 'react-icons/md';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const iconMap = {
    'FaHospital': FaHospital,
    'FaUserMd': FaUserMd,
    'FaGlobe': FaGlobe,
    'FaAward': FaAward,
    'FaChartLine': FaChartLine,
    'MdHealthAndSafety': MdHealthAndSafety,
    'MdOutlineScience': MdOutlineScience,
};

function AchievementCard({ achievement, index, spanFull }) {
    return (
        <motion.div
            className={`flex flex-col items-start space-y-4 bg-white p-6 rounded-lg shadow-md ${spanFull ? "col-span-full" : ""}`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <div className="flex-shrink-0 bg-blue-50 p-4 rounded-full shadow-inner mx-auto sm:mx-0">
                {achievement.icon}
            </div>
            <h3 className="text-[1.4rem] sm:text-xl font-semibold text-[#2E4168] mb-4 text-center sm:text-left">
                {achievement.title}
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-base sm:text-base text-gray-600">
                {achievement.content.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>
        </motion.div>
    );
}

export default function Achievements() {
    const [achievementsData, setAchievementsData] = useState({
        title: '',
        description: '',
        cards: []
    });

    useEffect(() => {
        // Function to process achievement data
        const processAchievementData = (data) => {
            if (data) {
                const formattedCards = (data.cards || [])
                    .filter((achievement) => achievement.title && achievement.icon && achievement.description)
                    .map((achievement) => {
                        const IconComponent = iconMap[achievement.icon] || FaAward;
                        return {
                            title: achievement.title,
                            icon: <IconComponent className="w-12 h-12" style={{ color: achievement.iconColor || '#2563eb' }} />,
                            content: [achievement.description],
                        };
                    });
                setAchievementsData({
                    title: data.title || 'Our Achievements',
                    description: data.description || 'No description available.',
                    cards: formattedCards
                });
            } else {
                setAchievementsData({
                    title: 'Our Achievements',
                    description: 'No achievements data available.',
                    cards: []
                });
            }
        };

        // Initial fetch
        const fetchAchievements = () => {
            fetch('http://localhost:5000/api/ourachievements')
                .then((response) => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json();
                })
                .then((response) => {
                    if (response.success && response.data) {
                        processAchievementData(response.data);
                    } else {
                        processAchievementData(null);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching achievements:', error);
                    processAchievementData(null);
                });
        };

        fetchAchievements();

        // Socket listeners
        socket.on('ourAchievements_created', (data) => {
            processAchievementData(data);
        });

        socket.on('ourAchievements_updated', (data) => {
            processAchievementData(data);
        });

        socket.on('ourAchievements_deleted', () => {
            setAchievementsData({
                title: 'Our Achievements',
                description: 'Achievements data deleted.',
                cards: []
            });
        });

        // Cleanup
        return () => {
            socket.off('ourAchievements_created');
            socket.off('ourAchievements_updated');
            socket.off('ourAchievements_deleted');
        };
    }, []);

    return (
        <div className="min-h-screen bg-white py-20 px-0 sm:px-6 lg:px-0">
            <div className="max-w-7xl md:text-4xl text-3xl mx-auto">
                <motion.h1
                    className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center text-[#2E4168] mb-8"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {achievementsData.title}
                </motion.h1>
                <motion.div
                    className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-12"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <p className="text-base sm:text-lg text-center text-[#2E4168] mb-8 md:mx-4 lg:mx-16">
                        {achievementsData.description}
                    </p>
                    {achievementsData.cards.length === 0 ? (
                        <p className="text-center text-gray-600">No achievements to display yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                            {achievementsData.cards.map((achievement, index) => (
                                <AchievementCard 
                                    key={index} 
                                    achievement={achievement} 
                                    index={index}
                                    spanFull={index === achievementsData.cards.length - 1 && achievementsData.cards.length % 3 === 1} 
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}