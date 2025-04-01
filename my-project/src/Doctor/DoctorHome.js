import React from "react";
import doctorImage from "../img/DoctorPage2.jpeg"; // Ensure to replace with correct image path
import DoctorImage from "../img/DoctorpageImage.jpeg";
import DoctorPatientRecord from "../img/DocPatientRecord.jpeg"
import FollowUpRemainder from "../img/AutomaticFollowUpMessage.jpeg"
import PatientConversesion from "../img/patientConversasion.jpeg"
import DisachargeSummary from "../img/GudmedNotificationjpeg.jpeg"

const DoctorHome = () => {
  return (
    <div className="relative bg-gray-50 py-12 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-40">
      {/* Header */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl xl:  font-medium text-[#2E4168] mb-8 text-center">
        For Doctors
      </h1>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 px-4 my-12">
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-start">
          <img
            src={DoctorImage}
            alt="Doctor"
            className="w-full max-h-[300px] md:max-h-[350px] rounded-lg shadow-lg object-cover transition-transform duration-300"
          />
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 text-center md:text-left space-y-6    ">
          <h2 className="text-3xl sm:text-4xl md:text-[2.1rem] lg:text-[2.4rem] xl:text-5xl  font-medium text-[#2E4168] text-center  ">
            Your Clinic <br />
            <span className="text-[#2E4168] mt-10">Digitized In Your Way</span>
          </h2>
          <div className="flex flex-row gap-4 justify-center md:justify-center sm:pl-4 ">
  <a
    href="https://doctor.gudmed.in/signin"
    target="_blank"
    rel="noopener noreferrer"
  >
    <button
      className="w-full sm:w-auto px-10 py-5 md:px-16 md:py-6 text-white bg-[#2E4168] border border-blue-600 rounded-full shadow-lg hover:bg-[#2E4168] focus:outline-none transition-transform duration-300 hover:scale-105"
      aria-label="Sign In"
    >
      Sign In
    </button>
  </a>
  <a
    href="https://doctor.gudmed.in/signup"
    target="_blank"
    rel="noopener noreferrer"
  >
    <button
      className="w-full sm:w-auto px-10 py-5 md:px-16 md:py-6 text-blue-600 border border-blue-600 rounded-full shadow-lg hover:bg-[#2E4168] hover:text-white focus:outline-none transition-transform duration-300 hover:scale-105"
      aria-label="Sign Up"
    >
      Sign Up
    </button>
  </a>
</div>

        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 px-4 my-12">
        {/* Left: Features Content */}
        <div className="w-full md:w-1/2 text-center md:text-left  space-y-6">
          <p className="text-base sm:text-lg  md:mx-0 mx-auto text-gray-700 leading-relaxed max-w-screen-sm">
            At GudMed, we empower doctors by streamlining patient management
            through cutting-edge technology. Our platform allows you to focus
            more on patient care and less on administrative tasks. With
            real-time prescription digitization, patient engagement tools, and
            AI-powered operational support, GudMed helps you improve efficiency,
            reduce errors, and offer a more personalized healthcare experience.
            Join us in revolutionizing healthcare with smarter solutions that
            make your practice run smoother and deliver better patient outcomes.
          </p>


          {/* <h2 className="text-xl sm:text-2xl font-semibold text-[#2E4168]">
            Key Features for Doctors:
          </h2>

          <ul className="list-disc list-inside text-base sm:text-lg text-gray-700 space-y-2">
            <li className=" sm:ml-0 -ml-6">Quick and accurate discharge summaries</li>
            <li className=" sm:ml-0 whitespace-nowrap mx-auto -ml-20">Seamless patient communication</li>
            <li className="-ml-6 sm:ml-0 ">Automated post-care follow-ups and reminders</li>
            <li className="-ml-6 sm:ml-0 ">Real-time access to patient history and reports</li>
          </ul> */}

        </div>

        {/* Right: Features Image */}
       
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={doctorImage}
            alt="Doctor"
            className="w-full max-h-[300px] md:max-h-[350px] rounded-lg shadow-lg object-cover transition-transform duration-300"
          />
        </div>
       
      </div>
      <h2 className="md:text-6xl sm:text-4xl text-4xl  font-medium text-[#2E4168] text-center mt-10 ">
            Key Features for Doctors
          </h2>
      {/* 3rd section  */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 px-4 my-12">
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex-re justify-center md:justify-start">
          <img
            src={DoctorPatientRecord}
            alt="Doctor"
            className="w-full max-h-[300px] md:max-h-[350px] rounded-lg shadow-lg object-cover transition-transform duration-300"
          />
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 text-left  md:text-left space-y-6 ">
          <h2 className="text-[1.5rem] sm:text-4xl lg:text-3xl font-medium text-[#2E4168] md:text-center text-left gap-80 md:ml-10">
            Real-time access to patient history and reports<br />

          </h2>
          <div className="flex flex-row gap-4 justify-center md:justify-center sm:pl-4 ">


          </div>
        </div>
      </div>
      {/* 4th section  */}
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-8 px-4 my-12">
  {/* Content Section */}
  <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
    <h2 className="text-[1.6rem] sm:text-4xl lg:text-3xl font-medium text-[#2E4168]  md:text-left text-left  ">
    Automated post-care follow-ups and reminders<br />
    </h2>
    <div className="flex flex-row gap-4 justify-center md:justify-start sm:pl-4">
      {/* Additional content or buttons can be added here */}
    </div>
  </div>

  {/* Image Section */}
  <div className="w-full md:w-1/2 flex justify-center md:justify-end">
    <img
      src={FollowUpRemainder}
      alt="Doctor"
      className="w-full max-h-[300px] md:max-h-[350px] rounded-lg shadow-lg object-cover transition-transform duration-300"
    />
  </div>
</div>

{/* 5th section  */}
<div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 px-4 my-12">
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex-re justify-center md:justify-start">
          <img
            src={PatientConversesion}
            alt="Doctor"
            className="w-full max-h-[300px] md:max-h-[350px] rounded-lg shadow-lg object-cover transition-transform duration-300"
          />
        </div>

        {/* Content Section */}
        
        <div className="w-full md:w-1/2 text-center md:text-left space-y-6 ">
          <h2 className="text-[1.8rem] sm:text-4xl lg:text-3xl font-medium text-[#2E4168] text-center  md:text-center gap-80 md:ml-10">
          Seamless patient communication<br />

          </h2>
          <div className="flex flex-row gap-4 justify-center md:justify-center sm:pl-4 ">


          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
   
    <div className="flex flex-row gap-4 justify-center md:justify-start sm:pl-4">
      {/* Additional content or buttons can be added here */}
      
    </div>
  </div>

  {/* Image Section */}
  <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-8 px-4 my-12">
  {/* Content Section */}
  <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
    <h2 className="text-3xl sm:text-4xl lg:text-3xl font-medium text-[#2E4168] text-center md:text-left">
    Quick and accurate discharge summaries<br />
    </h2>
    <div className="flex flex-row gap-4 justify-center md:justify-start sm:pl-4">
      {/* Additional content or buttons can be added here */}
    </div>
  </div>

  {/* Image Section */}
  <div className="w-full md:w-1/2 flex justify-center md:justify-end">
    <img
      src={DisachargeSummary}
      alt="Doctor"
      className="w-full max-h-[300px] md:max-h-[350px] rounded-lg shadow-lg object-cover transition-transform duration-300"
    />
  </div>
</div>

      

    </div>
    
  );
};

export default DoctorHome;
