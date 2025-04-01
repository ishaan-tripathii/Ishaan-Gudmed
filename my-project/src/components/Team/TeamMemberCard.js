import React from 'react';

const TeamMemberCard = ({ title, name, description }) => (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 group">
        {/* Decorative Border */}
        <div className="w-16 h-1 bg-[#2E4168] rounded-full mb-4 group-hover:scale-110 transition-transform duration-300"></div>
        
        {/* Name and Title */}
        <h3 className="text-2xl font-extrabold text-gray-800 group-hover:text-[#2E4168] transition-colors duration-300">
            {name}
        </h3>
        <p className="text-[#2E4168] font-medium italic mb-4">{title}</p>
        
        {/* Divider */}
        <hr className="border-t-2 border-[#2E4168] mb-4 group-hover:border-[#2E4168] transition-colors duration-300" />
        
        {/* Description */}
        <p className="text-gray-700 text-base leading-relaxed group-hover:text-[#2E4168] transition-colors duration-300">
            {description}
        </p>

        {/* Call-to-Action Button */}
       
    </div>
);

export default TeamMemberCard;
