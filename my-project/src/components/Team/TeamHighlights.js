// TeamHighlights.js
import React from 'react';

const highlights = [
    {
        title: "Renowned Oncologist",
        description: "Dr. Swati R Sawhney, Co-founder and Sr. Oncologist, brings invaluable expertise in oncology.",
    },
    {
        title: "Global Advisory Team",
        description: "Advisors from esteemed institutions like NHS UK, AIIMS, and IIT Madras.",
    },
    {
        title: "68+ Expert Professionals",
        description: "Our team includes engineers, data scientists, pharmacists, and doctors dedicated to healthcare innovation.",
    },
];

const TeamHighlights = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {highlights.map((highlight, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <h3 className="text-2xl font-semibold text-[#2E4168] mb-2">{highlight.title}</h3>
                <p className="text-[#2E4168]">{highlight.description}</p>
            </div>
        ))}
    </div>
);

export default TeamHighlights;
