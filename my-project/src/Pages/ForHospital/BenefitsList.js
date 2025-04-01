import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import Camera from '../../img/Tred_Soft.jpeg'; // Corrected the image extension

const benefits = [
    "Instant Access to Patient Data",
    "Improved Patient Care Continuity",
    "Enhanced Data Security",
    "Save Space and Reduce Costs",
    "Compliance and Reporting",
];

const BenefitsList = () => {
    return (
        <section className="py-12 px-6 sm:px-10 bg-gray-50 rounded-lg shadow-md">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-10">
                {/* Image Section */}
                <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
                    <img
                        src={Camera}
                        alt="Digital Transformation for Hospitals"
                        className="w-4/5 sm:w-3/4 lg:w-full max-w-md object-cover rounded-lg shadow-lg transition-transform transform hover:scale-105"
                    />
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-1/2 space-y-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#2E4168] text-center lg:text-left">
                        Stop Storing Data in Archived MRD Files—Go Digital with GudMed
                    </h3>
                    <p className="text-sm sm:text-base lg:text-lg text-[#2E4168] leading-relaxed">
                    Many hospitals still rely on physical Medical Record Departments (MRDs) to store patient data for years, often in overcrowded, paper-based archives. This method is not only inefficient but also prone to errors, loss, and difficulties in retrieval. With GudMed, you can put an end to these storage challenges by digitizing all patient records.
                    </p>
                    <ul className="space-y-4">
                        {benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center">
                                <FaCheckCircle className="text-[#2E4168] mr-3" size={22} />
                                <span className="text-[#2E4168] font-medium text-sm sm:text-base lg:text-lg">
                                    {benefit}
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
