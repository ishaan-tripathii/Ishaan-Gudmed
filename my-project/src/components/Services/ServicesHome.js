// ForHospitalHome.js
import React from 'react';
import HospitalFeatureCard from './HospitalFeatureCard';

import Ncamera from '../../img/TrasferingHospital.jpg';
import GudMedServices from './GudmedServices';
import GudMedSmartCamera from './GudMedSmartCamera';



const SercicesHome = () => {
    return (
        <div className="w-11/12 lg:w-11/12 xl:w-9/12 flex flex-col mx-auto py-1 space-y-10 bg-gray-50 rounded-lg shadow-md">
            {/* Hospital Feature Card */}
            
            <HospitalFeatureCard
                imageSrc={Ncamera}
               
                title="Transform Your Hospital into a Complete Smart Hospital with GudMed"
                description="GudMed offers a wide range of healthcare solutions designed to improve patient care and hospital efficiency. Our services include real-time prescription digitization, discharge summary automation, patient engagement tools, and AI-powered hospital management systems. Whether you’re a doctor seeking to reduce administrative tasks or a hospital aiming to streamline operations, GudMed has the tools you need to succeed."
                features={[
                    "Prescription Digitization",
                    "AI-Powered MRD Hospital Management",
                    "Discharge Summary Automation",
                    "Post-Care Patient Engagement",
                    "Lab and Pharmacy Integration",
                
                ]}
            />
            <GudMedSmartCamera></GudMedSmartCamera>
 <GudMedServices></GudMedServices>
           
           
        </div>
    );
};
export default SercicesHome;