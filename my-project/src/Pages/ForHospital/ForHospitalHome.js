// import React, { useEffect, useState, useCallback } from "react";
// import io from "socket.io-client";
// import axios from "axios";
// import HospitalFeatureCard from "./HospitalFeatureCard";
// import GudmedICUAutomation from "./IcuAutomation";
// import HospitalOverview from "./HospitalOverview";
// import BenefitsList from "./BenefitsList";
// import GudMedFeatures from "./GudMedFeatures";
// import CTASection from "./CTASection";

// // Initialize Socket.IO connection
// const socket = io("http://localhost:5000", { withCredentials: true });

// const ForHospitalHome = () => {
//   const [hospitalData, setHospitalData] = useState(null); // Single object for the first hospital entry
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch data from backend
//   const fetchHospitalData = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get("http://localhost:5000/api/hospital");
//       console.log("API Response:", response.data); // Debug log
//       const data = Array.isArray(response.data) ? response.data : response.data.data || [];
//       if (data.length > 0) {
//         setHospitalData(data[0]); // Use the first item
//       } else {
//         setHospitalData(null);
//         setError("No hospital data available.");
//       }
//     } catch (error) {
//       console.error("Error fetching hospital data:", error.response || error);
//       setError("Failed to load hospital data.");
//       setHospitalData(null);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchHospitalData();

//     // Real-time updates with Socket.IO
//     socket.on("connect", () => console.log("User frontend connected to socket:", socket.id));
//     socket.on("hospital_create", (data) => {
//       console.log("Socket create received:", data);
//       setHospitalData(data); // Replace with new data
//     });

//     socket.on("hospital_update", (data) => {
//       console.log("Socket update received:", data);
//       // Update if the ID matches the current data or if no data exists
//       if (hospitalData && hospitalData._id === data._id) {
//         setHospitalData(data);
//       } else if (!hospitalData) {
//         // Fetch fresh data if no hospital data is set
//         fetchHospitalData();
//       }
//     });

//     socket.on("hospital_delete", (data) => {
//       console.log("Socket delete received:", data);
//       if (hospitalData && hospitalData._id === data.id) {
//         setHospitalData(null);
//       }
//     });

//     socket.on("disconnect", () => console.log("User frontend disconnected from socket"));
//     socket.on("connect_error", (error) => console.error("Socket connect error:", error.message));
//     socket.on("error", (error) => console.error("Socket error:", error.message));

//     // Cleanup
//     return () => {
//       socket.off("connect");
//       socket.off("hospital_create");
//       socket.off("hospital_update");
//       socket.off("hospital_delete");
//       socket.off("disconnect");
//       socket.off("connect_error");
//       socket.off("error");
//     };
//   }, [fetchHospitalData]); // Removed hospitalData from dependencies

//   return (
//     <div className="w-11/12 lg:w-9/12 xl:w-8/12 flex flex-col mx-auto py-10 space-y-10 bg-gray-50 rounded-lg shadow-md">
//       {/* Hospital Feature Card */}
//       {loading ? (
//         <p className="text-gray-700 text-center">Loading hospital data...</p>
//       ) : error ? (
//         <p className="text-red-500 text-center">{error}</p>
//       ) : hospitalData ? (
//         <HospitalFeatureCard
//           imageSrc={hospitalData.imageSrc}
//           title={hospitalData.title}
//           description={hospitalData.description}
//           features={hospitalData.features}
//         />
//       ) : (
//         <p className="text-gray-700 text-center">No hospital data available.</p>
//       )}

//       {/* Static Sections */}
//       <GudmedICUAutomation />
//       <HospitalOverview />
//       <BenefitsList />
//       <GudMedFeatures />
//       <CTASection />
//     </div>
//   );
// };

// export default ForHospitalHome;
import React, { useEffect, useState, useCallback } from "react";
import io from "socket.io-client";
import axios from "axios";
import HospitalFeatureCard from "./HospitalFeatureCard";
import GudmedICUAutomation from "./IcuAutomation";
import HospitalOverview from "./HospitalOverview";
import BenefitsList from "./BenefitsList";
import GudMedFeatures from "./GudMedFeatures";
import CTASection from "./CTASection";

// Initialize Socket.IO connection
const socket = io("http://localhost:5000", { withCredentials: true });

const ForHospitalHome = () => {
  const [hospitalData, setHospitalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHospitalData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/api/hospital");
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      if (data.length > 0) {
        setHospitalData(data[0]);
      } else {
        setHospitalData(null);
        setError("No hospital data available.");
      }
    } catch (error) {
      setError("Failed to load hospital data.");
      setHospitalData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHospitalData();

    socket.on("connect", () => console.log("Socket connected:", socket.id));
    socket.on("hospital_create", (data) => {
      setHospitalData(data);
    });

    socket.on("hospital_update", (data) => {
      if (hospitalData && hospitalData._id === data._id) {
        setHospitalData(data);
      } else if (!hospitalData) {
        fetchHospitalData();
      }
    });

    socket.on("hospital_delete", (data) => {
      if (hospitalData && hospitalData._id === data.id) {
        setHospitalData(null);
      }
    });

    socket.on("disconnect", () => console.log("Socket disconnected"));
    socket.on("connect_error", (error) => console.error("Socket connect error:", error.message));
    socket.on("error", (error) => console.error("Socket error:", error.message));

    return () => {
      socket.off("connect");
      socket.off("hospital_create");
      socket.off("hospital_update");
      socket.off("hospital_delete");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("error");
    };
  }, [fetchHospitalData]);

  return (
    <div className="w-11/12 lg:w-9/12 xl:w-8/12 flex flex-col mx-auto py-10 space-y-10 bg-gray-50 rounded-lg shadow-md">
      {loading ? (
        <p className="text-gray-700 text-center">Loading hospital data...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : hospitalData ? (
        <HospitalFeatureCard
          imageSrc={hospitalData.imageSrc}
          title={hospitalData.title}
          description={hospitalData.description}
          features={
            Array.isArray(hospitalData.features) && hospitalData.features.length > 0
              ? hospitalData.features[0]
                  .split("•")
                  .map((item) => item.trim())
                  .filter((item) => item)
              : []
          }
        />
      ) : (
        <p className="text-gray-700 text-center">No hospital data available.</p>
      )}

      <GudmedICUAutomation />
      <HospitalOverview />
      <BenefitsList />
      <GudMedFeatures />
      <CTASection />
    </div>
  );
};

export default ForHospitalHome;
