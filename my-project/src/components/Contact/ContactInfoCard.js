import React from 'react';

const ContactInfoCard = ({ icon, title, content }) => (
    <div className="bg-white shadow-lg rounded-lg p-6 text-center transform transition-transform hover:scale-105">
        <div className="text-[#2E4168] text-4xl mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-[#2E4168]">{title}</h3>
        <p className="text-[#2E4168] mt-2">{content}</p>
    </div>
);

export default ContactInfoCard;
