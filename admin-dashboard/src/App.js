import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext.js";
import Login from "./pages/Login.js";
import AdminHome from "./pages/AdminHome.js";
import HomePageManager from "./pages/HomePageManager.js";
import SliderManager from "./components/Home/SliderManager.js";
import AnimatedTextManager from "./pages/AdminAnimatedTextPage.js";
import StepByStepManager from "./pages/AdminStepByStepPage.js";
import ImageComparisonManager from "./pages/AdminImageComparisonPage.js";
import CounterSectionManager from "./pages/AdminCounterPage.js";
import TechnologyPageManager from "./pages/TechnologyAdminPage.js";
import AiPageList from "./pages/AdminAiPage.js";
import ComparisonSectionManager from "./pages/AdminComparisonPage.js";
import WhyGudMedisUnique from "./pages/WhyGudMedisUniquePage.js";
import AdminKnowledgePartnerPage from "./pages/AdminKnowledgePartnerPage.js";
import OurClientManager from "./pages/AdminClientPage.js";
import AdminFooterPage from "./pages/AdminFooterPage.js";
import AboutUs from "./pages/AboutUs/AboutUsHome.js";
import AboutUsContent from "./pages/AboutUs/AboutUsContent.js";
import AboutUsAcievment from "./pages/AboutUs/AboutUsAcievment.js";
import AboutUsLastSection from "./pages/AboutUs/AboutusLastSection.js";
import HospitalPageManager from "./pages/Hospital/HospitalPageManager.js";
import AdminHospitalPage from "./pages/Hospital/AdminHospitalPage.js";
import AdminICUAutomationPage from "./pages/Hospital/AdminICUAutomationPage.js";
import AdminSmartCarePage from "./pages/Hospital/AdminSmartCarePage.js";
import AdminMedPage from "./pages/Hospital/AdminMedPage.js";
// Loading Component
const Loading = () => <div className="flex items-center justify-center h-screen">Loading...</div>;

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/home"
          element={
            <ProtectedRoute>
              <HomePageManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/home/slider"
          element={
            <ProtectedRoute>
              <SliderManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/home/animated-text"
          element={
            <ProtectedRoute>
              <AnimatedTextManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/home/step-by-step"
          element={
            <ProtectedRoute>
              <StepByStepManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/home/image-comparison"
          element={
            <ProtectedRoute>
              <ImageComparisonManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/home/counter-section"
          element={
            <ProtectedRoute>
              <CounterSectionManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/home/technology-page"
          element={
            <ProtectedRoute>
              <TechnologyPageManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/home/ai-page"
          element={
            <ProtectedRoute>
              <AiPageList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/home/comparison-section"
          element={
            <ProtectedRoute>
              <ComparisonSectionManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/home/why-gudmed-unique"
          element={
            <ProtectedRoute>
              <WhyGudMedisUnique />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/home/knowledge-partner-card-section"
          element={
            <ProtectedRoute>
              <AdminKnowledgePartnerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/home/our-client"
          element={
            <ProtectedRoute>
              <OurClientManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/home/our-footer"
          element={
            <ProtectedRoute>
              <AdminFooterPage />
            </ProtectedRoute>
          }
        />
        {/* About Us Routes */}
        <Route
          path="/admin/about-us"
          element={
            <ProtectedRoute>
              <AboutUs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/about-us/about-content"
          element={
            <ProtectedRoute>
              <AboutUsContent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/about-us/achievements"
          element={
            <ProtectedRoute>
              <AboutUsAcievment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/about-us/join-section"
          element={
            <ProtectedRoute>
              <AboutUsLastSection />
            </ProtectedRoute>
          }
        />
        {/* Hospital Routes */}
        <Route
          path="/admin/hospital"
          element={
            <ProtectedRoute>
              <HospitalPageManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/hospital/manage"
          element={
            <ProtectedRoute>
              <AdminHospitalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/hospital/icu"
          element={
            <ProtectedRoute>
              <AdminICUAutomationPage />
            </ProtectedRoute>
          }
        />
         <Route
          path="/admin/hospital/smart-care"
          element={
            <ProtectedRoute>
              <AdminSmartCarePage />
            </ProtectedRoute>
          }
        />
         <Route
          path="/admin/hospital/mrd"
          element={
            <ProtectedRoute>
             <AdminMedPage></AdminMedPage>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} /> {/* Default to login */}
        <Route path="*" element={<div>404 - Page Not Found</div>} /> {/* Catch-all route */}
      </Routes>
    </AuthProvider>
  );
};

export default App;