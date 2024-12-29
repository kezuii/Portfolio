import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const FeaturedWorks = () => {
  const [hoveredId, setHoveredId] = useState(null);

  const works = [
    { id: 1, title: 'Project One', image: "https://i.imgur.com/tnAQhWW.png", category: 'Web' },
    { id: 2, title: 'Project Two', image: "https://i.imgur.com/tnAQhWW.png", category: 'Design' },
    { id: 3, title: 'Project Three', image: "https://i.imgur.com/tnAQhWW.png", category: 'Motion' },
    { id: 4, title: 'Project Four', image: "https://i.imgur.com/tnAQhWW.png", category: 'Development' },
  ];
  const shakeAnimation = {
    x: [0, -2, 2, 0],
    y: [0, 2, -2, 0],
    filter: ['blur(0px)', 'blur(2px)', 'blur(1.5px)', 'blur(0px)'],
    transition: {
      duration: 0.2,
      ease: "easeInOut",
      times: [0, 0.2, 0.4, 1]
    }
  };

  const rippleAnimation = {
    scale: [1, 1.02, 0.98, 1],
    rotate: [0, 1, -1, 0],
    filter: [
      'blur(0px) distort(0)',
      'blur(2px) distort(2)',
      'blur(1px) distort(1)',
      'blur(0px) distort(0)'
    ],
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      times: [0, 0.33, 0.66, 1],
      repeat: Infinity,
      repeatType: "reverse"
    }
  };
  
  const handleHoverStart = async (id, controls) => {
    setHoveredId(id);
    await controls.start(rippleAnimation);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {works.map((work) => {
          const controls = useAnimation();
          return (
            <motion.div
              key={work.id}
              className="relative h-64 overflow-hidden rounded-2xl"
              onHoverStart={() => handleHoverStart(work.id, controls)}
              onHoverEnd={() => setHoveredId(null)}
            >
              <motion.div
                animate={controls}
                className="w-full h-full"
              >
                <motion.img
                  src={work.image}
                  alt={work.title}
                  className="w-full h-full object-cover"
                  animate={{
                    scale: hoveredId === work.id ? 1.1 : 1,
                    x: hoveredId === work.id ? 0 : 0,
                    y: hoveredId === work.id ? 0 : 0,
                  }}
                  transition={{ 
                    duration: 0.6,
                  }}
                />
              </motion.div>
              
              <motion.div 
                className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredId === work.id ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.span 
                  className="text-white text-sm mb-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ 
                    y: hoveredId === work.id ? 0 : 20,
                    opacity: hoveredId === work.id ? 1 : 0 
                  }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  {work.category}
                </motion.span>
                
                <motion.h3 
                  className="text-white text-2xl font-bold"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ 
                    y: hoveredId === work.id ? 0 : 20,
                    opacity: hoveredId === work.id ? 1 : 0 
                  }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  {work.title}
                </motion.h3>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default FeaturedWorks;