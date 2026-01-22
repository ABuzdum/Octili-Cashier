/**
 * ============================================================================
 * LOGIN PAGE - OCTILI CASHIER POS TERMINAL
 * ============================================================================
 *
 * Purpose: Beautiful animated login page matching Octili Admin Panel style
 * with Octili brand colors (green/teal palette)
 *
 * Features:
 * - Animated liquid glass background effect
 * - Glass morphism card design
 * - Username and password input with icons
 * - Support phone number display
 * - Demo credentials section
 *
 * @author Octili Development Team
 * @version 2.1.0
 * @lastUpdated 2026-01-22
 */

import { useState, useEffect, useRef, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import {
  Eye,
  EyeOff,
  User,
  Lock,
  AlertCircle,
  Loader2,
  ArrowRight,
  Phone,
  Sparkles
} from 'lucide-react'

/** Octili Brand Colors - matching Admin Panel */
const BRAND_COLORS = {
  green: '#24BD68',       // Primary green - buttons, accents
  teal: '#00A77E',        // Teal - hover states
  deepTeal: '#006E7E',    // Deep teal - gradients
  darkBlue: '#28455B',    // Dark blue - headers, labels
  charcoal: '#282E3A',    // Charcoal - text
}

/** Demo credentials for testing */
const DEMO_USERNAME = 'cashier'
const DEMO_PASSWORD = 'password'
const SUPPORT_PHONE = '+38 068 777 22 89'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })

  /**
   * Animated liquid glass background effect
   * Creates floating blobs with Octili brand colors that follow mouse movement
   */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0

    // Set canvas size to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    /**
     * Blob class for liquid effect
     * Each blob floats around and is influenced by mouse position
     */
    class Blob {
      x: number
      y: number
      radius: number
      xSpeed: number
      ySpeed: number
      color: string
      opacity: number

      constructor(x: number, y: number, radius: number, color: string, opacity: number) {
        this.x = x
        this.y = y
        this.radius = radius
        this.xSpeed = (Math.random() - 0.5) * 0.5
        this.ySpeed = (Math.random() - 0.5) * 0.5
        this.color = color
        this.opacity = opacity
      }

      update(width: number, height: number, mouseX: number, mouseY: number) {
        // Gentle floating movement
        this.x += this.xSpeed + Math.sin(time * 0.001) * 0.3
        this.y += this.ySpeed + Math.cos(time * 0.001) * 0.3

        // Mouse influence - blobs are gently attracted to cursor
        const dx = mouseX - this.x
        const dy = mouseY - this.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 300) {
          this.x += dx * 0.002
          this.y += dy * 0.002
        }

        // Wrap around screen edges
        if (this.x < -this.radius) this.x = width + this.radius
        if (this.x > width + this.radius) this.x = -this.radius
        if (this.y < -this.radius) this.y = height + this.radius
        if (this.y > height + this.radius) this.y = -this.radius
      }

      draw(ctx: CanvasRenderingContext2D) {
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius
        )
        gradient.addColorStop(0, this.color.replace(')', `, ${this.opacity})`).replace('rgb', 'rgba'))
        gradient.addColorStop(0.5, this.color.replace(')', `, ${this.opacity * 0.5})`).replace('rgb', 'rgba'))
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }
    }

    // Create blobs with Octili brand colors
    const blobs = [
      new Blob(canvas.width * 0.3, canvas.height * 0.3, 350, 'rgb(36, 189, 104)', 0.4),   // Octili Green
      new Blob(canvas.width * 0.7, canvas.height * 0.6, 300, 'rgb(0, 167, 126)', 0.35),   // Teal
      new Blob(canvas.width * 0.5, canvas.height * 0.8, 280, 'rgb(0, 110, 126)', 0.3),    // Deep Teal
      new Blob(canvas.width * 0.2, canvas.height * 0.7, 250, 'rgb(40, 69, 91)', 0.25),    // Dark Blue
      new Blob(canvas.width * 0.8, canvas.height * 0.2, 320, 'rgb(36, 189, 104)', 0.3),   // Octili Green
      new Blob(canvas.width * 0.4, canvas.height * 0.5, 200, 'rgb(0, 167, 126)', 0.25),   // Teal
    ]

    // Track mouse position for blob attraction
    let mouseX = canvas.width / 2
    let mouseY = canvas.height / 2

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Animation loop
    const animate = () => {
      time++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      blobs.forEach(blob => {
        blob.update(canvas.width, canvas.height, mouseX, mouseY)
        blob.draw(ctx)
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  /**
   * Handle form submission
   * Validates inputs and attempts login
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('Please enter username and password')
      return
    }

    const success = await login(username, password)

    if (success) {
      navigate('/pos')
    } else {
      setError('Invalid username or password')
    }
  }

  /** Fill demo credentials into form */
  const fillDemoCredentials = () => {
    setUsername(DEMO_USERNAME)
    setPassword(DEMO_PASSWORD)
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'blur(80px)' }}
      />

      {/* Moving gradient overlay that follows mouse */}
      <div
        className="absolute inset-0 transition-all duration-[2000ms] ease-out"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(36, 189, 104, 0.15) 0%, transparent 50%),
            radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, rgba(0, 167, 126, 0.1) 0%, transparent 40%)
          `,
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${BRAND_COLORS.charcoal} 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Logo Section */}
        <div className="text-center mb-10 animate-fade-in">
          {/* Logo container with brand glow */}
          <div className="relative inline-block mb-6">
            {/* Glow behind logo */}
            <div
              className="absolute inset-0 blur-3xl scale-150 opacity-50 animate-pulse-glow"
              style={{
                background: `linear-gradient(135deg, ${BRAND_COLORS.green}40, ${BRAND_COLORS.teal}30, ${BRAND_COLORS.deepTeal}20)`,
              }}
            />

            {/* Octili Logo */}
            <img
              src="/octili-primary-logo.svg"
              alt="Octili"
              className="relative h-24 sm:h-32 md:h-40 w-auto mx-auto drop-shadow-lg"
              onError={(e) => {
                // Fallback to text if logo doesn't load
                e.currentTarget.style.display = 'none'
                const fallback = e.currentTarget.nextElementSibling as HTMLElement
                if (fallback) fallback.style.display = 'flex'
              }}
            />
            {/* Fallback logo */}
            <div
              className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full items-center justify-center shadow-2xl hidden"
              style={{
                background: `linear-gradient(135deg, ${BRAND_COLORS.green}, ${BRAND_COLORS.teal})`,
              }}
            >
              <span className="text-4xl sm:text-5xl font-black text-white">O</span>
            </div>
          </div>

          {/* Title with brand typography */}
          <div className="space-y-2">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight"
              style={{ color: BRAND_COLORS.charcoal }}
            >
              Octili Cashier
            </h1>
            <p
              className="text-base sm:text-lg font-medium tracking-wide"
              style={{ color: BRAND_COLORS.darkBlue }}
            >
              POS Terminal
            </p>
          </div>
        </div>

        {/* Glass Card */}
        <div className="w-full max-w-lg animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <div className="relative group">
            {/* Card outer glow on hover */}
            <div
              className="absolute -inset-1 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background: `linear-gradient(135deg, ${BRAND_COLORS.green}20, ${BRAND_COLORS.teal}15, ${BRAND_COLORS.deepTeal}10)`,
              }}
            />

            {/* Glass card */}
            <div className="relative backdrop-blur-2xl bg-white/60 border border-white/70 rounded-[2rem] p-8 sm:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden">
              {/* Inner glass shine */}
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/70 via-white/30 to-transparent pointer-events-none" />

              {/* Animated border glow */}
              <div
                className="absolute inset-0 rounded-[2rem] opacity-40 pointer-events-none transition-opacity duration-500"
                style={{
                  background: `conic-gradient(from ${mousePosition.x * 3.6}deg at 50% 50%, transparent 0deg, ${BRAND_COLORS.green}30 60deg, ${BRAND_COLORS.teal}20 120deg, transparent 180deg)`,
                }}
              />

              {/* Secure Login badge */}
              <div className="relative flex items-center justify-center gap-2 mb-8">
                <div
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-sm"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND_COLORS.green}15, ${BRAND_COLORS.teal}10)`,
                    border: `1px solid ${BRAND_COLORS.green}30`,
                  }}
                >
                  <Sparkles className="w-4 h-4" style={{ color: BRAND_COLORS.green }} />
                  <span className="text-sm font-semibold" style={{ color: BRAND_COLORS.darkBlue }}>
                    Secure Login
                  </span>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="relative mb-6 p-4 bg-red-50/80 border border-red-200/60 rounded-2xl flex items-start gap-3 animate-shake backdrop-blur-sm">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-700">Login Failed</p>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 relative">
                {/* Username */}
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="block text-sm font-semibold"
                    style={{ color: BRAND_COLORS.darkBlue }}
                  >
                    Login
                  </label>
                  <div className="relative group/input">
                    <div
                      className="absolute -inset-0.5 rounded-xl blur opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(135deg, ${BRAND_COLORS.green}30, ${BRAND_COLORS.teal}20)` }}
                    />
                    <div className="relative">
                      <User
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                      />
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                        className="w-full h-14 pl-12 pr-4 rounded-xl bg-white/50 border-2 border-slate-200/80 backdrop-blur-sm placeholder-slate-400 text-base font-medium focus:outline-none focus:bg-white/70 focus:border-[#24BD68] transition-all duration-300"
                        style={{ color: BRAND_COLORS.charcoal }}
                        placeholder="Enter your login"
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold"
                    style={{ color: BRAND_COLORS.darkBlue }}
                  >
                    Password
                  </label>
                  <div className="relative group/input">
                    <div
                      className="absolute -inset-0.5 rounded-xl blur opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(135deg, ${BRAND_COLORS.green}30, ${BRAND_COLORS.teal}20)` }}
                    />
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        className="w-full h-14 pl-12 pr-14 rounded-xl bg-white/50 border-2 border-slate-200/80 backdrop-blur-sm placeholder-slate-400 text-base font-medium focus:outline-none focus:bg-white/70 focus:border-[#24BD68] transition-all duration-300"
                        style={{ color: BRAND_COLORS.charcoal }}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full h-16 rounded-2xl font-bold text-lg text-white overflow-hidden group/btn disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    boxShadow: `0 8px 32px ${BRAND_COLORS.green}40`,
                  }}
                >
                  {/* Button gradient background - Octili Brand Colors */}
                  <div
                    className="absolute inset-0 transition-all duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND_COLORS.darkBlue} 0%, ${BRAND_COLORS.deepTeal} 25%, ${BRAND_COLORS.teal} 50%, ${BRAND_COLORS.green} 75%, ${BRAND_COLORS.teal} 100%)`,
                      backgroundSize: '200% 100%',
                    }}
                  />

                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />

                  {/* Button content */}
                  <span className="relative flex items-center justify-center gap-3">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign in</span>
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Support Phone */}
              <div className="relative mt-6 text-center">
                <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  Support
                </p>
                <a
                  href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`}
                  className="text-lg font-semibold hover:opacity-80 transition-opacity"
                  style={{ color: BRAND_COLORS.green }}
                >
                  {SUPPORT_PHONE}
                </a>
              </div>

              {/* Demo Credentials */}
              <div className="relative mt-6 pt-6 border-t border-slate-200/50">
                <p
                  className="text-xs text-center mb-4 uppercase tracking-widest font-semibold"
                  style={{ color: BRAND_COLORS.darkBlue, opacity: 0.6 }}
                >
                  Demo Credentials
                </p>
                <div
                  className="p-4 rounded-xl space-y-2 backdrop-blur-sm"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND_COLORS.green}08, ${BRAND_COLORS.teal}05)`,
                    border: `1px solid ${BRAND_COLORS.green}20`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: BRAND_COLORS.darkBlue }}>Login</span>
                    <code
                      className="text-sm font-mono font-semibold px-3 py-1 rounded-lg"
                      style={{
                        color: BRAND_COLORS.green,
                        background: `${BRAND_COLORS.green}15`,
                      }}
                    >
                      {DEMO_USERNAME}
                    </code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: BRAND_COLORS.darkBlue }}>Password</span>
                    <code
                      className="text-sm font-mono font-semibold px-3 py-1 rounded-lg"
                      style={{
                        color: BRAND_COLORS.green,
                        background: `${BRAND_COLORS.green}15`,
                      }}
                    >
                      {DEMO_PASSWORD}
                    </code>
                  </div>
                  <button
                    type="button"
                    onClick={fillDemoCredentials}
                    className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95"
                    style={{ background: BRAND_COLORS.green }}
                  >
                    Fill Demo Credentials
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p
          className="text-center text-sm mt-12 animate-fade-in font-medium"
          style={{ animationDelay: '0.3s', color: BRAND_COLORS.darkBlue, opacity: 0.6 }}
        >
          © {new Date().getFullYear()} Octili IT Consulting. All rights reserved.
        </p>
      </div>
    </div>
  )
}
