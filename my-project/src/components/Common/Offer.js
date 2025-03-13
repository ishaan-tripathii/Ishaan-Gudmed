import React from 'react';
import OfferContentSection from './OfferContentSection';
import SectionImg from '../../img/section-img.png'; // Import the image correctly

const Offer = () => {
  return (
    <div className="mt-20 px-4 lg:px-0"> {/* Added padding for better spacing on smaller screens */}
      <OfferContentSection
        titleDesktop="How we are making Patient Smarter"
        titleMobile="How we are making Patient Smarter"
        imageSrc={SectionImg} // Using the imported image
        descriptionDesktop="Lorem ipsum dolor sit amet consectetur adipiscing elit. <br /> Praesent aliquet pretiumts."
        descriptionMobile="Lorem ipsum dolor sit amet consectetur adipiscing elit. Praesent aliquet pretiumts."
      />
    </div>
  );
};

export default Offer;
