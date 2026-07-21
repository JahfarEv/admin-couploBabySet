import { Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const { login, isLoading, error } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      await login(email, password, remember)
      navigate('/', { replace: true })
    } catch {
      // error surfaced via auth context
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-cream px-4 py-10">
      <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-blush-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blush-100/50 blur-3xl" />

      <div className="relative w-full max-w-md rounded-3xl border border-black/5 bg-white p-10 shadow-panel">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blush-100 text-2xl">
            🙂
          </span>
          <h1 className="mt-4 font-display text-2xl font-semibold text-mauve-600">Couplo Baby Set</h1>
          <p className="mt-1 text-ink-muted">Admin Portal Access</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm text-ink-soft">
              Email Address
            </label>
            <div className="relative">
              <Mail size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@couplo.com"
                className="w-full rounded-xl border border-black/10 bg-cream-soft py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink-faint focus:border-mauve-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="text-sm text-ink-soft">
                Password
              </label>
              <button type="button" className="text-sm font-medium text-sky-500 hover:underline">
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-black/10 bg-cream-soft py-3 pl-11 pr-11 text-sm text-ink placeholder:text-ink-faint focus:border-mauve-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-soft"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {error && <p className="rounded-lg bg-blush-50 px-3 py-2 text-sm text-mauve-600">{error}</p>}

          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-black/20 text-mauve-500 focus:ring-mauve-400"
            />
            Remember Me
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-mauve-600 py-3.5 text-sm font-medium text-white transition-colors hover:bg-mauve-700 disabled:opacity-60"
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
            {!isLoading && <LogIn size={16} />}
          </button>
        </form>

        <div className="mt-8 border-t border-black/5 pt-6 text-center">
          <div className="flex items-center justify-center -space-x-2">
            <span className="h-8 w-8 rounded-full border-2 border-white bg-blush-200" />
            <span className="h-8 w-8 rounded-full border-2 border-white bg-sand-100" />
            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-cream-deep text-xs text-ink-muted">
              +
            </span>
          </div>
          <p className="mt-3 text-xs tracking-widest text-ink-faint">NURTURED ELEGANCE SINCE 2024</p>
        </div>
      </div>

      <div className="relative mt-6 flex gap-6 text-sm text-ink-muted">
        <a href="#" className="hover:text-ink-soft">Privacy Policy</a>
        <a href="#" className="hover:text-ink-soft">Support</a>
        <a href="#" className="hover:text-ink-soft">User Agreement</a>
      </div>
    </div>
  )
}
