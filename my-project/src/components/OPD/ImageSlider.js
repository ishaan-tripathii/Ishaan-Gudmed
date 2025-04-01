import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import images
const images = [
    require('../../img/opdimg1.png'),
    require('../../img/opdimg2.png'),
    require('../../img/opdimg3.png'),
    require('../../img/opdimg4.png'),
    require('../../img/opdimg5.png'),
    require('../../img/opdimg6.png'),
    require('../../img/opdimg7.png'),
    require('../../img/opdimg8.png'),
];

const ImageSlider = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 6,  // Show 4 images at once
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        centerMode: true,  // For centered images
        centerPadding: "10px",  // Reduced padding between images
    };

    return (
        <div className="mb-8">
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index} className="px-1">  {/* Reduced padding for image spacing */}
                        <img 
                            src={image} 
                            alt={`Slide ${index + 1}`} 
                            className="w-full h-100 object-contain rounded-lg"
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ImageSlider;
