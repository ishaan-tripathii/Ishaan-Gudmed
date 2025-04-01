import React from 'react';

const BenefitItemIPD = ({ icon, title, description, image }) => {
  return (
    <div className="bg-white shadow rounded-lg mb-6 transform transition-transform duration-300  hover:shadow-xl">
      {/* Image Section - Full width on mobile */}
      {image ? (
        <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover rounded-t-lg"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-lg rounded-t-lg">
          <span>No Image Available</span>
        </div>
      )}

      {/* Content Section */}
      <div className="p-4 flex flex-col items-start space-y-3">
        {/* Icon Section */}
        {/* {icon && (
          <div className="text-blue-600 text-3xl mb-2">
            {icon}
          </div>
        )} */}

        {/* Text Content */}
        <h3 className="text-xl font-semibold text-[#2E4168] leading-tight">
          {title}
        </h3>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default BenefitItemIPD;
