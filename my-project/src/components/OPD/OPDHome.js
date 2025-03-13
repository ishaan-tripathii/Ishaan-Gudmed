import React from 'react';
import HeaderOPD from './HeaderOPD';
import ProcessStepsOPD from './ProcessStepsOPD';
import BenefitsOPD from './BenefitsOPD';
import StepByStep from '../StepByStep';
import OPdStepBystep from './OPdStepBystep';

const OPDHome = () => (
    <div className="w-full p-8 space-y-8">
       
        <HeaderOPD />
       <OPdStepBystep></OPdStepBystep>
        <BenefitsOPD />
        <ProcessStepsOPD />
      
    </div>
);
export default OPDHome;