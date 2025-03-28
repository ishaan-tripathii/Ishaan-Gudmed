import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.js';
import Login from './pages/Login.js';
import AdminHome from './pages/AdminHome.js';
import HomePageManager from './pages/HomePageManager.js';
import SliderManager from './components/Home/SliderManager.js';
import AnimatedTextManager from './pages/AdminAnimatedTextPage.js';
import StepByStepManager from './pages/AdminStepByStepPage.js';
import ImageComparisonManager from './pages/AdminImageComparisonPage.js';
import CounterSectionManager from './pages/AdminCounterPage.js';
import TechnologyPageManager from './pages/TechnologyAdminPage.js'; // Ensure this matches the file
import AiPageList from './pages/AdminAiPage.js';
import ComparisonSectionManager from './pages/AdminComparisonPage.js';
import WhyGudMedisUnique from './pages/WhyGudMedisUniquePage.js';
import AdminKnowledgePartnerPage from './pages/AdminKnowledgePartnerPage.js';
import OurClientManager from './pages/AdminClientPage.js';
import AdminFooterPage from './pages/AdminFooterPage.js';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AdminHome />} />
        <Route path="/admin/home" element={<HomePageManager />} />
        <Route path="/admin/home/slider" element={<SliderManager />} />
        <Route path="/admin/home/animated-text" element={<AnimatedTextManager />} />
        <Route path="/admin/home/step-by-step" element={<StepByStepManager />} />
        <Route path="/admin/home/image-comparison" element={<ImageComparisonManager />} />
        <Route path="/admin/home/counter-section" element={<CounterSectionManager />} />
        <Route path="/admin/home/technology-page" element={<TechnologyPageManager />} />
        <Route path="/admin/home/ai-page" element={<AiPageList />} />
        <Route path="/admin/home/comparison-section" element={<ComparisonSectionManager />} />
        <Route path="/admin/home/why-gudmed-unique" element={<WhyGudMedisUnique />} />
        <Route path="/admin/home/knowledge-partner-card-section" element={<AdminKnowledgePartnerPage />} />
        <Route path="/admin/home/our-client" element={<OurClientManager />} />
        <Route path="/admin/home/our-footer" element={<AdminFooterPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;