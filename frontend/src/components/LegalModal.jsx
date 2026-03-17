import React, { useEffect, useState } from 'react'
import Terms from './Terms'
import Privacy from './Privacy'

const LegalModal = ({ isOpen, onClose, defaultTab = 'terms' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab)

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab)
    }
  }, [defaultTab, isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-white/10 bg-[#121216] shadow-[0_40px_120px_rgba(0,0,0,0.65)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-[#7a7a8a]">
              OJT Tracking Platform
            </p>
            <h2
              className="text-xl text-[#f0ede8]"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              {activeTab === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
            </h2>
          </div>
          <button
            type="button"
            className="h-9 w-9 rounded-full border border-white/10 text-[#c8b89a] hover:text-[#7a6a5a] hover:border-white/20"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-2 px-6 pt-4">
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 text-sm rounded-full border ${
              activeTab === 'terms'
                ? 'border-[#c8b89a] text-[#c8b89a]'
                : 'border-white/10 text-[#7a7a8a] hover:text-[#c8b89a]'
            }`}
          >
            Terms
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 text-sm rounded-full border ${
              activeTab === 'privacy'
                ? 'border-[#c8b89a] text-[#c8b89a]'
                : 'border-white/10 text-[#7a7a8a] hover:text-[#c8b89a]'
            }`}
          >
            Privacy
          </button>
        </div>

        <div className="px-6 pb-6 pt-4 max-h-[70vh] overflow-y-auto activity-scroll text-sm text-[#c9c6c1] leading-relaxed">
          {activeTab === 'terms' ? <Terms /> : <Privacy />}
        </div>
      </div>
    </div>
  )
}

export default LegalModal
