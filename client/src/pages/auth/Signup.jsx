import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

import { AuthLayout } from "@/components/auth/AuthLayout";
import {
  OAuthButton,
  AuthDivider,
  FormField,
  GitHubIcon,
  GoogleIcon,
  PasswordStrengthMeter,
} from "@/components/auth/AuthAtoms";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

const schema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  terms: z.boolean().refine((v) => v, "You must accept the terms"),
});

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [watchedPassword, setWatchedPassword] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (_data) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    navigate("/onboarding");
  };

  const onError = () => setShakeKey((k) => k + 1);

  return (
    <AuthLayout>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="mt-1.5 text-sm text-foreground-muted">
          Start collaborating in seconds
        </p>
      </div>

      {/* OAuth */}
      <div className="space-y-2.5">
        <OAuthButton icon={<GitHubIcon />}>Continue with GitHub</OAuthButton>
        <OAuthButton icon={<GoogleIcon />}>Continue with Google</OAuthButton>
      </div>

      <AuthDivider />

      {/* Form */}
      <motion.form
        key={shakeKey}
        animate={shakeKey > 0 ? { x: [0, -6, 6, -4, 4, 0] } : {}}
        transition={{ duration: 0.35 }}
        onSubmit={handleSubmit(onSubmit, onError)}
        className="space-y-4"
      >
        <FormField label="Full name" error={errors.fullName?.message}>
          <Input
            type="text"
            placeholder="Rohit Chugh"
            autoComplete="name"
            {...register("fullName")}
            className={
              errors.fullName ? "border-danger focus-visible:ring-danger" : ""
            }
          />
        </FormField>

        <FormField label="Email address" error={errors.email?.message}>
          <Input
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            {...register("email")}
            className={
              errors.email ? "border-danger focus-visible:ring-danger" : ""
            }
          />
        </FormField>

        <FormField label="Password" error={errors.password?.message}>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              className={`pr-10 ${errors.password ? "border-danger focus-visible:ring-danger" : ""}`}
              {...register("password", {
                onChange: (e) => setWatchedPassword(e.target.value),
              })}
            />

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground-muted transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <PasswordStrengthMeter password={watchedPassword} />
        </FormField>

        {/* Terms */}
        <div className="space-y-1">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-border bg-background-elevated checked:bg-accent checked:border-accent accent-accent focus:ring-accent"
              {...register("terms")}
            />

            <span className="text-xs text-foreground-muted leading-relaxed">
              I agree to the{" "}
              <a
                href="#"
                className="text-foreground hover:text-accent transition-colors underline-offset-2 underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-foreground hover:text-accent transition-colors underline-offset-2 underline"
              >
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.terms && (
            <p className="text-xs text-danger" role="alert">
              {errors.terms.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-1"
          disabled={loading}
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </motion.form>

      {/* Footer link */}
      <p className="mt-6 text-center text-sm text-foreground-muted">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-accent hover:text-accent-hover transition-colors"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;
