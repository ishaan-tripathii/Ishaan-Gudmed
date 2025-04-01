// DoctorsGrid.js
import React from 'react';

const doctors = [
    {
        image: require('../../img/Dr-Anurag-Agarwal_edited_edited (1).png'),
        name: "Dr. Anurag Agarwal",
        title: "Senior Consultant, NHS, UK",
        description: "Dr. Agarwal has been involved in the evolution of primary health services in the UK with extensive knowledge of healthcare delivery challenges."
    },
    {
        image: require('../../img/Dr-Ved-Prakash.png'),
        name: "Dr. Ved Prakash",
        title: "Ex-Director, AIIMS, New Delhi",
        description: "Neurosurgeon with over 40 years in healthcare. Ex-Deputy Director of Medical Services, Indian Army."
    },
    {
        image: require('../../img/Dr-Swati-Singh.png'),
        name: "Dr. Swati Singh",
        title: "Consultant Onco-Surgeon",
        description: "Multi-Gold Medalist from LHMC, Delhi, with specialization in Onco-surgery and healthcare process improvement."
    },
    {
        image: require('../../img/MC-Misra.png'),
        name: "Prof. MC Misra",
        title: "Ex-Director, AIIMS, New Delhi",
        description: "With over 40 years at AIIMS, he led the transformation and digitization efforts at AIIMS, Delhi."
    },
    {
        image: require('../../img/Dr manish pant.jpg'),
        name: "Dr. Manish Pant",
        title: "Chief, Health and Governance, UNDP, India",
        description: "Preventive & Social Medicine specialist, ex-WHO advisor, and creator of the COWIN platform for immunization and COVID vaccination."
    }
];

const DoctorsGrid = () => {
    return (
        <div className="w-full mt-16 px-4">
            <h2 className="md:text-3xl text-[1.8rem] font-semibold md:text-center mt-10 mb-8 text-[#2E4168]">Our Advisory Board</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctors.map((doctor, index) => (
                    <div key={index} className="bg-white p-3 rounded-md shadow-md group hover:shadow-lg transition duration-300 ease-in-out">
                        <div className="w-full h-32 flex justify-center items-center mb-3">
                            <img
                                src={doctor.image}
                                alt={doctor.name}
                                className="w-full h-full object-contain rounded-md"
                            />
                        </div>
                        <h3 className="text-base font-semibold text-gray-800 mb-1">{doctor.name}</h3>
                        <p className="text-sm text-gray-600 font-medium">{doctor.title}</p>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{doctor.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DoctorsGrid;
