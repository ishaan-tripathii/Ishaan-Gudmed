// src/components/KnowledgePartnerCardSection.jsx
import React from "react";
import useDynamicData from "../hooks/useDynamicData";
import OfferContentSection from "../Common/OfferContentSection";

const KnowledgePartnerCardSection = () => {
  const defaultData = {
    partners: [],
    accreditations: [],
    twoFactorsImage: "",
    titles: { weAre: "We Are !", accredited: "Accredited", knowledgePartners: "Our Knowledge Partners" },
  };
  const { data, loading } = useDynamicData("/knowledge-partners", defaultData, "knowledgePartnersUpdated");

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="container mx-auto px-4 md:py-12 w-11/12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start text-center lg:text-left">
        {/* We Are Section */}
        <div className="text-[#2E4168] md:space-y-4 -space-y-5">
          <OfferContentSection
            titleDesktop={data.titles.weAre}
            titleMobile={data.titles.weAre}
            className="text-xl md:text-lg lg:text-base leading-tight"
          />
          <img
            src={data.twoFactorsImage}
            alt="Two Factors"
            className="w-full max-w-xl object-contain transition-all duration-300 transform md:mt-4 md:ml-16 lg:ml-0"
          />
        </div>

        {/* Accredited Section */}
        <div className="xl:space-y-4 lg:-space-y-5 md:space-y-2 -space-y-7 text-[#2E4168]">
          <OfferContentSection
            titleDesktop={data.titles.accredited}
            titleMobile={data.titles.accredited}
          />
          <div className="flex justify-center lg:justify-end gap-4">
            {data.accreditations.map((item, index) => (
              <div key={index} className="text-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-28 h-28 mx-auto object-contain rounded-lg"
                />
                <p className="mt-2 text-xs md:text-sm lg:text-xs xl:text-base font-semibold">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Knowledge Partners Section */}
        <div className="text-[#2E4168] mx-auto xl:space-y-4 lg:-space-y-12 md:space-y-2 -space-y-7">
          <OfferContentSection
            titleDesktop={data.titles.knowledgePartners}
            titleMobile={data.titles.knowledgePartners}
            className="text-7xl md:text-base lg:text-xs xl:text-base font-bold text-center mx-auto"
          />
          <div className="flex justify-center gap-4">
            {data.partners.map((card, index) => (
              <div key={index} className="text-center">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-28 h-28 mx-auto object-contain rounded-lg"
                />
                <p className="mt-2 text-xs md:text-sm lg:text-xs xl:text-base font-semibold">
                  {card.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgePartnerCardSection;