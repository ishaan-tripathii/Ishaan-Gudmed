import React from 'react';
import TeamHeader from './TeamHeader'; // Corrected path
import TeamMemberCard from './TeamMemberCard'; // Corrected path
import TeamHighlights from './TeamHighlights'; // Corrected path
import TeamAdvisors from './TeamAdvisors'; // Corrected path
import TeamStats from './TeamStats'; // Corrected path
import DoctorsCarousel from './CaroselSmall';
// import FounderImage from '../img/Atul_tiwari.jpg'; // Ensure img is inside src
// import COOImage from '../img/Dhruv_sharma.jpg'; // Ensure img is inside src
// import CTOImage from '../img/Ashish_cto.jpg'; // Ensure img is inside src

const teamMembers = [
    {
        // image: FounderImage,
        title: "Founder",
        name: "Mr. Atul Tiwari",
        description: "Atul is a Startup Entrepreneur with 18+ years of tech and sales experience, co-founding 3 companies including ventures with Birla and Tata.",
    },
    {
        // image: COOImage,
        title: "COO",
        name: "Mr. Dhruv Sharma",
        description: "Dhruv has over 10 years of experience in operations, contributing to two successful startups, and expertise in IoT engineering and design.",
    },
    {
        // image: CTOImage,
        title: "CTO",
        name: " Mr. Ashish Shukla",
        description: "With 16+ years of experience, Ashish is certified in PMP, Scrum, and Oracle, and has developed solutions for warehouse processes using technology.",
    },
];

const TeamHome = () => {
    return (
        <section className="bg-gray-100 p-8 rounded-lg shadow-md mb-8">
            {/* Header */}
            <TeamHeader />

            {/* Highlights */}
            <TeamHighlights />

            {/* Key Team Members */}
            <h2 className="text-3xl font-semibold text-center text-[#2E4168] mb-8">Key Team Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10m text-[#2E4168] ">
                {teamMembers.map((member, index) => (
                    <TeamMemberCard
                        key={index}
                       
                        title={member.title}
                        name={member.name}
                        description={member.description}
                    />
                ))}
            </div>

            {/* Advisors */}
            {/* <TeamAdvisors /> */}
           <DoctorsCarousel></DoctorsCarousel>

            {/* Team Stats */}
            {/* <TeamStats /> */}
        </section>
    );
};

export default TeamHome;
