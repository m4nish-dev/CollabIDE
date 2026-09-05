import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormField } from "@/components/auth/AuthAtoms";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
});

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const [shakeKey, setShakeKey] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSentEmail(data.email);
    setSent(true);
  };

  const onError = () => setShakeKey((k) => k + 1);

  return (
    <AuthLayout>
      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Reset your password
              </h1>
              <p className="mt-1.5 text-sm text-foreground-muted">
                We&apos;ll email you a secure reset link
              </p>
            </div>

            <motion.form
              key={shakeKey}
              animate={shakeKey > 0 ? { x: [0, -6, 6, -4, 4, 0] } : {}}
              transition={{ duration: 0.35 }}
              onSubmit={handleSubmit(onSubmit, onError)}
              className="space-y-4"
            >
              <FormField label="Email address" error={errors.email?.message}>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  {...register("email")}
                  className={
                    errors.email
                      ? "border-danger focus-visible:ring-danger"
                      : ""
                  }
                />
              </FormField>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Sending link…
                  </>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </motion.form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors"
              >
                <ArrowLeft size={14} /> Back to sign in
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 size={28} className="text-success" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Check your inbox
            </h2>
            <p className="mt-2 text-sm text-foreground-muted leading-relaxed">
              We sent a password reset link to{" "}
              <span className="font-medium text-foreground">{sentEmail}</span>
            </p>
            <p className="mt-1.5 text-xs text-foreground-subtle">
              Didn&apos;t receive it? Check spam or try another email.
            </p>

            <div className="mt-8">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors"
              >
                <ArrowLeft size={14} /> Back to sign in
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default ForgotPassword;
