import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";
import ReactConfetti from "react-confetti";
import "./Helloworld.css"; // Import the scoped styles
export default function Home() {
  const [isWaving, setIsWaving] = useState(false);
  const [isConfetti, setIsConfetti] = useState(false);

  const container = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const wave = {
    wave: {
      rotate: [0, -20, 20, -20, 20, 0],
      transition: { duration: 1.5, repeat: 1 },
    },
  };

  const handleWave = useCallback(() => {
    setIsWaving(true);
    setIsConfetti(true);
    setTimeout(() => setIsConfetti(false), 3000); // Stop confetti after 3 seconds
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center p-4 overflow-hidden">
      {isConfetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={100}
          recycle={false}
          gravity={0.3}
          initialVelocityX={15}
          initialVelocityY={30}
          spread={180}
          confettiSource={{
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            w: 0,
            h: 0,
          }}
          drawShape={(ctx) => {
            const text = "👋";
            ctx.font = "16px Arial";
            ctx.fillText(text, 0, 0);
          }}
        />
      )}

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        <motion.div
          animate={isWaving ? "wave" : ""}
          variants={wave}
          className="text-6xl sm:text-8xl mb-8 inline-block cursor-pointer"
          onClick={handleWave}
          onAnimationComplete={() => setIsWaving(false)}
        >
          👋
        </motion.div>

        <motion.h1
          variants={item}
          className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
        >
          Hello World!
        </motion.h1>

        <motion.p
          variants={item}
          className="text-lg sm:text-xl text-muted-foreground mb-8"
        >
          Click the wave emoji or the button below for a fun surprise!
        </motion.p>

        <motion.div variants={item}>
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-opacity"
            onClick={handleWave}
          >
            Wave Hello!
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
