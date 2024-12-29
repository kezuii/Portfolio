import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import AnimatedHeaderText from './AnimatedHeaderText';
const FeaturedWorks = ({ works, position }: { works: any[], position: string }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [animationComplete, setAnimationComplete] = useState<{ [key: number]: boolean }>({});

  const controls = useAnimation();

  useEffect(() => {
    console.log(position);
  }, [position]);
  
  const shakeAnimation = {
    x: [0, -1, 1, 0],
    y: [0, 1, -1, 0],
    filter: ['blur(0px)', 'blur(3px)', 'blur(3px)', 'blur(0px)'],
    transition: {
      duration: 0.1,
      ease: "easeInOut",
      times: [0, 0.1, 0.5, 1]
    }
  };
  const handleHoverStart = async (id: number, controls: any) => {
    setHoveredId(id);
    await controls.start(shakeAnimation);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = event;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width;
    const y = (clientY - top) / height;
    setTimeout(() => {
      setMousePosition({ x: x/2, y: y/2 });
    }, 100);
  };

  return (
    <div className="w-full py-4">
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8 h-fit"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {works.map((work, index) => {
          return (
            <div key={work.id} className='flex flex-col gap-2'>
                <motion.div
                className="relative aspect-[2/1] overflow-hidden"
                initial={{
                    transform: `perspective(1000px) rotateX(${index % 2 == 0 ? 15 : -15}deg) rotateY(${index % 2 == 0 ? 15 : -15}deg)`,
                }}
                animate={{
                    transform: `perspective(1000px) rotateX(0deg) rotateY(0deg)`,
                    transition: {
                    transform: {
                        delay: 0.2,
                        duration: 1.5,
                        ease: "easeOut"    
                    },
                    }
                }}
                onHoverStart={() => handleHoverStart(work.id, controls)}
                onHoverEnd={() => setHoveredId(null)}
                >
                    <motion.div
                        animate={controls}
                        className="w-full h-full origin-bottom-right rounded-2xl overflow-hidden"
                    >
                        <motion.img
                        src={work.image}
                        alt={work.title}
                        onMouseMove={handleMouseMove}
                        className="w-full h-full object-cover rounded-2xl"
                        style={{
                            transformOrigin: animationComplete[work.id] 
                            ? `${mousePosition.x * 100}% ${mousePosition.y * 100}%`
                            : index % 2 === 0 && position === "below" ? '0% 100%' 
                            : position === "below" ? '100% 100%'
                            : index % 2 === 0 ? '0% 0%' : '100% 0%',
                            borderRadius: '1rem' // Explicit border-radius as backup
                        }}
                        initial={{
                            scale: 0.3,
                            opacity: 0,
                            x: index % 2 === 0 ? -50 : 50,
                            y: -50
                        }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            x: 0,
                            y: 0,
                            transition: {
                            duration: 1.2,
                            ease: [0.16, 1, 0.3, 1]
                            }
                        }}
                        onAnimationComplete={() => {
                            setAnimationComplete(prev => ({ ...prev, [work.id]: true }));
                        }}
                        whileHover={{
                            scale: 1.07,
                            transition: { 
                            duration: 0.4,
                            ease: [0.33, 1, 0.68, 1]
                            }
                        }}
                        />
                    </motion.div>
                </motion.div>
                
                <motion.span
                className="text-black text-2xl font-regular m-4 mb-0"
                initial={{ x: -30, opacity: 0 }} // Start position (above the screen)
                animate={{ x: 0, opacity: 1 }}  // Final position (at its normal place)
                transition={{ delay: 0.4, duration: 0.3 }} // Delay of 0.5 seconds and animation duration of 0.5 seconds
                >
                    {work.description}
                </motion.span>
                <motion.span
                className="text-black text-2xl font-semibold m-4 mt-0"
                initial={{ opacity: 0 }} // Start position (above the screen)
                animate={{ opacity: 1 }}  // Final position (at its normal place)
                transition={{ delay: 0.6, duration: 0.3 }} // Delay of 0.5 seconds and animation duration of 0.5 seconds
                >
                  <AnimatedHeaderText 
                    text={work.title} 
                    position={"top"} 
                    className="my-0" 
                    classNameText="text-lg font-semibold" 
                    fontSize="24px"
                    delayChildren={0.2}
                  />
                </motion.span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default FeaturedWorks;