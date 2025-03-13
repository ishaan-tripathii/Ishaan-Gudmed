import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import Login from './pages/Login.js';
import AdminHome from './pages/AdminHome.js';
import HomePageManager from './pages/HomePageManager.js';
import AboutUsPageManager from './pages/AboutUsPageManager.js';
import DoctorsPageManager from './pages/DoctorsPageManager.js';
import HospitalPageManager from './pages/HospitalPageManager.js';
import PatientsPageManager from './pages/PatientsPageManager.js';
import ServicesPageManager from './pages/ServicesPageManager.js';
import TeamPageManager from './pages/TeamPageManager.js';
import  SliderManager from "./components/Home/SliderManager.js"
import TechnologyPageManager from "./pages/TechnologyAdminPage.js"
import AiAdminPage from './pages/AiAdminPage.js';
import OurClientManager from "./pages/AdminClientPage.js"
import AdminKnowledgePartnerPage from "./pages/AdminKnowledgePartnerPage.js"
import ComparisonSectionManager from "./pages/AdminComparisonPage.js"
import CounterSectionManager from "./pages/AdminCounterPage.js"
import StepByStepManager from "./pages/AdminStepByStepPage.js"
import AnimatedTextManager from "./pages/AdminAnimatedTextPage.js"
import ImageComparisonManager from "./pages/AdminImageComparisonPage.js"

import AdminFooterPage from "./pages/AdminFooterPage.js";


// Placeholder managers for each component










const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AdminHome />} />
        <Route path="/admin/home" element={<HomePageManager />} />
        <Route path="/admin/about-us" element={<AboutUsPageManager />} />
        <Route path="/admin/doctors" element={<DoctorsPageManager />} />
        <Route path="/admin/hospital" element={<HospitalPageManager />} />
        <Route path="/admin/patients" element={<PatientsPageManager />} />
        <Route path="/admin/services" element={<ServicesPageManager />} />
        <Route path="/admin/team" element={<TeamPageManager />} />

        {/* Home Page Component Managers */}
        <Route path="/admin/home/slider" element={<SliderManager />} />
        <Route path="/admin/home/animated-text" element={<AnimatedTextManager />} />
        <Route path="/admin/home/step-by-step" element={<StepByStepManager />} />
        <Route path="/admin/home/image-comparison" element={<ImageComparisonManager />} />
        <Route path="/admin/home/counter-section" element={<CounterSectionManager />} />
        <Route path="/admin/home/technology-page" element={<TechnologyPageManager />} />
        <Route path="/admin/home/ai-section" element={<AiAdminPage />} />
        <Route path="/admin/home/comparison-section" element={<ComparisonSectionManager />} />
        {/* <Route path="/admin/home/why-gudmed-unique" element={<WhyGudmedUniqueManager />} /> */}
        <Route path="/admin/home/why-gudmed-unique" element={<AiAdminPage/>} />
        <Route path="/admin/home/knowledge-partner-card-section" element={<AdminKnowledgePartnerPage />} />
        <Route path="/admin/home/our-client" element={<OurClientManager />} />
        <Route path="/admin/home/our-footer" element={<AdminFooterPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
