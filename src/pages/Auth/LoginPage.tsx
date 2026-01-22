/**
 * ============================================================================
 * LOGIN PAGE - OCTILI CASHIER POS TERMINAL
 * ============================================================================
 *
 * Purpose: Login page - exact copy of Octili Admin Panel design
 *
 * @author Octili Development Team
 * @version 5.0.0
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
  Sparkles,
  Copy,
  ClipboardPaste
} from 'lucide-react'

// Brand Colors
const BRAND = {
  green: '#24BD68',
  teal: '#00A77E',
  deepTeal: '#006E7E',
  darkBlue: '#28455B',
  charcoal: '#282E3A',
}

// Demo credentials
const DEMO_USERNAME = 'cashier'
const DEMO_PASSWORD = 'password'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })

  // Animated background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

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
        this.x += this.xSpeed + Math.sin(time * 0.001) * 0.3
        this.y += this.ySpeed + Math.cos(time * 0.001) * 0.3

        const dx = mouseX - this.x
        const dy = mouseY - this.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 300) {
          this.x += dx * 0.002
          this.y += dy * 0.002
        }

        if (this.x < -this.radius) this.x = width + this.radius
        if (this.x > width + this.radius) this.x = -this.radius
        if (this.y < -this.radius) this.y = height + this.radius
        if (this.y > height + this.radius) this.y = -this.radius
      }

      draw(ctx: CanvasRenderingContext2D) {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius)
        gradient.addColorStop(0, this.color.replace(')', `, ${this.opacity})`).replace('rgb', 'rgba'))
        gradient.addColorStop(0.5, this.color.replace(')', `, ${this.opacity * 0.5})`).replace('rgb', 'rgba'))
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }
    }

    const blobs = [
      new Blob(canvas.width * 0.3, canvas.height * 0.3, 350, 'rgb(36, 189, 104)', 0.4),
      new Blob(canvas.width * 0.7, canvas.height * 0.6, 300, 'rgb(0, 167, 126)', 0.35),
      new Blob(canvas.width * 0.5, canvas.height * 0.8, 280, 'rgb(0, 110, 126)', 0.3),
      new Blob(canvas.width * 0.2, canvas.height * 0.7, 250, 'rgb(40, 69, 91)', 0.25),
      new Blob(canvas.width * 0.8, canvas.height * 0.2, 320, 'rgb(36, 189, 104)', 0.3),
      new Blob(canvas.width * 0.4, canvas.height * 0.5, 200, 'rgb(0, 167, 126)', 0.25),
    ]

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

  const copyCredentials = async () => {
    try { await navigator.clipboard.writeText(`${DEMO_USERNAME}\n${DEMO_PASSWORD}`) } catch {}
  }
  const pasteUsername = () => setUsername(DEMO_USERNAME)
  const pastePassword = () => setPassword(DEMO_PASSWORD)
  const fillBoth = () => { setUsername(DEMO_USERNAME); setPassword(DEMO_PASSWORD) }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!username || !password) { setError('Please enter username and password'); return }
    const success = await login(username, password)
    if (success) navigate('/pos')
    else setError('Invalid username or password')
  }

  // Inline styles for glass card (works with Tailwind v4)
  const cardStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    border: '1px solid rgba(255, 255, 255, 0.7)',
    borderRadius: '2rem',
    padding: '2.5rem',
    boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08)',
    position: 'relative',
    overflow: 'hidden',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '56px',
    paddingLeft: '48px',
    paddingRight: '16px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.5)',
    border: '2px solid rgba(226, 232, 240, 0.8)',
    fontSize: '16px',
    fontWeight: 500,
    color: BRAND.charcoal,
    outline: 'none',
    transition: 'all 0.3s',
  }

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    height: '64px',
    borderRadius: '16px',
    background: `linear-gradient(135deg, ${BRAND.darkBlue} 0%, ${BRAND.deepTeal} 25%, ${BRAND.teal} 50%, ${BRAND.green} 75%, ${BRAND.teal} 100%)`,
    backgroundSize: '200% 100%',
    color: 'white',
    fontSize: '18px',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    boxShadow: `0 8px 32px ${BRAND.green}40`,
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  }

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(to bottom right, #f8fafc, white, rgba(236, 253, 245, 0.3))'
    }}>
      {/* Canvas Background */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'blur(80px)' }} />

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(36, 189, 104, 0.15) 0%, transparent 50%),
                     radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, rgba(0, 167, 126, 0.1) 0%, transparent 40%)`,
        transition: 'all 2s ease-out',
      }} />

      {/* Subtle grid pattern */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.02,
        backgroundImage: `radial-gradient(circle at 1px 1px, ${BRAND.charcoal} 1px, transparent 0)`,
        backgroundSize: '32px 32px',
      }} />

      {/* Noise texture for glass effect */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.015, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      {/* Main Content */}
      <div style={{
        position: 'relative', zIndex: 10,
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '48px 16px',
      }}>
        {/* Logo Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }} className="animate-fade-in">
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
            <div style={{
              position: 'absolute', inset: 0,
              filter: 'blur(48px)', transform: 'scale(1.5)', opacity: 0.5,
              background: `linear-gradient(135deg, ${BRAND.green}40, ${BRAND.teal}30, ${BRAND.deepTeal}20)`,
            }} />
            <img src="/octili-primary-logo.svg" alt="Octili" style={{ position: 'relative', height: '160px', width: 'auto', margin: '0 auto' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, color: BRAND.charcoal, letterSpacing: '-0.025em' }}>Cashier</h1>
          <p style={{ fontSize: '1.125rem', fontWeight: 500, color: BRAND.darkBlue }}>POS Terminal</p>
        </div>

        {/* Glass Card */}
        <div style={{ width: '100%', maxWidth: '512px', position: 'relative' }} className="animate-slide-up group">
          {/* Card outer glow on hover */}
          <div style={{
            position: 'absolute', inset: '-4px', borderRadius: '2.25rem',
            filter: 'blur(20px)', opacity: 0,
            background: `linear-gradient(135deg, ${BRAND.green}20, ${BRAND.teal}15, ${BRAND.deepTeal}10)`,
            transition: 'opacity 0.7s',
          }} className="group-hover:opacity-100" />
          <div style={cardStyle}>
            {/* Inner glass shine */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '2rem', pointerEvents: 'none',
              background: 'linear-gradient(to bottom right, rgba(255,255,255,0.7), rgba(255,255,255,0.3), transparent)',
            }} />
            {/* Animated border glow */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '2rem', opacity: 0.4, pointerEvents: 'none',
              background: `conic-gradient(from ${mousePosition.x * 3.6}deg at 50% 50%, transparent 0deg, ${BRAND.green}30 60deg, ${BRAND.teal}20 120deg, transparent 180deg)`,
            }} />
            {/* Secure Login Badge */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '9999px',
                background: `linear-gradient(135deg, ${BRAND.green}15, ${BRAND.teal}10)`,
                border: `1px solid ${BRAND.green}30`,
              }}>
                <Sparkles style={{ width: '16px', height: '16px', color: BRAND.green }} />
                <span style={{ fontSize: '14px', fontWeight: 600, color: BRAND.darkBlue }}>Secure Login</span>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div style={{
                marginBottom: '24px', padding: '16px',
                background: 'rgba(254, 226, 226, 0.8)', border: '1px solid rgba(254, 202, 202, 0.6)',
                borderRadius: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px',
              }} className="animate-shake">
                <AlertCircle style={{ width: '20px', height: '20px', color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#b91c1c' }}>Login Failed</p>
                  <p style={{ fontSize: '14px', color: '#dc2626', marginTop: '4px' }}>{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: BRAND.darkBlue, marginBottom: '8px' }}>Username</label>
                <div style={{ position: 'relative' }}>
                  <User style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#94a3b8' }} />
                  <input
                    type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                    placeholder="cashier" autoComplete="username"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = BRAND.green; e.target.style.background = 'rgba(255,255,255,0.7)' }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(226, 232, 240, 0.8)'; e.target.style.background = 'rgba(255,255,255,0.5)' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: BRAND.darkBlue, marginBottom: '8px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#94a3b8' }} />
                  <input
                    type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password" autoComplete="current-password"
                    style={{ ...inputStyle, paddingRight: '56px' }}
                    onFocus={(e) => { e.target.style.borderColor = BRAND.green; e.target.style.background = 'rgba(255,255,255,0.7)' }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(226, 232, 240, 0.8)'; e.target.style.background = 'rgba(255,255,255,0.5)' }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}>
                    {showPassword ? <EyeOff style={{ width: '20px', height: '20px' }} /> : <Eye style={{ width: '20px', height: '20px' }} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ width: '20px', height: '20px', accentColor: BRAND.green, cursor: 'pointer' }} />
                  <span style={{ fontSize: '14px', fontWeight: 500, color: BRAND.darkBlue }}>Remember me</span>
                </label>
                <button type="button" style={{ background: 'none', border: 'none', fontSize: '14px', fontWeight: 600, color: BRAND.green, cursor: 'pointer' }}>
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={isLoading} style={buttonStyle}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
              >
                {isLoading ? (
                  <><Loader2 style={{ width: '24px', height: '24px', animation: 'spin 1s linear infinite' }} /><span>Signing in...</span></>
                ) : (
                  <><span>Sign in to Dashboard</span><ArrowRight style={{ width: '20px', height: '20px' }} /></>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(226, 232, 240, 0.5)' }}>
              <p style={{ fontSize: '12px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: BRAND.darkBlue, opacity: 0.6, marginBottom: '16px' }}>
                Demo Credentials
              </p>
              <div style={{
                padding: '16px', borderRadius: '12px',
                background: `linear-gradient(135deg, ${BRAND.green}08, ${BRAND.teal}05)`,
                border: `1px solid ${BRAND.green}20`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: BRAND.darkBlue }}>Username</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <code style={{ fontSize: '14px', fontFamily: 'monospace', fontWeight: 600, padding: '4px 12px', borderRadius: '8px', color: BRAND.green, background: `${BRAND.green}15` }}>{DEMO_USERNAME}</code>
                    <button type="button" onClick={pasteUsername} style={{ padding: '6px', borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer' }} title="Paste">
                      <ClipboardPaste style={{ width: '16px', height: '16px', color: BRAND.teal }} />
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: BRAND.darkBlue }}>Password</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <code style={{ fontSize: '14px', fontFamily: 'monospace', fontWeight: 600, padding: '4px 12px', borderRadius: '8px', color: BRAND.green, background: `${BRAND.green}15` }}>{DEMO_PASSWORD}</code>
                    <button type="button" onClick={pastePassword} style={{ padding: '6px', borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer' }} title="Paste">
                      <ClipboardPaste style={{ width: '16px', height: '16px', color: BRAND.teal }} />
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid rgba(226, 232, 240, 0.3)' }}>
                  <button type="button" onClick={copyCredentials} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: BRAND.darkBlue, background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Copy style={{ width: '16px', height: '16px' }} />Copy All
                  </button>
                  <button type="button" onClick={fillBoth} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: 'white', background: BRAND.green, border: 'none', cursor: 'pointer' }}>
                    <ClipboardPaste style={{ width: '16px', height: '16px' }} />Fill Both
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: '14px', marginTop: '48px', fontWeight: 500, color: BRAND.darkBlue, opacity: 0.6 }}>
          © {new Date().getFullYear()} Octili IT Consulting. All rights reserved.
        </p>
      </div>
    </div>
  )
}
