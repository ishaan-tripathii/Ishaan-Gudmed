import React from 'react';

const FeatureItem = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center space-y-4 overflow-x-hidden">
      <div className="p-4 bg-gray-100 rounded-full">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureItem;
