import React from 'react';
import { FaFileMedical, FaLock, FaCloud, FaBriefcaseMedical, FaCogs, FaShieldAlt, FaExpand, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const services = [
  {
    icon: FaFileMedical,
    title: "Scanning Medical Files with Precision",
    description: "We specialize in scanning physical medical records into high-quality digital formats.",
    items: [
      { label: "Rheumatology Files", details: "Treatment notes, patient history, lab results." },
      { label: "Radiology Files", details: "X-rays, MRI, CT scan films, and reports." },
      { label: "Pathology Files", details: "Lab results, biopsy reports, and diagnostic data." },
    ],
  },
  {
    icon: FaLock,
    title: "Secure Data Storage for Peace of Mind",
    description: "We provide a secure environment for storing your medical data, ensuring compliance with the highest standards of data protection.",
    items: [
      { label: "Encrypted Storage", details: "All files are protected with advanced encryption protocols." },
      { label: "24/7 Access", details: "Access your data anytime through a secure portal." },
      { label: "Disaster Recovery", details: "Reliable backups to prevent data loss." },
    ],
  },
  {
    icon: FaCloud,
    title: "Full Digitization for Operational Efficiency",
    description: "Beyond scanning, we take medical record management a step further by digitizing files and making them ready for modern healthcare workflows.",
    items: [
      { label: "Indexing", details: "All records are indexed based on patient name, ID, date, and type of record." },
      { label: "Integration", details: "Digitized files can be integrated directly into your EMR or hospital management system." },
      { label: "Enhanced Workflows", details: "Digital records improve collaboration between departments and reduce administrative workload." },
    ],
  },
];

const features = [
  {
    icon: FaBriefcaseMedical,
    title: "Expertise",
    description: "Over a decade of experience in healthcare data management.",
  },
  {
    icon: FaCogs,
    title: "Customization",
    description: "Tailored solutions to meet your hospital's unique needs.",
  },
  {
    icon: FaShieldAlt,
    title: "Security First",
    description: "Compliant with HIPAA, and local healthcare regulations.",
  },
  {
    icon: FaExpand,
    title: "Scalability",
    description: "Handle small clinics to large hospital chains effortlessly.",
  },
];

const MedicalRecord = () => {
  return (
    <div className="p-6 bg-gradient-to-b from-blue-100 via-white to-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-200"
      >
        <div className="p-8">
          <h1 className="text-2xl md:text-4xl font-semibold text-[#2E4168] mb-6 text-center">
            Transforming Medical Records for the Future
          </h1>
          <p className="text-gray-700 md:text-center text-sm md:text-base leading-relaxed mb-8 max-w-3xl mx-auto">
            At GudMed, we bring simplicity and security to managing medical records by offering specialized services for scanning, secure data storage, and complete digitization. Whether it’s Rheumatology, Radiology, or Pathology files, we’ve got you covered.
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-[#2E4168] mb-6 md:text-center">
            Our Services
          </h1>

          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 shadow-lg rounded-lg flex flex-col items-center text-center border border-gray-300 hover:shadow-2xl transition-shadow duration-300"
              >
                <service.icon className="text-blue-500 text-6xl mb-4" />
                <h2 className="text-xl font-semibold text-[#2E4168] mb-2">{service.title}</h2>
                <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
                <ul className="list-disc text-left pl-4 text-gray-600">
                  {service.items.map((item, idx) => (
                    <li key={idx} className="mb-2">
                      <FaCheckCircle className="inline-block text-[#2E4168] mr-2" />
                      <span className="font-bold text-[#2E4168]">{item.label}:</span> {item.details}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <h2 className="text-xl md:text-2xl font-bold text-[#2E4168] text-center mb-8">Why Choose Us?</h2>
            <ul className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              {features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center bg-white p-6 shadow-lg rounded-lg border border-gray-300 hover:shadow-2xl transition-shadow duration-300"
                >
                  <feature.icon className="text-blue-500 text-4xl mr-4" />
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-[#2E4168] mb-1">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MedicalRecord;
