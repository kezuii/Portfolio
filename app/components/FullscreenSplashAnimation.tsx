import { useEffect, useRef, useState } from 'react';
import { motion, useAnimate, useInView } from 'framer-motion';
import CircularFillButton from './CircularFillButton';
import RippleEffect from './RippleEffect';
import WaterDistortion from './WaterDistortion';

const FullscreenSplashAnimation = () => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [scope, animate] = useAnimate();
  const [absolutePosition, setAbsolutePosition] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState("in-view");
  const isInView = useInView(triggerRef, {
    once: false, // Set to true if you want it to trigger only once
    amount: 0.1 // Trigger when 10% of the element is in view
  });
  const lastCallTimeRef = useRef(0);

  const imgHeight = '60vh';
  const animationDuration = 0.3;

  const checkPosition = () => {
    const now = Date.now();
    if (now - lastCallTimeRef.current < 10) {
      return;
    }
    lastCallTimeRef.current = now;

    const threshold = 20;
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      if (rect.bottom < 0) {
        setPosition("above");
      } else if (rect.top + threshold > window.innerHeight) {
        setPosition("below");
        setAbsolutePosition(false);
      } else {
        setPosition("in-view");
        setAbsolutePosition(true);
      }
    }
  };

  // Watch for changes in isInView
  useEffect(() => {
    const now = Date.now();
    if (now - lastCallTimeRef.current < 10) {
      return;
    }
    lastCallTimeRef.current = now;

    setAbsolutePosition(isInView);
    console.log(isInView)
  }, [isInView]);


  useEffect(() => {
    const handleScroll = () => {
      checkPosition();
      if (window.scrollY === 0 || position === "above") {
        setHasScrolled(false);
        // Split into separate animation sequences
        animate(scope.current, { scale: 1.05 }, { type: "spring", bounce: 0.5 });
        animate(scope.current, { paddingTop: 0 }, { type: "spring", bounce: 0.5 });
        animate(scope.current, { paddingBottom: 0 }, { type: "spring", bounce: 0.5 });
        animate("div", { borderRadius: 0 }, { type: "spring", bounce: 0.5 });
      } else if (!hasScrolled) {
        setHasScrolled(true);
        // Split into separate animation sequences
        animate(scope.current, { scale: 1 }, { type: "spring", stiffness: 200, damping: 10, mass: 1 });
        animate(scope.current, { paddingTop: 120 }, { type: "spring", stiffness: 200, damping: 10, mass: 1 });
        animate(scope.current, { paddingBottom: 10 }, { type: "spring", stiffness: 200, damping: 10, mass: 1 });
        animate("div", { borderRadius: 30 }, { type: "spring", stiffness: 200, damping: 10, mass: 1 });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolled, animate, scope, position]);

  return (
    <div className="h-[calc(100vh+100vh)] w-full relative">
      <motion.div 
        className="fixed left-0 w-full z-20 flex flex-row items-center justify-between my-10 px-12"
        // animate={{
        //   top: hasScrolled ? "-1.5rem" : "-0.5rem",
        // }}
        // transition={{
        //   duration: 0.6,
        //   ease: "easeInOut"
        // }}
      >
        <motion.p 
          className="text-xl font-semibold"
          animate={{
            color: hasScrolled || position === "above" || position === "in-view" ? "black" : "white"
          }}
          transition={{
            duration: 0.7,
            ease: "easeInOut"
          }}
        >
          stefanchao.com
        </motion.p>
        <div className="relative flex items-center">
          <CircularFillButton position={position} topbarOffset={66} hasScrolled={hasScrolled}/>
        </div>
      </motion.div>
      <motion.div 
        ref={scope}
        className={`bottom-0 h-[100vh] inset-0 overflow-hidden mx-8 ${(absolutePosition || position === "above") ? 'absolute mt-[100vh]' : 'fixed'}`}
        initial={{
          borderRadius: 0,
          padding: 0,
          scale: 1.05,
        }}
      >
        <motion.div 
          className="w-full h-full bg-white overflow-hidden"
        >
          {/* <RippleEffect imageUrl="/images/splash3.jpg" /> */}
            <WaterDistortion img={"/images/splash4.jpg"}/> 
        </motion.div>
      </motion.div>
      <div ref={triggerRef} className="absolute bottom-0 left-0 w-full h-1 bg-transparent"/>
    </div>
  );
};

export default FullscreenSplashAnimation;