import React from 'react';
import IPDBenefitsSectionIPD from './IPDBenefitsSectionIPD';
import DischargeSummaryIPD from './DischargeSummaryIPD';
import SliderIPD from './SliderIPD'; // Import the slider component
import MedicalRecord from './MedicalRecord';

const IPDHomeIPD = () => {
  return (
    <div className="w-full relative overflow-hidden p-8">
      {/* Header Section for IPD Home */}
      <h1 className="md:text-5xl text-[1.9rem]  font-semibold text-center  text-[#2E4168] mb-6 tracking-wide">
    Welcome to GudMed's In-Patient Department (IPD)
</h1>
<p className="text-center text-lg  md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
Experience seamless care and efficient discharge processes with GudMed’s 
<br></br>10 Minutes Discharge Summary.
</p>

      {/* Hero/Image Slider Section for IPD Home */}
      <div className="w-full">
  <div className="h-full"> {/* Set height to full screen */}
    <SliderIPD />
  </div>
</div>


      {/* Discharge Summary Section for IPD */}
      <DischargeSummaryIPD />
      <MedicalRecord></MedicalRecord>
      {/* Benefits Section for IPD Services */}
      <IPDBenefitsSectionIPD />
     
    </div>
  );
};

export default IPDHomeIPD;
