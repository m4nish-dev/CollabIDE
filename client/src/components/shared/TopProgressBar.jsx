import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const TopProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let timer0, timer1, timer2, timer3;
    
    timer0 = setTimeout(() => {
      setVisible(true);
      setProgress(30);

      timer1 = setTimeout(() => setProgress(60), 100);
      timer2 = setTimeout(() => setProgress(80), 300);
      timer3 = setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setVisible(false);
          setProgress(0);
        }, 200);
      }, 500);
    }, 0);

    return () => {
      clearTimeout(timer0);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-[9999] pointer-events-none">
      <div 
        className="h-full bg-accent transition-all duration-200 ease-out shadow-[0_0_10px_rgba(139,92,246,0.8)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
