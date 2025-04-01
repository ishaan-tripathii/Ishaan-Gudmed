import React from 'react';
import { FaCheckCircle, FaClipboardList, FaSyncAlt, FaUserCheck, FaChartLine, FaLock } from 'react-icons/fa';

const benefits = [
    {
        icon: <FaCheckCircle size={30} className="text-blue-600" />,
        title: "Efficient Workflow",
        description: "Automates the prescription process from writing to fulfillment."
    },
    {
        icon: <FaClipboardList size={30} className="text-blue-600" />,
        title: "Accurate Data Capture",
        description: "Minimizes errors in translating handwritten prescriptions."
    },
    {
        icon: <FaSyncAlt size={30} className="text-blue-600" />,
        title: "Seamless System Integration",
        description: "Instantly shares prescriptions with pharmacies and labs, streamlining the fulfillment process."
    },
    {
        icon: <FaUserCheck size={30} className="text-blue-600" />,
        title: "Patient Engagement",
        description: "Patients receive digital copies of prescriptions with reminders, enhancing their care experience."
    },
    {
        icon: <FaChartLine size={30} className="text-blue-600" />,
        title: "Increased Revenue",
        description: "Real-time integration with pharmacies and labs boosts sales and operational efficiency."
    },
    {
        icon: <FaLock size={30} className="text-blue-600" />,
        title: "Secure Data Handling",
        description: "Ensures that patient data and prescriptions are stored securely and accessed only by authorized users."
    }
];

const BenefitsOPD = () => (
    <section className="bg-gray-50 p-6 rounded-lg shadow-md mb-8 ">
        <h2 className="text-2xl font-semibold text-center mb-8 text-[#2E4168]">Benefits of OPD Prescription Digitization with GudMed</h2>
        
        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
                    <div className="mr-4">
                        {benefit.icon}
                    </div>
                    <div >
                        <h3 className="text-lg font-bold text-[#2E4168]">{benefit.title}</h3>
                        <p className="text-gray-600">{benefit.description}</p>
                    </div>
                </div>
            ))}
        </div>
        
        {/* Closing Statement */}
        <p className="text-center text-gray-700 mt-8">
            By digitizing the entire prescription process without requiring direct data entry from doctors, GudMed improves operational efficiency, enhances the patient experience, and supports better hospital workflows.
        </p>
    </section>
);

export default BenefitsOPD;