// import React from 'react';
// import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
// import IPDdischarge1 from '../img/ipd 1 1-0 (1).jpg';
// import IPDdischarge2 from '../img/HCG_ipd_724409.pdf (1).png';

// const SliderIPD = () => {
//     return (
//         <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden shadow-lg">
//             <h2 className="text-lg font-semibold text-center mb-4 text-[#2E4168]">Compare Images</h2>
//             <div className="w-full" style={{ height: '100%' }}> {/* Full-height container */}
//                 <ReactCompareSlider
//                     itemOne={
//                         <ReactCompareSliderImage
//                             src={IPDdischarge1}
//                             alt="Before - IPD Discharge 1"
//                             style={{
//                                 objectFit: 'cover',
//                                 height: '100%',
//                                 width: '100%',
//                             }}
//                         />
//                     }
//                     itemTwo={
//                         <ReactCompareSliderImage
//                             src={IPDdischarge2}
//                             alt="After - IPD Discharge 2"
//                             style={{
//                                 objectFit: 'cover',
//                                 height: '100%',
//                                 width: '100%',
//                             }}
//                         />
//                     }
//                     className="rounded-lg"
//                     position={50} // Default position of the slider
//                 />
//             </div>
//         </div>
//     );
// };

// export default SliderIPD;
import React from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

import englishImage from '../img/HCG_ipd_724409.pdf.png';
import hindiImage from '../img/ipd 1 1_page-0002.jpg';
import IPDdischarge1 from '../img/ipd 1 1-0 (1).jpg';
import IPDdischarge2 from '../img/HCG_ipd_724409.pdf (1).png';

const ImageSection = ({ title, beforeImage, afterImage }) => (
    <div className="w-full md:w-1/2 p-4 rounded-lg shadow-lg bg-white">
        <h2 className="text-center text-xl md:text-2xl font-semibold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {title}
        </h2>
        <ReactCompareSlider
            itemOne={<ReactCompareSliderImage src={beforeImage} alt="Before" />}
            itemTwo={<ReactCompareSliderImage src={afterImage} alt="After" />}
            portrait={false}
            boundsPadding={0}
            position={50}
            changePositionOnHover={false}
            onlyHandleDraggable={false}
        />
    </div>
);

const SliderIPD = () => {
    return (
        <div className="container mx-auto p-6 lg:p-12 bg-white rounded-lg shadow-md">
            <h1 className="text-center text-2xl md:text-4xl font-bold mb-8 text-[#2E4168] font-sans">
            Discharge Summary
            </h1>
            <p className="text-center mb-6 text-lg md:text-2xl text-gray-700 font-medium font-sans">
                <span className="text-[#2E4168] font-semibold">Move the slider</span> left and right to see the magic!
            </p>

            <div className="flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-10 text-[#2E4168]">
                {/* Page 1 Comparison */}
                <ImageSection
                    title="Page 1"
                    beforeImage={IPDdischarge1}
                    afterImage={IPDdischarge2}
                />
                <ImageSection
                    title="Page 2"
                    beforeImage={hindiImage}
                    afterImage={englishImage}
                />
                {/* Page 2 Comparison */}
              
            </div>
        </div>
    );
};

export default SliderIPD;
