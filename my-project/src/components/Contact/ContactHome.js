// ContactHome.js
import React from 'react';
import ContactHeader from './ContactHeader';
import ContactInfoCard from './ContactInfoCard';
import ContactForm from './ContactForm';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ContactHome = () => (
    <section className="min-h-screen bg-white py-10">
        {/* Header Section */}
        <ContactHeader />

        {/* Contact Info Section
        <div className="flex flex-col md:flex-row items-center justify-around px-6 md:px-10 py-10 space-y-8 md:space-y-0 md:space-x-6">
            <ContactInfoCard 
                icon={<FaMapMarkerAlt className="text-blue-600" />} 
                title="Our Address" 
                content="MM tower, Plot No 8 & 9, Udyog Vihar-IV, Sec 18, Gurugram -122017" 
            />
            <ContactInfoCard 
                icon={<FaPhoneAlt className="text-blue-600" />} 
                title="Our Contacts" 
                content="Phone: +91-9999196828" 
            />
            <ContactInfoCard 
                icon={<FaEnvelope className="text-blue-600" />} 
                title="Email Us" 
                content="Email: cs@gudmed.in" 
            />
        </div> */}

        {/* Unified Frame for Contact Form and Google Map */}
        <div className="max-w-7xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex flex-col md:flex-row space-y-10 md:space-y-0 md:space-x-10">
                {/* Contact Form Section */}
                <div className="flex-1 p-6 bg-gradient-to-r from-blue-50 to-white rounded-lg">
                    <h2 className="text-2xl font-bold text-[#2E4168] text-center mb-4">
                        We’d Love to Hear from You
                    </h2>
                    <p className="text-[#2E4168] text-center mb-6">
                        Whether you have a question or need assistance, we’re here to help.
                    </p>
                    <ContactForm />
                </div>

                {/* Google Map Section */}
                <div className="flex-1 p-6 rounded-lg text-gray-700">
                    <h2 className="text-xl font-semibold text-[#2E4168] mb-4">Our Location</h2>
                    <hr className="border-t-2 w-12 border-[#2E4168] mb-6" />
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.6257960733506!2d77.078248!3d28.490814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19409c876b99%3A0xcbb1f17f595e75f3!2sGudMed!5e0!3m2!1sen!2sin!4v1729791743072!5m2!1sen!2sin"
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="GudMed Google Map"
                        className="rounded-lg shadow-md text-[#2E4168]"
                    ></iframe>
                    <div className="flex items-center space-x-4 mt-4">
                        <i className="fas fa-map-marker-alt text-[#2E4168] text-lg"></i>
                        <Link
                            to="https://maps.app.goo.gl/9ALKd9Jb18nmeAa68"
                            target="_blank"
                            className="text-lg text-[#2E4168] underline hover:text-[#2E4168] transition-colors duration-300"
                        >
                            View on Google Maps
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default ContactHome;

