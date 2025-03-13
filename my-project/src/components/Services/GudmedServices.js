import React from "react";
import {
  FaPills,
  FaCalendarAlt,
  FaBoxes,
  FaCheckCircle,
  FaBell,
  FaSms,
  FaSyncAlt,
} from "react-icons/fa";

const GudMedServices = () => {
  const services = [
    {
      title: "Medicine Reminders",
      description:
        "Keeping track of medications is crucial for effective treatment, yet many patients struggle to follow their prescribed schedules. GudMed’s Medicine Reminders service ensures that patients never miss a dose, improving compliance and health outcomes.",
      icon: <FaPills className="text-blue-600 text-5xl" />,
      howItWorks: [
        { text: "Patients receive automated reminders via SMS or WhatsApp for every medication on their prescription.", icon: <FaSms className="text-[#2E4168] text-8xl" /> },
        { text: "Reminders are sent at the right times based on dosage instructions from the doctor.", icon: <FaBell className="text-[#2E4168] text-7xl" /> },
        { text: "Patients can easily confirm that they have taken their medication, providing feedback to doctors and caregivers.", icon: <FaSyncAlt className="text-[#2E4168] text-8xl" /> },
      ],
      benefits: [
        { text: "Improved Treatment Compliance: Patients are less likely to miss or skip their medications.", icon: <FaCheckCircle className="text-[#2E4168] text-8xl" /> },
        { text: "Better Health Outcomes: Consistent medication use leads to faster recovery and fewer complications.", icon: <FaCheckCircle className="text-[#2E4168] text-8xl" /> },
        { text: "Reduced Readmissions: Proper medication adherence lowers the likelihood of patients returning to the hospital due to avoidable issues.", icon: <FaCheckCircle className="text-[#2E4168] text-9xl" /> },
      ],
    },
    {
      title: "Appointment Follow-Ups",
      description:
        "Missed follow-up appointments can disrupt care plans and delay recovery. GudMed’s Appointment Follow-Up service ensures patients stay on track with their healthcare by sending timely reminders for scheduled appointments or check-ups.",
      icon: <FaCalendarAlt className="text-green-600 text-5xl" />,
      howItWorks: [
        { text: "Patients receive notifications before their upcoming follow-up appointments, including details about time and location.", icon: <FaSms className="text-[#2E4168] text-8xl" /> },
        { text: "Follow-ups are tracked within the hospital’s system, ensuring that both patients and healthcare providers are kept in the loop.", icon: <FaSyncAlt className="text-[#2E4168] text-8xl" /> },
        { text: "In case of rescheduling, patients can easily adjust their appointments through the digital reminder service.", icon: <FaBell className="text-[#2E4168] text-8xl" /> },
      ],
      benefits: [
        { text: "Increased Attendance: Timely reminders help reduce no-shows, ensuring patients attend crucial follow-up appointments.", icon: <FaCheckCircle className="text-[#2E4168] text-8xl" /> },
        { text: "Seamless Rescheduling: Patients can reschedule appointments quickly, maintaining care continuity.", icon: <FaCheckCircle className="text-[#2E4168] text-8xl" /> },
        { text: "Enhanced Patient Satisfaction: Patients feel supported throughout their healthcare journey, improving their overall experience.", icon: <FaCheckCircle className="text-[#2E4168] text-8xl" /> },
      ],
    },
    {
      title: "Medicine Inventory Management",
      description:
        "Managing medicine inventories efficiently is critical for hospitals and pharmacies to meet patient demand. GudMed’s Medicine Inventory Management service helps hospitals track and manage their medicine stocks in real time, preventing shortages and ensuring that the right medications are always available.",
      icon: <FaBoxes className="text-yellow-600 text-5xl" />,
      howItWorks: [
        { text: "GudMed’s platform integrates with the hospital or pharmacy’s inventory system to monitor stock levels in real-time.", icon: <FaSyncAlt className="text-[#2E4168] text-7xl" /> },
        { text: "Automatic alerts are generated when stock levels are low or when medications are approaching their expiration date.", icon: <FaBell className="text-[#2E4168] text-7xl" /> },
        { text: "Hospitals and pharmacies can forecast inventory needs based on prescription trends and adjust orders accordingly to avoid overstocking or shortages.", icon: <FaSms className="text-[#2E4168] text-8xl" /> },
      ],
      benefits: [
        { text: "Optimized Stock Levels: Ensure that essential medicines are always available, avoiding last-minute shortages.", icon: <FaCheckCircle className="text-[#2E4168] text-7xl" /> },
        { text: "Reduced Waste: Manage expiration dates and prevent wastage of medicines nearing expiration.", icon: <FaCheckCircle className="text-[#2E4168] text-7xl" /> },
        { text: "Better Financial Control: Streamlined inventory management reduces the risk of over-ordering and helps optimize the hospital’s budget for medicine supplies.", icon: <FaCheckCircle className="text-[#2E4168] text-9xl" /> },
      ],
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 mb-10 ">
      <h1 className="text-4xl font-semibold text-center text-[#2E4168] mb-8">
        Our Services at GudMed
      </h1>
      <p className="text-lg md:text-center text-gray-600 lg:max-w-5xl md:mx-16 mx-2 mb-12">
        GudMed offers a suite of services designed to enhance healthcare
        delivery, improve patient engagement, and streamline hospital
        operations. From medicine reminders to inventory management, our
        solutions empower hospitals, doctors, and patients to stay connected
        and organized throughout the care journey.
      </p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-xl p-6  transition-transform duration-300"
          >
            <div className="flex items-center justify-center mb-6">
              {service.icon}
            </div>
            <h2 className="text-2xl font-semibold text-[#2E4168] mb-4 text-center">
              {service.title}
            </h2>
            <p className="text-gray-600 text-md mb-6 ">
              {service.description}
            </p>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-[#2E4168] mb-2">
                How It Works
              </h3>
              <ul className="space-y-2">
                {service.howItWorks.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-6 ">
                    {item.icon}
                    <span className="text-gray-800 text-md">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#2E4168] mb-2">
                Benefits
              </h3>
              <ul className="space-y-2">
                {service.benefits.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-6">
                    {item.icon}
                    <span className="text-gray-600 text-md">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GudMedServices;
