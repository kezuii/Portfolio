"use client"

import Image from "next/image";
import ScrollAnimated3DScene from './components/ScrollAnimated3DScene';
import AnimatedGrid from './components/AnimatedGrid';
import FullscreenSplashAnimation from './components/FullscreenSplashAnimation';
import { AnimatePresence, motion, useAnimation, useInView, useScroll, useTransform } from "framer-motion";
import React, { useEffect, useRef, useState } from 'react'
import AnimatedHeaderText from "./components/AnimatedHeaderText";
import WaterDistortion from "./components/WaterDistortion";
import Autoscroll from "./components/HorizontalAutoscroll";

function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0 }); 
  const [position, setPosition] = useState("below");
  const [resetAnimation, setResetAnimation] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const reset = () => {
      setResetAnimation(true);
      setTimeout(() => {
        setResetAnimation(false);
      }, 100);
    }
    const checkVisibility = () => {
      if(ref.current) {
        const rect = ref.current?.getBoundingClientRect();
        if (rect) {
          if (rect.bottom < 0) {
            setPosition("above");
            console.log("above");
            reset();
          } else if (rect.top > window.innerHeight) {
            setPosition("below");
            console.log("below");
            reset();
          }
        }
      }
    };
    checkVisibility();
    
    window.addEventListener('scroll', checkVisibility);
    return () => window.removeEventListener('scroll', checkVisibility);
  }, []);

  const startPoint = position === "below" ? "20%" : "80%"; // Dynamically set starting point

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;  // -0.5 to 0.5
    setMousePosition({ x, y });
    console.log(mousePosition);
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return(
    <div ref={ref} className="relative w-full aspect-[3/1]">
      {!resetAnimation && (
        <AnimatePresence>
          <motion.div 
            className="absolute top-0 w-full aspect-[3/1] origin-center bg-white rounded-2xl"
            animate={{
              rotateX: mousePosition.y * -10, // Tilt up/down
              rotateY: mousePosition.x * 10,  // Tilt left/right
              transformPerspective: 1000,     // Add depth perspective
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              className="absolute top-0 left-0 right-0 w-full h-full origin-center bg-black rounded-2xl"
              initial={{
                clipPath: `circle(0% at 50% ${startPoint})`,
                opacity: 0.8,
              }}
              animate={{
                clipPath: `circle(150% at 50% ${startPoint})`,
                opacity: 1,
              }}
              transition={{ 
                duration: 1, 
                ease: [0.68, 0.1, 0.27, 1.55],
                rotateX: { duration: 0.1, ease: "linear" },
                rotateY: { duration: 0.1, ease: "linear" }
              }}
            >
              <div className="absolute top-0 left-0 w-full h-full rounded-2xl z-10 flex flex-col items-center justify-center">
                <span className="text-white text-center text-2xl px-14">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</span>
                <Autoscroll/>
              </div>
              <WaterDistortion img={"/images/splash5.jpg"}/> 
            </motion.div>
              {/* <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 rounded-2xl z-10 flex flex-col items-center justify-center">
                <span className="text-white text-center text-2xl px-14">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</span>
                <Autoscroll/>
              </div> */}
        </motion.div>
      </AnimatePresence>
      )}
    </div>
  )
}

function FeaturedWorkGrid() {
  const [gridCount, setGridCount] = useState(0);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const [position1, setPosition1] = useState("below");
  const [position2, setPosition2] = useState("below");
  const [position3, setPosition3] = useState("below");
  const isInView1 = useInView(ref1, { once: false, amount: 0 });
  const isInView2 = useInView(ref2, { once: false, amount: 0 });
  const isInView3 = useInView(ref3, { once: false, amount: 0 });
  
  useEffect(() => {
    // Helper function to determine viewport position
    const determineViewportPosition = (
      element: HTMLElement | null,
      prevPosition: "above" | "in-view" | "below"
    ): "above" | "in-view" | "below" => {
      if (!element) return "above";
      
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Element is above viewport
      if (rect.bottom < 0) return "above";
      // Element is below viewport
      if (rect.top > windowHeight) return "below";
      // Element is in view
      return prevPosition;
    };

    // Determine positions based on viewport
    setPosition1(determineViewportPosition(ref1.current, position1));
    setPosition2(determineViewportPosition(ref2.current, position2));
    setPosition3(determineViewportPosition(ref3.current, position3));

  }, [isInView1, isInView2, isInView3]);

  const works = [
    { id: 1, title: 'State', description: "Front-end • UI/UX", image: "https://i.imgur.com/2CO0kHZ.png" },
    { id: 2, title: 'Artfol', description: "Founder • Full Stack • UI/UX", image: "https://i.imgur.com/4my33ta.png" },
    { id: 3, title: 'Neura Energy', description: "Front-end • UI/UX • Creative",   image: "https://i.imgur.com/Wr9zMX3.png" },
    { id: 4, title: 'Design', description: "Figma • Photoshop • Illustrator", image: "https://i.imgur.com/JMivD2H.png" },
    { id: 5, title: 'Art', description: "Photoshop • Wacom • Huion", image: "https://i.imgur.com/Cpwoo02.png" },
    { id: 6, title: 'Game Dev', description: "Unity/C# • Godot/GDScript • React", image: "https://i.imgur.com/DUfaDup.png" },
  ];

  const fillerHeight = "grid grid-cols-1 md:grid-cols-2 gap-8 py-4 pb-28";

  return (
    <div className="w-full">
      <div className="relative" ref={ref1} aria-hidden="true">
        {/* Placeholder div to maintain layout */}
        <div className={fillerHeight} >
          <div className="w-relative aspect-[2/1] overflow-hidden"/>
        </div>
        {/* Actual AnimatedGrid positioned absolutely */}
        {isInView1 && (
          <div className="absolute top-0 left-0 w-full">
            <AnimatedGrid works={[works[0], works[1]]} position={position1}/>
          </div>
        )}
      </div>
      
      <div className="relative" ref={ref2} aria-hidden="true">
        {/* Placeholder div to maintain layout */}
        <div className={fillerHeight} >
          <div className="w-relative aspect-[2/1] overflow-hidden"/>
        </div>
        {/* Actual AnimatedGrid positioned absolutely */}
        {isInView2 && (
          <div className="absolute top-0 left-0 w-full">
            <AnimatedGrid works={[works[2], works[3]]} position={position2}/>
          </div>
        )}
      </div>
      
      <div className="relative" ref={ref3} aria-hidden="true">
        {/* Placeholder div to maintain layout */}
        <div className={fillerHeight} >
          <div className="w-relative aspect-[2/1] overflow-hidden"/>
        </div>
        {/* Actual AnimatedGrid positioned absolutely */}
        {isInView3 && (
          <div className="absolute top-0 left-0 w-full">
            <AnimatedGrid works={[works[4], works[5]]} position={position3}/>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {

  useEffect(() => {
    window.history.scrollRestoration = 'manual'
  }, []);
  
  return (
    <div className="bg-white overflow-x-hidden">
    
      <FullscreenSplashAnimation/> 

      <div className="grid grid-row items-center justify-items-center min-h-screen p-8 bg-white">
        <main className="w-full h-full">

        <AnimatedHeaderText text={"Featured work"} position={"bottom"}/>
        
        <FeaturedWorkGrid />

        <AnimatedHeaderText text={"About"} position={"bottom"}/>

        <AboutSection/>

        <div className="h-[100vh]"/>
        {/* <div className="relative w-full aspect-[3/1]">
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 rounded-2xl z-10 flex flex-col items-center justify-center">
            <span className="text-white text-center text-2xl  px-14">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</span>
            <Autoscroll/>
          </div>
          <WaterDistortion/> 
        </div> */}

        {/* 
        <div className="h-[70vh]"/>
          <div className="relative w-100 h-60 border border-2 rounded-2xl border-white-500 bg-white">
            <div className="absolute top-0 left-0 w-full h-full h-[100%]"> 
              <ScrollAnimated3DScene />
            </div>
          </div>
          <div className="h-[70vh]"/> 
        */}

        </main>
      </div>
    </div>
  );
}
