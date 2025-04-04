// import React, { useState, useEffect } from "react"; 
// import axios from "axios"; // Make sure to import axios
// import { FaHandsHelping } from "react-icons/fa"; // Importing only necessary icon
// import AboutUsImage from "../../img/AboutUs.pnj.png"; // Adjust the path if needed
// import Achievements from "./AchievMent"; // Your achievements section

// // Reusable Component for Section Title
// const SectionTitle = ({ title }) => (
//   <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 sm:mb-16 md:mb-32 lg:mb-16 text-[#2E4168]">
//     {title}
//   </h2>
// );

// // Reusable Component for About Section
// const AboutSection = ({ heading, subheading, title, text, image }) => (
//   <div className="flex flex-col md:flex-row items-center gap-16">
//     {/* Image Section */}
//     <div className="w-full md:w-1/2 flex justify-center mt-0 md:-mt-32 lg:mt-3 sm:mt-80">
//       <img
//         src={image}
//         alt={heading}
//         className="w-full max-h-[300px] sm:max-h-[450px] md:max-h-[750px] lg:max-h-[350px] xl:rounded-lg shadow-lg object-cover transition-transform duration-300"
//       />
//     </div>

//     {/* Text Section */}
//     <div className="w-full md:w-1/2 mt-0 md:-mt-20 lg:-mt-16 sm:-mt-80">
//       <div className="text-center mb-4">
//         {/* <h1 className="text-4xl md:text-5xl font-bold text-[#2E4168]">{heading}</h1> */}
       
//       </div>
//       <div className="flex items-center space-x-3 mb-4 text-center">
//         <FaHandsHelping className="text-[#2E4168] text-4xl" />
//         <h2 className="text-4xl md:text-2xl font-semibold text-[#2E4168] mt-4">{subheading}</h2>
//         {/* <h3 className="text-7xl md:text-3xl font-semibold ml-4 md:text-center   text-[#2E4168]">{title}</h3> */}
//       </div>
//       <p className="text-[#2E4168] text-base md:text-lg leading-relaxed">{text}</p>
//     </div>
//   </div>
// );

// // Main About Us Page Component
// const AboutUsHome = () => {
//   const [aboutUs, setAboutUs] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch the About Us content from the backend
//   useEffect(() => {
//     fetchAboutUs();
//   }, []);

//   const fetchAboutUs = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/aboutus");
//       if (response.data.success) {
//         setAboutUs(response.data.data); // Set the fetched data
//         setLoading(false); // Stop loading once the data is fetched
//       } else {
//         console.error("Failed to fetch About Us data:", response.data.message);
//         setLoading(false);
//       }
//     } catch (error) {
//       console.error("Error fetching About Us data:", error);
//       setLoading(false);
//     }
//   };

//   // Conditional rendering based on loading state
//   if (loading) {
//     return <div>Loading...</div>; // Show loading state while waiting for the data
//   }

//   return (
//     <div className="p-6 md:p-12 max-w-7xl mx-auto">
//       {/* Page Title */}
//       <SectionTitle title={aboutUs.heading} />

//       {/* About Section with data from backend */}
//       {aboutUs && (
//         <AboutSection
//           // heading={aboutUs.heading} // Use heading from fetched data
//           subheading={aboutUs.subheading} // Use subheading from fetched data
//           // title={aboutUs.heading} // You can also use the heading as the title
//           text={aboutUs.description} // Use description from fetched data
//           image={aboutUs.imageUrl || AboutUsImage} // Use imageUrl or fallback to default image
//         />
//       )}

//       <Achievements />
//     </div>
//   );
// };

// export default AboutUsHome;
import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { FaHandsHelping } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import AboutUsImage from "../../img/AboutUs.pnj.png"; // Adjust path as needed
import Achievements from "./AchievMent";
import config from "../../config/config"; // Assuming a config file exists
import AboutUsLastSection from "./AboutUsLastSection";

const SectionTitle = ({ title }) => (
  <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 sm:mb-16 md:mb-32 lg:mb-16 text-[#2E4168]">
    {title}
  </h2>
);

const AboutSection = ({ heading, subheading, text, image }) => (
  <div className="flex flex-col md:flex-row items-center gap-16">
    <div className="w-full md:w-1/2 flex justify-center mt-0 md:-mt-32 lg:mt-3 sm:mt-80">
      <img
        src={image}
        alt={heading}
        className="w-full max-h-[300px] sm:max-h-[450px] md:max-h-[750px] lg:max-h-[350px] xl:rounded-lg shadow-lg object-cover transition-transform duration-300"
      />
    </div>
    <div className="w-full md:w-1/2 mt-0 md:-mt-20 lg:-mt-16 sm:-mt-80">
      <div className="flex items-center space-x-4 mb-4">
        <FaHandsHelping className="text-[#2E4168] text-5xl md:text-4xl" />
        <h2 className="text-5xl md:text-4xl font-semibold text-[#2E4168]">{subheading}</h2>
      </div>
      <p className="text-[#2E4168] text-base md:text-lg leading-relaxed">{text}</p>
    </div>
  </div>
);

const AboutUsHome = () => {
  const [aboutUs, setAboutUs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const socket = io(config.socketBaseUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    const fetchAboutUs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${config.apiBaseUrl}/api/aboutus`);
        if (response.data.success) {
          setAboutUs(response.data.data);
          setError(null);
        } else {
          setAboutUs(null);
          setError("No About Us data available");
        }
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError(err.message || "Failed to fetch About Us data");
        toast.error("Failed to load About Us content");
      } finally {
        setLoading(false);
      }
    };

    fetchAboutUs();

    socket.on("connect", () => {
      console.log("Socket connected to:", config.socketBaseUrl);
    });

    socket.on("aboutUs_created", (data) => {
      console.log("Received aboutUs_created:", data);
      setAboutUs(data);
      setError(null);
      toast.success("About Us content created in real-time!");
    });

    socket.on("aboutUs_updated", (data) => {
      console.log("Received aboutUs_updated:", data);
      setAboutUs(data);
      setError(null);
      toast.success("About Us content updated in real-time!");
    });

    socket.on("aboutUs_deleted", () => {
      console.log("Received aboutUs_deleted");
      setAboutUs(null);
      setError("About Us content has been deleted");
      toast.success("About Us content deleted in real-time!");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      toast.error("Failed to connect to real-time updates: " + err.message);
    });

    return () => {
      socket.off("connect");
      socket.off("aboutUs_created");
      socket.off("aboutUs_updated");
      socket.off("aboutUs_deleted");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, []); // Empty dependency array for mount-only execution

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E4168]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <SectionTitle title={aboutUs?.heading || "About Us"} />
      {aboutUs ? (
        <AboutSection
          heading={aboutUs.heading}
          subheading={aboutUs.subheading}
          text={aboutUs.description}
          image={aboutUs.imageUrl || AboutUsImage}
        />
      ) : (
        <p className="text-gray-500 text-center text-lg">No About Us data available</p>
      )}
      <Achievements />
      <AboutUsLastSection></AboutUsLastSection>
    </div>
  );
};

export default AboutUsHome;