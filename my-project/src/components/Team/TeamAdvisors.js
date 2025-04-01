// TeamAdvisors.js
import React from 'react';

const advisors = [
    "Dr. Anurag Agarwal (Director, NHS UK)",
    "Prof Mc Mishra (Ex Director AIIMS)",
    "Dr. Swati Singh (Co-Founder and Sr. Oncologist, Delhi)",
    "Prof Umesh (IIT Madras)",
    "Mukesh Agarwal (CEO, Information Horizon USA)",
    "Mr. S Dhingra (MD, Binary Global Ltd.)"
];

const TeamAdvisors = () => (
    <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-10">
        <h3 className="text-2xl font-semibold text-center text-[#2E4168] mb-4">Team of Advisors</h3>
        <ul className="list-disc list-inside text-[#2E4168] space-y-2">
            {advisors.map((advisor, index) => (
                <li key={index}>{advisor}</li>
            ))}
        </ul>
    </div>
);

export default TeamAdvisors;
