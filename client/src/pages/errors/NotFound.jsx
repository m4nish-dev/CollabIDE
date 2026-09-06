import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center overflow-hidden p-6">
      
      {/* Background Animated Brackets */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-[40vw] font-bold text-foreground-muted select-none leading-none"
        >
          &lt; &gt;
        </motion.div>
      </div>

      <div className="relative z-10 text-center max-w-xl mx-auto flex flex-col items-center">
        <h1 className="text-8xl md:text-9xl font-black mb-4 tracking-tighter bg-gradient-to-br from-violet-400 via-accent to-cyan-400 text-transparent bg-clip-text drop-shadow-[0_0_40px_rgba(139,92,246,0.3)] select-none">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
          This page took a wrong turn
        </h2>
        
        <p className="text-base text-foreground-subtle mb-10 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button 
            variant="ghost" 
            size="lg"
            onClick={() => navigate(-1)}
            className="gap-2 h-12 px-6"
          >
            <ArrowLeft className="h-4 w-4" /> Go back
          </Button>
          <Button 
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="h-12 px-8 bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20"
          >
            Go to dashboard
          </Button>
        </div>
      </div>
      
    </div>
  );
}
