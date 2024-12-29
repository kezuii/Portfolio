import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const CircularFillButton = ({ position = "below", topbarOffset = 0, hasScrolled = false }) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [fillPosition, setFillPosition] = useState({ x: 0, y: 0 });
  const [color, setColor] = useState("white");
  const prevScrolledRef = useRef(hasScrolled);

  useEffect(() => {
    const isNearTop = window.scrollY <= 100;

    if (prevScrolledRef.current !== hasScrolled && isNearTop) {
        if (hasScrolled) {
        // Get the center point of the button for the fill effect
        const rect = buttonRef.current?.getBoundingClientRect();
        if(rect) {
            setFillPosition({
                x: rect.width - 1, // Position at the right edge
                y: rect.height - 1 // Position at the bottom edge
            });
        }
        setIsAnimating(true);
        setTimeout(() => {
          setIsAnimating(false);
          setColor("black");
        }, 500);
        } else {
          setIsAnimating(true);
          setTimeout(() => {
            setIsAnimating(false);
            setColor("white");
          }, 500);
        }
        prevScrolledRef.current = hasScrolled;
    }
  }, [position, hasScrolled]);

  return (
    <div className="relative">
      <motion.div
      ref={buttonRef}
      className={`${color === 'black' ? 'bg-black' : 'bg-white'} text-black px-6 py-3 rounded-full relative z-10 overflow-hidden cursor-pointer`}
      initial={{ x: 0 }}
      animate={{ x: position === "above" ? -topbarOffset : 0 }}
      transition={{ duration: 0.3 }}
      >
        {/* Content */}
        <motion.div 
          className="relative z-30"
          animate={{ 
            color: hasScrolled || position === "above" ? "white" : "black"
          }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-lg font-semibold">a button</p>
        </motion.div>

        {/* Circular Fill Effect */}
        <motion.div
            initial={false}
            animate={{
                scale: isAnimating ? 40 : 0,
                opacity: isAnimating ? 1 : 0,
            }}
            transition={{
                duration: 0.5,
                ease: "easeOut"
            }}
            style={{
                position: 'absolute',
                top: fillPosition.y - 5,
                left: fillPosition.x - 5,
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                color: 'white',
                backgroundColor: hasScrolled ? 'black' : 'white',
                transformOrigin: 'center',
                zIndex: 10,
            }}
        />
        </motion.div>

        {/* Circle Button */}
          <motion.div
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="bg-black text-white flex items-center cursor-pointer justify-center h-[52px] w-[52px] rounded-full absolute top-0 right-0 z-40"
          initial={{ opacity: 0, x: 0 }}
          animate={{ 
              opacity: position === "above" ? 1 : 0,
              x: position === "above" ? 0 : 0,
              rotate: position === "above" ? 0 : 45,
          }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-xl">⬆</p>
        </motion.div>
    </div>
  );
};

const Example = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <CircularFillButton position="below" topbarOffset={100} />
    </div>
  );
};

export default CircularFillButton;