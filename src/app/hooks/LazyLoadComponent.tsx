// LazyLoadComponent.js
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const LazyLoadComponent = ({ children }: { children: React.ReactNode }) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    const variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.9 } },
    };

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        });

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <motion.div ref={ref} variants={variants} initial="hidden" animate={isVisible ? "visible" : "hidden"}>
            {children}
        </motion.div>
    );
};

export default LazyLoadComponent;
