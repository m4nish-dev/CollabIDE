import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";

import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

import { StepProfile } from "./StepProfile";
import { StepPreferences } from "./StepPreferences";
import { StepWorkspace } from "./StepWorkspace";
import { StepInvite } from "./StepInvite";

// ── Config ──────────────────────────────────────────────────────
const STEPS = [
  { label: "Profile", component: <StepProfile /> },
  { label: "Stack", component: <StepPreferences /> },
  { label: "Workspace", component: <StepWorkspace /> },
  { label: "Invite Team", component: <StepInvite /> },
];

const SKIPPABLE = [3]; // Step 4 (index 3) is skippable

// ── Slide variants ───────────────────────────────────────────────
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 20 : -20, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -20 : 20, opacity: 0 }),
};

// ── Confetti celebration ─────────────────────────────────────────
function fireConfetti() {
  const count = 200;
  const defaults = { origin: { y: 0.7 } };
  confetti({
    ...defaults,
    particleCount: Math.floor(count * 0.25),
    spread: 26,
    startVelocity: 55,
    colors: ["#7C5CFF", "#22D3EE"],
  });
  confetti({
    ...defaults,
    particleCount: Math.floor(count * 0.2),
    spread: 60,
    colors: ["#7C5CFF", "#EC4899"],
  });
  confetti({
    ...defaults,
    particleCount: Math.floor(count * 0.35),
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ["#22D3EE", "#7C5CFF"],
  });
  confetti({
    ...defaults,
    particleCount: Math.floor(count * 0.1),
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ["#F59E0B", "#10B981"],
  });
  confetti({
    ...defaults,
    particleCount: Math.floor(count * 0.1),
    spread: 120,
    startVelocity: 45,
    colors: ["#7C5CFF", "#22D3EE"],
  });
}

// ── Celebration overlay ──────────────────────────────────────────
const CelebrationOverlay = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", bounce: 0.4, delay: 0.15 }}
      className="flex flex-col items-center gap-5 text-center"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent to-secondary text-4xl shadow-[0_0_40px_rgba(124,92,255,0.5)]">
        🎉
      </div>
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          You&apos;re all set!
        </h1>
        <p className="mt-2 text-foreground-muted">
          Taking you to your dashboard…
        </p>
      </div>
      <LoadingSpinner size="sm" className="mt-2" />
    </motion.div>
  </motion.div>
);

// ── Main Onboarding page ─────────────────────────────────────────
const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [finishing, setFinishing] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  const totalSteps = STEPS.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const goNext = () => {
    if (step < totalSteps - 1) {
      setDir(1);
      setStep((s) => s + 1);
    } else {
      handleFinish();
    }
  };

  const goBack = () => {
    if (step > 0) {
      setDir(-1);
      setStep((s) => s - 1);
    }
  };

  const handleFinish = async () => {
    setFinishing(true);
    await new Promise((r) => setTimeout(r, 600));
    setCelebrating(true);
    fireConfetti();
    await new Promise((r) => setTimeout(r, 2200));
    navigate("/dashboard");
  };

  // Fire confetti again after 600ms for extra wow
  useEffect(() => {
    if (celebrating) {
      const id = setTimeout(() => fireConfetti(), 700);
      return () => clearTimeout(id);
    }
  }, [celebrating]);

  if (celebrating) return <CelebrationOverlay />;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="mb-10">
        <Logo />
      </div>

      {/* Card */}
      <div className="w-full max-w-[560px] rounded-2xl border border-border bg-background-elevated shadow-2xl overflow-hidden">
        {/* Progress header */}
        <div className="px-8 pt-7 pb-5 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-foreground-muted">
              Step {step + 1} of {totalSteps}
            </span>
            <span className="text-xs text-foreground-subtle">
              {STEPS[step].label}
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-1 w-full rounded-full bg-border">
            <motion.div
              className="h-full rounded-full bg-accent"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ boxShadow: "0 0 8px rgba(124,92,255,0.5)" }}
            />
          </div>

          {/* Step dots */}
          <div className="flex items-center gap-2 mt-3">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i <= step ? "bg-accent" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step content with slide animation */}
        <div className="px-8 py-7 min-h-[380px] overflow-hidden">
          <AnimatePresence custom={dir} mode="wait">
            <motion.div
              key={step}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {STEPS[step].component}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-border px-8 py-5">
          <Button
            variant="ghost"
            onClick={goBack}
            disabled={step === 0}
            className="text-foreground-muted"
          >
            Back
          </Button>

          <div className="flex items-center gap-3">
            {SKIPPABLE.includes(step) && (
              <button
                onClick={goNext}
                className="text-sm text-foreground-subtle hover:text-foreground-muted transition-colors"
              >
                Skip for now
              </button>
            )}
            <Button
              variant="primary"
              onClick={goNext}
              disabled={finishing}
              className="min-w-[120px]"
            >
              {finishing ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Setting up…
                </>
              ) : step === totalSteps - 1 ? (
                "Finish setup"
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Subtle bottom hint */}
      <p className="mt-6 text-xs text-foreground-subtle">
        You can change all of this later in Settings
      </p>
    </div>
  );
};

export default Onboarding;
