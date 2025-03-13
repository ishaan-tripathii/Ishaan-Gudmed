import React from 'react';

const StepByStep = () => {
  const ArrowIconHorizontal = ({ size }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-${size} w-${size} text-[#2E4168]`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );

  const ArrowIconVertical = ({ size }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-${size} w-${size} text-[#2E4168]`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5 5m0 0l5-5m-5 5V6" />
    </svg>
  );

  const OPdStepBystep = () => {
    return (
      <div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:gap-32 gap-3 relative">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-gradient-to-r from-[#2E4168] to-[#4A5C84] text-white md:p-8 p-10 rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105">
              <div className="font-bold text-lg sm:text-xl lg:text-2xl mb-2">Step 1</div>
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 mt-4">
              Doctors continue to do what they do best—writing prescriptions with pen and paper.
            </p>
          </div>

          {/* Arrow between Step 1 and Step 2 */}
          <div className="lg:hidden flex justify-center items-center mt-4">
            <ArrowIconVertical size={16} />
          </div>
          <div className="hidden lg:flex justify-center items-center absolute top-1/3 left-[28%] transform -translate-y-1/2 font-medium">
            <ArrowIconHorizontal size={16} />
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-gradient-to-r from-[#2E4168] to-[#4A5C84] text-white md:p-8 p-10 rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105">
              <div className="font-bold text-lg sm:text-xl lg:text-2xl mb-2">Step 2</div>
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 mt-4">
              Simply scan the handwritten prescription using the GudMed Smart Camera.
            </p>
          </div>

          {/* Arrow between Step 2 and Step 3 */}
          <div className="lg:hidden flex justify-center items-center mt-4">
            <ArrowIconVertical size={24} />
          </div>
          <div className="hidden lg:flex font-medium justify-center items-center absolute top-1/3 left-[64%] transform -translate-y-1/2">
            <ArrowIconHorizontal size={24} />
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-gradient-to-r from-[#2E4168] to-[#4A5C84] text-white sm:p-8 p-10 rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105">
              <div className="font-bold text-lg sm:text-xl lg:text-2xl mb-2">Step 3</div>
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 mt-4">
              Press the spacebar, then enter—your digital prescription is ready to go!
            </p>
          </div>
        </div>
      </div>
    );
  };

  return <OPdStepBystep />;
};

export default StepByStep;
