import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'

import { AuthLayout } from '@/components/auth/AuthLayout'
import { FormField, PasswordStrengthMeter } from '@/components/auth/AuthAtoms'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})
type FormData = z.infer<typeof schema>

const ResetPassword: React.FC = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)
  const [watchedPassword, setWatchedPassword] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (_data: FormData) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    navigate('/login')
  }

  const onError = () => setShakeKey(k => k + 1)

  return (
    <AuthLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Set new password</h1>
        <p className="mt-1.5 text-sm text-foreground-muted">Choose a strong password for your account</p>
      </div>

      <motion.form
        key={shakeKey}
        animate={shakeKey > 0 ? { x: [0, -6, 6, -4, 4, 0] } : {}}
        transition={{ duration: 0.35 }}
        onSubmit={handleSubmit(onSubmit, onError)}
        className="space-y-4"
      >
        <FormField label="New password" error={errors.password?.message}>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              className={`pr-10 ${errors.password ? 'border-danger focus-visible:ring-danger' : ''}`}
              {...register('password', {
                onChange: e => setWatchedPassword(e.target.value),
              })}
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
          <PasswordStrengthMeter password={watchedPassword} />
        </FormField>

        <FormField label="Confirm password" error={errors.confirmPassword?.message}>
          <div className="relative">
            <Input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repeat your password"
              autoComplete="new-password"
              className={`pr-10 ${errors.confirmPassword ? 'border-danger focus-visible:ring-danger' : ''}`}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground-muted transition-colors"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </FormField>

        <Button type="submit" variant="primary" className="w-full mt-1" disabled={loading}>
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Updating…
            </>
          ) : 'Update password'}
        </Button>
      </motion.form>
    </AuthLayout>
  )
}

export default ResetPassword
