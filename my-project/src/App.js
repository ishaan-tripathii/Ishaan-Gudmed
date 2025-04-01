/* eslint-disable react/jsx-no-undef */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import ForHospital from "./Pages/ForHospital/ForHospitalHome";
import 'swiper/css';
import 'swiper/css/navigation';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'swiper/css/pagination';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer';
import AboutUsHome from './components/AboutUs/AboutUsHome';
import SercicesHome from './components/Services/ServicesHome';
import ContactInfoCard from './components/Contact/ContactInfoCard';
import ContactHome from './components/Contact/ContactHome';
import DoctorHome from './Doctor/DoctorHome';
import IPDHomeIPD from './IPD/IPD';
import OPDHome from './components/OPD/OPDHome';
import TeamHome from './components/Team/TeamHome';
import NewFooter from './components/NewFooter';
import Patient from './components/Patient';
import { PagesProvider } from './contexts/PagesContext';
import TechnologyPage from './components/TechnologyPage';
import AiPage from './components/AiPage';
import WhyGudmedUnique from './components/WhyGudmedUnique';

const App = () => {
  return (
    <PagesProvider>
      <div>
        <Navbar></Navbar>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hospital" element={<ForHospital />} />
          <Route path="/about" element={<AboutUsHome />} />
          <Route path="/services" element={<SercicesHome />} />
          <Route path="/contacts" element={<ContactHome />} />
          <Route path="/team" element={<TeamHome />} />
          <Route path="/doctors" element={<DoctorHome />} />
          <Route path="/hospital/ipd" element={<IPDHomeIPD />} />
          <Route path="/hospital/opd" element={<OPDHome />} />
          <Route path="/patients" element={<Patient />} />
          
        </Routes>
        {/* <Footer></Footer> */}
        <NewFooter></NewFooter>
      </div>
    </PagesProvider>
  );
};

export default App;
