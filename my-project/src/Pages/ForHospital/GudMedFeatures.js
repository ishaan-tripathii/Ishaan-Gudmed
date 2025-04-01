import React from 'react';
import { FaPrescription, FaFolderOpen, FaBrain, FaFlask, FaUserCheck } from 'react-icons/fa';

const features = [
    {
        title: "Real-Time Prescription and Discharge Summary Digitization",
        description: (
            <>
                Forget manual data entry and long waiting times for discharge. GudMed digitizes prescriptions and discharge summaries in real-time, ensuring that patients receive their records instantly while automating workflows for doctors, nurses, and administrative staff.
                <ul className="list-disc mx-auto  md:pl-5 mt-2 text-[#2E4168]">
                    <li><strong>Faster Discharges:</strong> Reduce discharge waiting times significantly with automated processes.</li>
                    <li><strong>Accurate Data Capture:</strong> Ensure accurate and comprehensive discharge summaries and prescriptions.</li>
                    <li><strong>Seamless Integration:</strong> All digital records are automatically updated in your hospital’s EMR system.</li>
                </ul>
            </>
        ),
        icon: <FaPrescription className="text-[#2E4168]" size={40} />,
    },
    {
        title: "Digital Patient Records and Document Management",
        description: (
            <>
                By digitizing patient records and medical documents, your hospital no longer needs to store years of physical files. All data is securely stored and easily accessible, improving the efficiency of patient care and hospital management.
                <ul className="list-disc md:pl-5 mt-2 text-[#2E4168]">
                    <li><strong>Efficient Retrieval:</strong> Doctors and staff can access patient records instantly from any department.</li>
                    <li><strong>Improved Patient Experience:</strong> Patients can receive their medical history digitally, enabling them to share their records with specialists or other healthcare providers without delay.</li>
                </ul>
            </>
        ),
        icon: <FaFolderOpen className="text-blue-600" size={40} />,
    },
    {
        title: "AI-Powered Analytics and Operational Efficiency",
        description: (
            <>
                GudMed’s AI-driven tools help hospitals analyze data to optimize resource allocation, predict patient needs, and improve overall efficiency. This allows hospitals to reduce waste, better manage staff, and make data-driven decisions to improve patient care.
                <ul className="list-disc md:pl-5 mt-2 text-[#2E4168]">
                    <li><strong>Predictive Analytics:</strong> Forecast patient admissions, inventory needs, and staff requirements based on historical data.</li>
                    <li><strong>Enhanced Decision Making:</strong> Use AI insights to enhance patient outcomes and hospital operations.</li>
                    <li><strong>Operational Automation:</strong> Automate repetitive administrative tasks, allowing your staff to focus on providing high-quality care.</li>
                </ul>
            </>
        ),
        icon: <FaBrain className="text-purple-600" size={40} />,
    },
    {
        title: "Seamless Integration with Labs and Pharmacies",
        description: (
            <>
                With GudMed’s real-time digitization, prescriptions and lab orders are instantly sent to pharmacies and lab services. This reduces patient waiting times and ensures that hospitals and pharmacies can optimize their inventory based on real-time data.
                <ul className="list-disc md:pl-5 mt-2 mx-auto text-[#2E4168]">
                    <li><strong>Improved Pharmacy Sales:</strong> Direct integration with the pharmacy boosts sales by ensuring timely prescription fulfillment.</li>
                    <li><strong>Efficient Lab Operations:</strong> Patients receive lab test orders and results quickly, improving diagnostic timelines and reducing delays in treatment.</li>
                </ul>
            </>
        ),
        icon: <FaFlask className="text-red-600" size={40} />,
    },
    {
        title: "Post-Care Engagement and Automated Follow-Ups",
        description: (
            <>
                GudMed ensures that hospitals stay connected with patients even after they leave. Automated follow-ups, reminders for medication, and appointment scheduling keep patients engaged and reduce readmissions.
                <ul className="list-disc mx-auto  md:pl-5 mt-2 text-[#2E4168]">
                    <li><strong>Automated Post-Care Reminders:</strong> Patients receive reminders for medication, follow-ups, and tests, ensuring treatment adherence.</li>
                    <li><strong>Better Patient Engagement:</strong> Continuous engagement with patients results in better compliance and satisfaction.</li>
                    <li><strong>Lower Readmission Rates:</strong> Early intervention through follow-up reminders helps prevent complications and readmissions.</li>
                </ul>
            </>
        ),
        icon: <FaUserCheck className="text-yellow-600" size={40} />,
    },
];

const GudMedFeatures = () => {
    return (
        <section className="py-10 px-6 bg-white rounded-lg shadow-lg">
            <h3 className="md:text-4xl text-2xl font-semibold text-blue-900 text-center mb-8">
                How <span className="text-[#2E4168] font-bold ">GudMed</span> Transforms Healthcare
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className={`flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-md transition-transform transform hover:scale-105 ${
                            index === 4 ? 'sm:col-span-2' : ''
                        }`}
                    >
                        <div className="mb-4">{feature.icon}</div>
                        <h4 className="text-xl font-semibold text-[#2E4168] mb-3">{feature.title}</h4>
                        <div className="text-gray-700 text-sm sm:text-base leading-relaxed">
                            {feature.description}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default GudMedFeatures;
