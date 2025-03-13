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

const App = () => {
  
  return (
    <div>
      <Navbar></Navbar>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hospital" element={<ForHospital />} />
        <Route path="/about" element={<AboutUsHome></AboutUsHome>} />
        <Route path="/services" element={<SercicesHome></SercicesHome>}></Route>
        <Route path="/contacts" element={<ContactHome></ContactHome>}></Route>
        <Route path="/team" element={<TeamHome></TeamHome>}></Route>
        <Route path="/doctors" element={<DoctorHome></DoctorHome>}></Route>
        <Route path="/hospital/ipd" element={<IPDHomeIPD></IPDHomeIPD>}></Route>
        <Route path="/hospital/opd" element={<OPDHome></OPDHome>}></Route>
        <Route path="/patients" element={<Patient></Patient>}></Route>
      </Routes>
      {/* <Footer></Footer> */}
      <NewFooter></NewFooter>
    </div>
  );
};

export default App;
