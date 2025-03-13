import React from "react";
import doctorImage from "../img/DoctorPage2.jpeg"; // Ensure to replace with correct image path
import DoctorImage from "../img/DoctorpageImage.jpeg";
import DoctorPatientRecord from "../img/DocPatientRecord.jpeg"
import FollowUpRemainder from "../img/PtientfollowUpRemainder.jpeg"
import PatientConversesion from "../img/PatientComunication.jpg"
import DisachargeSummary from "../img/PatientDischaege.png"
import PatientImage from "../img/PatientImage.jpg"
import Patient2Image from "../img/GudMedPatient2.png"
import Patient3Images from "../img/patirntImages3.png"
import Patient4imges from "../img/patientDigitalPrescription.png"
const Patient = () => {
  return (
    <div className="relative bg-gray-50 py-4 px-0 sm:px-6 md:px-4 lg:px-6 xl:px-12">
      {/* Header */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-[#2E4168] mb-16 text-center">
        For Patients
      </h1>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 px-4 my-10">
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-start">
          <img
            src={PatientImage}
            alt="Doctor"
            className="w-full max-h-[300px] md:max-h-[350px] rounded-lg shadow-lg object-cover transition-transform duration-300"
          />
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 text-center md:text-right space-y-6 mx- md:mx-0 text-current ">
  {/* Title for Desktop View */}
  <div className="hidden md:block">
  <h2 className="text-4xl md:-ml-20 md:text-3xl md:-mt-4 lg:-mt-20 lg:ml-0  lg:text-5xl font-medium text-[#2E4168] text-center mb-3 ml-10 -mr-20 -mt-20 ">
    Healthcare can be  complex
  </h2>
  <span className="block text-[#2E4168] md:text-3xl text-4xl lg:text-5xl font-medium mb-3">
   but GudMed  is here to &nbsp;
  </span>
  <span className="block md:text-4xl  text-[#2E4168] text-4xl lg:text-5xl font-medium mb-3">
    simplify  it for you.&nbsp;
  </span>
  <span className="block text-[#2E4168] text-4xl lg:text-5xl font-medium">
   
  </span>
</div>

{/* tablet view view */}



  {/* Title for Mobile View */}
  <div className="block md:hidden space-y-80 -mt-40">
    <h2 className="text-3xl md:mx-auto sm:text-4xl font-medium text-[#2E4168] text-center gap-y-10 ">
      Healthcare can be
    </h2>
    <span className="text-[#2E4168] md:mx-auto -mt-80 text-3xl sm:text-4xl font-medium  ">
      complex but GudMed&nbsp;
    </span>
    <span className="text-[#2E4168] mt-6 text-3xl sm:text-4xl font-medium">
      is here&nbsp;
    </span>
    <span className="text-[#2E4168] mt-3 text-3xl sm:text-4xl font-medium">
      to simplify it for you.
    </span>
  </div>

  {/* Buttons */}
  <div className="flex flex-row gap-8 justify-center sm:pl-4 ">
    <a
      href="https://patient.gudmed.in/signin"
      target="_blank"
      rel="noopener noreferrer"
    >
      <button
        className="w-full sm:w-auto px-12 py-6 md:px-16 md:py-6 text-white bg-[#2E4168] rounded-full shadow-lg hover:bg-[#0e182c] focus:outline-none transition-transform duration-300 hover:scale-105"
        aria-label="Sign In"
      >
        Sign In
      </button>
    </a>
    <a
      href="https://patient.gudmed.in/signup"
      target="_blank"
      rel="noopener noreferrer"
    >
      <button
        className="w-full sm:w-auto px-12 py-6 md:px-16 md:py-6 text-blue-600 border border-blue-600 rounded-full shadow-lg hover:bg-[#2E4168] hover:text-white focus:outline-none transition-transform duration-300 hover:scale-105"
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
        <div className="w-full md:w-1/2 text-center md:text-left space-y-6 ">
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed mx-auto max-w-screen-sm">
          Our platform ensures you have all your medical information at your fingertips, from digital prescriptions to reminders for your next medicine dose. With GudMed, you stay connected with your healthcare provider, receive timely updates, and have your entire health history securely stored. We help you understand your treatment better, offering peace of mind and making healthcare more accessible.
          </p>


          

        </div>

        {/* Right: Features Image */}
       
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={Patient2Image}
            alt="Doctor"
            className="w-full max-h-[300px] md:max-h-[450px] rounded-lg shadow-lg object-cover transition-transform duration-300"
          />
        </div>
       
      </div>
      <h2 className=" mx-auto text-3xl md:text-5xl sm:text-2xl font-medium text-[#2E4168] text-center mt-10 ">
            Key Features for Patients
          </h2>
      {/* 3rd section  */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 px-4 my-12">
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex-re justify-center md:justify-start">
          <img
            src={Patient3Images}
            alt="Doctor"
            className="w-full max-h-[300px] md:max-h-[350px] rounded-lg shadow-lg object-cover transition-transform duration-300"
          />
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 text-center md:text-left space-y-6 ">
          <h2 className="text-3xl sm:text-4xl lg:text-3xl font-medium text-[#2E4168] text-center gap-80 ml-10">
          Easy access to your health records<br />

          </h2>
          <div className="flex flex-row gap-4 justify-center md:justify-center sm:pl-4 ">


          </div>
        </div>
      </div>
      {/* 4th section  */}
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-8 px-4 ">
  {/* Content Section */}
  <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
    <h2 className="text-3xl sm:text-4xl lg:text-3xl font-medium text-[#2E4168] text-center md:text-left">
    Reminders for medications and follow-up appointments<br />
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
      className="w-full max-h-[400px] md:max-h-[450px] rounded-lg shadow-lg object-cover transition-transform duration-300"
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
        
        <div className="w-full md:w-1/2 text-center md:text-left md:space-y-6 -space-y-10 ">
          <h2 className="text-[1.6rem] sm:text-4xl lg:text-3xl font-medium text-[#2E4168] text-start md:text-center gap-80 ml-10">
          Better Communication with your doctor<br />

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
    Digital prescriptions delivered instantly<br />
    </h2>
    <div className="flex flex-row gap-4 justify-center md:justify-start sm:pl-4">
      {/* Additional content or buttons can be added here */}
    </div>
  </div>

  {/* Image Section */}
  <div className="w-full md:w-1/2 flex justify-center md:justify-end">
    <img
     src={Patient4imges}
      alt="Doctor"
      className="w-full max-h-[300px] md:max-h-[350px] rounded-lg shadow-lg object-cover transition-transform duration-300"
    />
  </div>
</div>
<div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 px-4 my-12">
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex-re justify-center md:justify-start">
          <img
            src={DisachargeSummary}
            alt="Doctor"
            className="w-full max-h-[300px] md:max-h-[350px] rounded-lg shadow-lg object-cover transition-transform duration-300"
          />
        </div>

        {/* Content Section */}
        
        <div className="w-full md:w-1/2 text-center md:text-left space-y-6 ">
          <h2 className="text-3xl sm:text-4xl lg:text-3xl font-medium text-[#2E4168] text-center gap-80 md:ml-10">
          Reduced waiting times for discharge Summary<br />

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

      

    </div>
    
  );
};

export default Patient;
