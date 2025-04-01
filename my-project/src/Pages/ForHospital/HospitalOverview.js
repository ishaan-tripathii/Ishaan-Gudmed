import React from 'react';

const HospitalOverview = () => {
    return (
        <section className="py-10 px-4 sm:px-6 lg:px-16 bg-white rounded-lg shadow-md">
            <div className="max-w-4xl mx-auto space-y-6 text-center">
                {/* Title */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2E4168] md:gap-4 ">
                Transforming hospitals into advanced Smart Care with GudMed
                </h2>
                
                {/* First Paragraph */}
                <p className="text-sm sm:text-base md:text-lg text-[#2E4168] leading-relaxed font-medium">
                    In today's fast-evolving healthcare landscape, hospitals need to go beyond traditional systems to remain efficient, patient-centric, and operationally effective. 
                    <span className="text-[#2E4168] font-bold"> GudMed</span> helps your hospital transition into a smart hospital, where processes are automated, patient care is seamless, and data management is no longer dependent on outdated methods like archiving MRD files for years.
                </p>

                {/* Second Paragraph */}
                <p className="text-sm sm:text-base md:text-lg text-[#2E4168] leading-relaxed font-medium">
                    With GudMed, you can eliminate cumbersome manual record-keeping, improve patient outcomes, and streamline hospital operations—all through advanced, real-time technology solutions.
                </p>
            </div>
        </section>
    );
};

export default HospitalOverview;
