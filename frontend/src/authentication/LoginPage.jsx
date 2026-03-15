import React, { useState } from 'react'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../firebase'
import AnimatedBorderlineCard from '../components/AnimatedBorderlineCard'

const googleProvider = new GoogleAuthProvider()

const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await signInWithPopup(auth, googleProvider)

      const user = result.user
      console.log('Signed in as:', user.displayName, user.email)
    } catch (err) {
      console.error('Sign-in error:', err)
      setError('Sign-in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#0d0d0f] font-sans min-h-screen flex items-center justify-center overflow-hidden relative">

      <div className="fixed -top-36 -left-36 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none blur-[90px]"
        style={{ background: 'radial-gradient(circle, #c8b89a, transparent)' }} />
      <div className="fixed -bottom-24 -right-24 w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none blur-[90px]"
        style={{ background: 'radial-gradient(circle, #7a6a5a, transparent)' }} />

      <AnimatedBorderlineCard className="relative z-10" innerClassName="bg-[#16161a] px-10 py-12 shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 left-6 right-6 h-px rounded-b"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(200,184,154,0.4), transparent)' }} />

        <div className="w-11 h-11 rounded-xl mb-9 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #c8b89a, #8a7a6a)' }}>
          <svg className="w-5 h-5 fill-current text-[#0d0d0f]" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>

        <h1 className="text-[2rem] font-normal tracking-tight text-[#f0ede8] leading-tight mb-2"
          style={{ fontFamily: "'DM Serif Display', serif" }}>
          Welcome back
        </h1>
        <p className="text-sm font-light text-[#7a7a8a] mb-10 leading-relaxed">
          Sign in to continue to your workspace.
        </p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <div className="relative flex items-center mb-6">
          <div className="flex-1 h-px bg-white/[0.07]" />
          <span className="mx-3 text-[0.7rem] uppercase tracking-widest text-[#7a7a8a]">
            Continue with
          </span>
          <div className="flex-1 h-px bg-white/[0.07]" />
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex items-center justify-center gap-3 w-full py-3.5 px-5 text-[#c8b89a] hover:text-[#7a6a5a] font-medium text-[0.9375rem] border border-[#c8b89a] rounded-xl cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]  transition-all duration-200  hover:bg-[#FFFFFF] hover:border-[#2b3b57]  hover:-translate-y-0.5  active:translate-y-0 tracking-tight"
        >
          {loading ? (
            <svg className="w-5 h-5 animate-spin text-[#888]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" className="shrink-0">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          )}
          {loading ? 'Signing in…' : 'Sign in with Google'}
        </button>

        <p className="mt-8 text-center text-[0.75rem] text-[#7a7a8a] leading-relaxed">
          By signing in, you agree to our{' '}
          <a href="#" className="text-[#c8b89a] hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-[#c8b89a] hover:underline">Privacy Policy</a>.
        </p>
      </AnimatedBorderlineCard>
    </div>
  )
}

export default LoginPage