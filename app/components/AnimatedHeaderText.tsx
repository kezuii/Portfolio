import { motion, useInView } from "framer-motion";
import React from "react";
export default function AnimatedHeaderText({ 
  text, 
  position, 
  className = "my-10",
  classNameText = "text-xl",
  fontSize = "48px",
  delayChildren = 0.2
}: { 
  text: string, 
  position: string,
  className?: string,
  classNameText?: string,
  fontSize?: string,
  delayChildren?: number
}) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, {
    once: false,
    amount: 0.1
  });
  
    const containerVariants = {
      visible: {
        transition: {
          staggerChildren: 0.03,
          delayChildren: delayChildren,
        },
      },
    };
  
    const letterVariants = {
      hidden: { 
        y: position === "top" ? -50 : 50,
        opacity: 0.5,
        rotateX: -40,
      },
      visible: {
        y: 0,
        opacity: 1,
        rotateX: 0,
        transition: {
          type: "spring",
          damping: 20,
          stiffness: 100,
          duration: 0.4,
          ease: [0.2, 0.65, 0.3, 0.9],
        },
      },
    };
    
    return (
        <div className={`${className} overflow-hidden h-10`} ref={ref}>
        <motion.div
            className={`featured-work-container text-black mt-2 ${classNameText}`}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            style={{ display: "flex", gap: "4px" }}
        >
            {text.split("").map((char, index) => (
            <motion.span
                key={index}
                variants={letterVariants}
                style={{
                display: "inline-block",
                fontSize: fontSize,
                }}
            >
                {char === " " ? "\u00A0" : char}
            </motion.span>
            ))}
        </motion.div>
        </div>
    );
  }