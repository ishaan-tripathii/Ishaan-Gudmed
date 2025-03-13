// ForHospitalHome.js
import React from 'react';
import HospitalFeatureCard from './HospitalFeatureCard';

import Ncamera from '../../img/HospitalRevon.jpeg';
import GudmedICUAutomation from './IcuAutomation';
import HospitalOverview from './HospitalOverview';
import BenefitsList from './BenefitsList';
import GudMedFeatures from './GudMedFeatures';
import CTASection from './CTASection';


const ForHospitalHome = () => {
    return (
        <div className="w-11/12 lg:w-9/12 xl:w-8/12 flex flex-col mx-auto py-10 space-y-10  bg-gray-50 rounded-lg shadow-md">
            {/* Hospital Feature Card */}
            
            
            <HospitalFeatureCard
                imageSrc={Ncamera} 
                title="Transform Your Hospital into a Complete Smart Hospital with GudMed"
                description="In today's fast-evolving healthcare landscape, hospitals need to go beyond traditional systems to remain efficient, patient-centric, and operationally effective. GudMed helps your hospital transition into a smart hospital, where processes are automated, patient care is seamless, and data management is no longer dependent on outdated methods like archiving MRD files for years.
With GudMed, you can eliminate cumbersome manual record-keeping, improve patient outcomes, and streamline hospital operations—all through advanced, real-time technology solutions."
                features={[
                    "Real-Time Prescription and Discharge Summary Digitization",
                    "Digital Patient Records and Document Management",
                    "AI-Powered Analytics and Operational Efficiency",
                    "Seamless Integration with Labs and Pharmacies",
                    "Post-Care Engagement and Automated Follow-Ups",
                
                ]}
            />

            {/* Gudmed ICU Automation Section */}
            <GudmedICUAutomation />
            <HospitalOverview />
            <BenefitsList/>
            <GudMedFeatures />
            <CTASection/>
           
        </div>
    );
};
export default ForHospitalHome;