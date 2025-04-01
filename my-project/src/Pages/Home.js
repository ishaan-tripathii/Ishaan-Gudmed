import React from 'react';

import Slider from '../components/Slider';
import HeroSection from '../components/HeroSection';
import AnimatedText from '../components/AnimatedText';

import FeaturesSection from '../components/Feature/FeaturesSection';
import ImageComparison from '../components/ImageCompare';
import OurClient from '../components/OurClient';
import KnowledgePartnerCardSection from '../components/KnowledgePartner/KnowldgePartnerCardSection';

import ComparisonSection from '../components/ComparisonSection';
import WhyGudmedUnique from '../components/WhyGudmedUnique';
import TechnologyPage from '../components/TechnologyPage';
import CounterSection from '../components/CounterSection';
import StepByStep from '../components/StepByStep';
import AiPage from '../components/AiPage';




const Home = () => {
  return (
    <div className="flex flex-col space-y-0 overflow-hidden"> {/* This removes any vertical gap between the components */}
    
      <Slider />
     
    
      <AnimatedText></AnimatedText>
      <StepByStep></StepByStep>
      <ImageComparison></ImageComparison>
     
     
     
      <CounterSection></CounterSection>

      <TechnologyPage></TechnologyPage>
      <AiPage></AiPage>
      {/* <FeaturesSection></FeaturesSection>

      <FeaturesSection></FeaturesSection> */}
      
      <ComparisonSection></ComparisonSection>
      <WhyGudmedUnique></WhyGudmedUnique>
     <KnowledgePartnerCardSection></KnowledgePartnerCardSection>
      

     
      <OurClient></OurClient>


     
    </div>
  );
};

export default Home;
