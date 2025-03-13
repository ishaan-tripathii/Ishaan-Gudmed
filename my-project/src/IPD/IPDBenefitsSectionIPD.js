// IPDBenefitsSectionIPD.js
import React from 'react';
import { FaHeartbeat, FaPrescriptionBottle, FaCalendarCheck, FaHeadset } from 'react-icons/fa';
import BenefitItemIPD from './BenefitItemIPD';

const ipdBenefits = [
    {
        icon: <FaHeartbeat size={30} />,
        title: "Quick and Efficient Discharge Process",
        description: "Patients can receive their discharge summary within 10 minutes, allowing them to leave the hospital promptly with all necessary information.",
        image: require('../../src/img/IPD_discharge.png'), // Replace with actual image path
    },
    {
        icon: <FaPrescriptionBottle size={30} />,
        title: "Comprehensive Medication Instructions",
        description: "Clear and detailed instructions on medication usage, ensuring patients understand their treatment plan.",
       image: require('../img/IPD_Comp.png'), // Replace with actual image path
    },
    {
        icon: <FaCalendarCheck size={30} />,
        title: "Personalized Follow-Up Appointment Scheduling",
        description: "Schedule follow-up appointments at the time of discharge for continuous care.",
        image: require('../img/IPD_Per.png'), // Replace with actual image path
    },
    {
        icon: <FaHeadset size={30} />,
        title: "24/7 Support for Post-Discharge Queries",
        description: "Our support team is available around the clock to answer any questions after discharge.",
        image: require('../img/IPD_Sup.png'), // Replace with actual image path
    },
];

const IPDBenefitsSectionIPD = () => {
    return (
        <section className="bg-gray-100 p-6 rounded-lg mb-8">
            <h2 className="text-4xl font-semibold mb-8 mt-6 text-center text-[#2E4168]">Benefits of Our IPD Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
                {ipdBenefits.map((benefit, index) => (
                    <BenefitItemIPD
                        key={index}
                        icon={benefit.icon}
                        title={benefit.title}
                        description={benefit.description}
                        image={benefit.image}
                    />
                ))}
            </div>
        </section>
    );
};

export default IPDBenefitsSectionIPD;
