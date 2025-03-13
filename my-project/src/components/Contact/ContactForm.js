import React, { useState } from 'react';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-50 to-white p-8 rounded-lg shadow-lg mt-8">
            <h2 className="text-3xl font-bold text-center text-[#2E4168] mb-6">Get in Touch</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:ring focus:ring-[#2E4168] outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:ring focus:ring-[#2E4168] outline-none"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:ring focus:ring-[#2E4168] outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:ring focus:ring-[#2E4168] outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Message</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring focus:ring-[#2E4168] outline-none"
                        rows="5"
                        required
                    ></textarea>
                </div>

                <div className="text-center">
                    <button
                        type="submit"
                        className="px-10 py-3 bg-[#2E4168] text-white rounded-full font-bold hover:bg-[#243c6c] transition duration-300"
                    >
                        Send Message
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;
