import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'

import { AuthLayout } from '@/components/auth/AuthLayout'
import { OAuthButton, AuthDivider, FormField, GitHubIcon, GoogleIcon } from '@/components/auth/AuthAtoms'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})
type FormData = z.infer<typeof schema>

const Login: React.FC = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (_data: FormData) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    navigate('/dashboard')
  }

  const onError = () => setShakeKey(k => k + 1)

  return (
    <AuthLayout>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome back</h1>
        <p className="mt-1.5 text-sm text-foreground-muted">Sign in to continue building with your team</p>
      </div>

      {/* OAuth buttons */}
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
        <FormField label="Email address" error={errors.email?.message}>
          <Input
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            {...register('email')}
            className={errors.email ? 'border-danger focus-visible:ring-danger' : ''}
          />
        </FormField>

        <FormField label="Password" error={errors.password?.message}>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              className={`pr-10 ${errors.password ? 'border-danger focus-visible:ring-danger' : ''}`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground-muted transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </FormField>

        <div className="flex justify-end -mt-1">
          <Link to="/forgot-password" className="text-xs text-foreground-muted hover:text-foreground transition-colors">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Signing in…
            </>
          ) : 'Sign in'}
        </Button>
      </motion.form>

      {/* Footer link */}
      <p className="mt-6 text-center text-sm text-foreground-muted">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-medium text-accent hover:text-accent-hover transition-colors">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}

export default Login
