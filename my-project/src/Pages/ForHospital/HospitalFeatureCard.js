// HospitalFeatureCard.js
import React from 'react';

const HospitalFeatureCard = ({ imageSrc, title, description, features }) => {
    return (
        <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden transition-transform transform  hover:shadow-xl my-6">
            <div className="flex flex-col lg:flex-row">
                {/* Image Frame */}
                <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center md:mt-10 ">
                    <img
                        src={imageSrc}
                        alt={title}
                        className="object-cover w-full h-68 lg:h-full rounded-lg lg:rounded-none transition-transform transform "
                    />
                </div>

                {/* Text Content Frame */}
                <div className="w-full lg:w-1/2 p-8 lg:p-10 flex flex-col justify-start bg-gray-50 ">
                    <h3 className="text-[1.4rem] font-semibold text-[#2E4168] mb-4  -md:mt-28 mt-0 md:text-4xl ">{title}</h3>
                    <p className="text-gray-700 mb-6">{description}</p>
                    <h2 className="text-2xl md:text-3xl  font-semibold text-[#2E4168] mb-3">
  Key Features:
</h2>

                    <ul className="space-y-2">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-[#2E4168] mr-2">•</span>
                                <p className="text-gray-700">{feature}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default HospitalFeatureCard;