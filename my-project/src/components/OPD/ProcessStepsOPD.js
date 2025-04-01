// src/Components/ProcessStepsOPD.js
import React from 'react';
import ImageSlider from './ImageSlider'; // Import the slider component

const steps = [
    {
        title: "Prescription Creation by the Doctor",
        description: "During an OPD consultation, the doctor writes the patient’s prescription on paper. This prescription usually includes medications, recommended lab tests, and other care instructions.",
        image: require('../../img/opdimg1.png'),
    },
    {
        title: "Real-Time Digitization",
        description: "The handwritten prescription is scanned or captured using GudMed’s technology. Our advanced AI tools analyze the scanned document, identifying the text, medical terms, and abbreviations used by the doctor. The AI ensures that the prescription is accurately digitized and ready for further processing.",
        image: require('../../img/opdimg2.png'),
    },
    {
        title: "Review and Validation",
        description: "After digitization, the prescription is reviewed to ensure all details are captured correctly. This step includes a validation process where errors or ambiguities in the scanned data are flagged and clarified, ensuring the prescription is actionable without delays or confusion.",
        image: require('../../img/opdimg3.png'),
    },
    {
        title: "Integration with Hospital Systems",
        description: "Once validated, the digitized prescription is integrated with the hospital’s Electronic Medical Record (EMR) system. This integration allows for seamless sharing of the prescription with the pharmacy, lab services, and other relevant departments, making it immediately accessible for fulfillment and processing",
        image: require('../../img/opdimg4.png'),
    },
    {
        title: "Patient Communication and Engagement",
        description: "The patient receives the digitized prescription directly on their phone via SMS or WhatsApp. This record includes the details of medications, dosage instructions, and any required lab tests. The patient can access the digital prescription easily and receive automated reminders for taking their medications or scheduling follow-up appointments.",
        image: require('../../img/opdimg5.png'),
    },
    {
        title: "Pharmacy Integration for Faster Fulfillment",
        description: "The digitized prescription is sent to the hospital’s pharmacy in real-time, allowing the pharmacy to prepare the required medications before the patient arrives. This reduces waiting times, improves pharmacy sales, and ensures that patients can quickly obtain their prescriptions after their consultation.",
        image: require('../../img/opdimg6.png'),
    },
    {
        title: "Lab Test Orders and Results",
        description: "For any lab tests prescribed in the digitized prescription, the order is automatically sent to the hospital’s lab. Patients can schedule their tests promptly, and once results are ready, they are attached to the patient’s profile and shared digitally, allowing both doctors and patients to review them without delay.",
        image: require('../../img/opdimg7.png'),
    },
    {
        title: "Secure Storage and Access",
        description: "All digitized prescriptions are securely stored in the patient’s medical record within the hospital’s EMR system. This allows doctors to easily access a patient’s prescription history during future visits, improving continuity of care and long-term treatment planning.",
        image: require('../../img/opdimg8.png'),
    },
];

const ProcessStepsOPD = () => (
    <section className="bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 rounded-lg shadow-md mb-8">
        {/* Slider Component */}
        {/* <ImageSlider /> */}

        {/* Steps Section */}
        <h2 className=" text-4xl md:text-5xl font-bold text-center text-[#2E4168] mb-10 ">
          How GudMed Technology is important
        </h2>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {steps.map((step, index) => (
                <div
                    key={index}
                    className="flex flex-col items-center bg-white shadow-lg rounded-xl overflow-hidden transform hover:scale-105 transition-transform duration-300"
                >
                    {/* Step Image */}
                    <div className="w-full h-48 bg-gradient-to-b from-blue-500 to-blue-300 flex items-center justify-center">
                        {step.image ? (
                            <img
                                src={step.image}
                                alt={step.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-white text-lg">Image</span>
                        )}
                    </div>

                    {/* Step Content */}
                    <div className="p-6">
                       
                        <h3 className="text-xl font-bold text-[#2E4168] mt-2 mb-4">
                            {step.title}
                        </h3>
                        <p className="text-gray-600">{step.description}</p>
                    </div>
                </div>
            ))}
        </div>
    </section>
);

export default ProcessStepsOPD;
