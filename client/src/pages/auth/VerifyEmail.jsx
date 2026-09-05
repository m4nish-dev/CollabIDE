import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

const VerifyEmail = () => {
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const handleResend = async () => {
    setResending(true);
    await new Promise((r) => setTimeout(r, 800));
    setResending(false);
    setCooldown(30);
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        {/* Mail icon with glow */}
        <motion.div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(124,92,255,0)",
              "0 0 24px 6px rgba(124,92,255,0.18)",
              "0 0 0 0 rgba(124,92,255,0)",
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Mail size={30} className="text-accent" />
        </motion.div>

        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Verify your email
        </h1>
        <p className="mt-2 text-sm text-foreground-muted leading-relaxed max-w-xs mx-auto">
          We&apos;ve sent a verification link to your email address. Click the
          link to activate your account.
        </p>

        <div className="mt-8 space-y-3">
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleResend}
            disabled={resending || cooldown > 0}
          >
            {resending ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Resending…
              </>
            ) : cooldown > 0 ? (
              `Resend in ${cooldown}s`
            ) : (
              "Resend email"
            )}
          </Button>

          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} /> Back to sign in
          </Link>
        </div>

        <p className="mt-8 text-xs text-foreground-subtle">
          Check your spam folder if you don&apos;t see it within a minute.
        </p>
      </motion.div>
    </AuthLayout>
  );
};

export default VerifyEmail;
