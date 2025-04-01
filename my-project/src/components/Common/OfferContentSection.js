import React, { useEffect, useState } from 'react';

const OfferContentSection = ({
  titleDesktop = "",
  titleMobile = "",
  imageSrc = "",
  descriptionDesktop = "",
  descriptionMobile = ""
}) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Effect to update the state based on the window size
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="text-center mb-12">
      {/* Conditionally render title based on screen size */}
      <h1
        className={`font-bold leading-tight ${isDesktop ? 'text-3xl' : 'text-[1.6rem]'}`} // Conditional text size
        dangerouslySetInnerHTML={{
          __html: isDesktop ? titleDesktop : titleMobile // Conditional content
        }}
      />

      {/* Conditionally render image if imageSrc is passed */}
      {imageSrc && (
        <div className="flex justify-center my-6">
          <img src={imageSrc} alt="section-img" className="max-w-full h-auto" />
        </div>
      )}

      {/* Conditionally render description based on screen size */}
      <p
        className="text-gray-500 mt-6 w-full"
        dangerouslySetInnerHTML={{
          __html: isDesktop ? descriptionDesktop : descriptionMobile // Conditional content
        }}
      />
    </div>
  );
};

export default OfferContentSection;
