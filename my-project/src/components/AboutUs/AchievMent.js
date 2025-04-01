



import { motion } from 'framer-motion'
import { FaHospital, FaUserMd, FaGlobe, FaAward, FaChartLine } from 'react-icons/fa'
import { MdHealthAndSafety, MdOutlineScience } from 'react-icons/md'

 const achievements = [
    {
      title: "Transforming Healthcare Digitization",
      icon: <MdHealthAndSafety className="w-12 h-12 text-blue-600" />,
      content: [
        "Successfully digitized over 2,800,000+ medical documents, including prescriptions, discharge summaries, and patient records, ensuring accurate and real-time access for hospitals and patients.",
        "Reduced hospital discharge waiting times by up to 40%, enhancing operational efficiency and patient satisfaction."
      ]
    },
    {
      title: " Trusted by Leading Hospitals",
      icon: <FaHospital className="w-12 h-12 text-green-600" />,
      content: [
        "Partnered with top-tier hospitals like Max Healthcare, Apollo, and Sir Ganga Ram Hospital to provide cutting-edge digitization and automation solutions.",
        "Delivered impactful Proof of Concepts (POCs), such as real-time EMR integration, earning the trust of renowned healthcare providers."
      ]
    },
    {
      title: "Enhancing Patient Care",
      icon: <FaUserMd className="w-12 h-12 text-red-600" />,
      content: [
        "Improved patient engagement with automated reminders for follow-ups, medication, and post-treatment care, helping hospitals provide seamless end-to-end care.",
        "Enabled instant lab test bookings and results delivery through digitized prescription processing, contributing to faster diagnosis and treatment."
      ]
    },
    {
      title: "Cutting-Edge AI Integration",
      icon: <MdOutlineScience className="w-12 h-12 text-purple-600" />,
      content: [
        "Developed AI-powered tools to streamline medical transcription, prescription digitization, and document mapping, ensuring 99%+ accuracy in data processing.",
        "Leveraged AI to provide real-time insights for hospitals, enabling data-driven decisions for improved patient outcomes."
      ]
    },
    {
      title: " Global Reach",
      icon: <FaGlobe className="w-12 h-12 text-indigo-600" />,
      content: [
        "Extended our services to international markets, showcasing GudMed as a global leader in healthcare digitization and technology.",
        "Supported multilingual transcription and digitization, catering to diverse patient and hospital needs."
      ]
    },
    {
      title: " Recognitions and Certifications",
      icon: <FaAward className="w-12 h-12 text-yellow-600" />,
      content: [
        "Achieved compliance with industry standards like HIPAA, ensuring the highest level of data security and confidentiality.",
        "Honored with accolades for innovation in healthcare technology and outstanding contributions to the health-tech ecosystem."
      ]
    },
    {
      title: "Scalable Solutions",
      icon: <FaChartLine className="w-12 h-12 text-teal-600" />,
      content: [
        "Processed millions of prescriptions and discharge summaries annually, providing scalable and reliable solutions to healthcare institutions.",
        "Expanded services to OPD, IPD, pharmacy, and lab integrations, making GudMed a one-stop solution for all healthcare digitization needs."
      ]
    }
  ]

 
  
  function AchievementCard({ achievement, index, spanFull }) {
    return (
      <motion.div
        className={`flex flex-col items-start space-y-4 bg-white p-6 rounded-lg shadow-md ${
          spanFull ? "col-span-full" : ""
        }`}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
      <div
  className={`flex-shrink-0 bg-blue-50 p-4 rounded-full shadow-inner ${
    "mx-auto sm:mx-0" // Center icon in mobile devices, align it to left in larger screens
  }`}
>
  {achievement.icon}
</div>


<h3 className="text-[1.4rem] sm:text-xl font-semibold text-[#2E4168] mb-4 text-center sm:text-left ">
  {achievement.title}
</h3>

        <ul className="list-disc pl-5 space-y-2 text-base sm:text-base text-gray-600">
          {achievement.content.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </motion.div>
    );
  }
  
  export default function Achievements() {
    return (
      <div className="min-h-screen bg-white py-20 px-0 sm:px-6 lg:px-0">
        <div className="max-w-7xl md:text-4xl text-3xl  mx-auto">
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center text-[#2E4168] mb-8"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Achievements
          </motion.h1>
          <motion.div
            className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-base sm:text-lg text-center text-[#2E4168] mb-8 md:mx-4 lg:mx-16 ">
              At GudMed, we are revolutionizing healthcare through technology, innovation, and patient-centered solutions. Here are some milestones that reflect our commitment to excellence:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
              {achievements.map((achievement, index) => (
                <AchievementCard
                  key={index}
                  achievement={achievement}
                  index={index}
                  spanFull={index === achievements.length - 1} // Apply full-span only to the last card
                />
              ))}
            </div>
          </motion.div>
          <motion.div
            className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl sm:text-xl md:text-2xl  font-semibold text-[#2E4168] mb-4">
              Join Us in Transforming Healthcare
            </h2>
            <p className="text-base sm:text-base text-gray-700">
              At GudMed, our achievements are a reflection of our passion for delivering excellence. We are dedicated to continuing our journey of innovation and collaboration to make healthcare smarter, faster, and more accessible for everyone.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }
  