import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import local images from your assets folder
import hero1 from '../assets/images/hero1.jpg';
import hero2 from '../assets/images/hero2.jpg';
import hero3 from '../assets/images/hero3.jpg';
import hero4 from '../assets/images/hero4.jpg';
import hero5 from '../assets/images/hero5.jpeg';

const Hero = () => {
    const images = [hero1, hero2, hero3, hero4, hero5];
    const [current, setCurrent] = useState(0);

    // Auto-slider logic
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent(prev => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <section className="w-full overflow-hidden bg-white">
            <div className="max-w-7xl mx-auto  flex flex-col md:flex-row items-center gap-8">
                {/* Text Section */}
                <motion.div
                    className="flex-1 text-center md:text-left"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl bg-red-800 font-bold text-green-800 mb-4 mt-4">
                        Welcome to Help-Sphere
                    </h1>
                    <p className="text-lg text-gray-600 mb-0 ">
                        "HelpSphere — Building a Circle of Compassion and Contribution."
                    </p>
                    <motion.a
                        href="/login"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block bg-yellow-600 text-red-600 px-6 py-3 rounded-full font-semibold shadow-md hover:bg-green-700 transition"
                    >
                        Get Started
                    </motion.a>

                </motion.div>

                {/* Auto-Slider Image Section */}
                <div className="flex-1 flex justify-center items-center relative w-full h-[300px] md:h-[350px] lg:h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={images[current]}
                            src={images[current]}
                            alt={`hero-${current}`}
                            className="w-full max-w-md h-full object-cover rounded-lg shadow-lg"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.6 }}
                            style={{ width: '100%', height: '70vh', objectFit: 'fill', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', marginBottom: '20px', marginTop: '0px' }}
                        />
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default Hero;
