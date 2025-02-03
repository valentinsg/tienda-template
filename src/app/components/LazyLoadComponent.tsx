import React from 'react';
import { motion } from 'framer-motion';
import useLazyLoad from '../hooks/useLazyLoad';

const LazyLoadComponent = ({ children }: { children: React.ReactNode }) => {
  const { ref, isVisible } = useLazyLoad();

  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9 } },
  };

  return (
    <motion.div ref={ref} variants={variants} initial="hidden" animate={isVisible ? "visible" : "hidden"}>
      {children}
    </motion.div>
  );
};

export default LazyLoadComponent;
