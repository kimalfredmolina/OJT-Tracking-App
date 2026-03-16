import React, { useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedBorderlineCard from './AnimatedBorderlineCard'

const SetupOjtModal = ({ isOpen, onClose }) => {
  const [selectedHours, setSelectedHours] = useState(null)
  const [customHours, setCustomHours] = useState('')

  const handlePresetClick = (val) => {
    setSelectedHours(val)
    setCustomHours('')
  }

  const handleCustomChange = (e) => {
    setCustomHours(e.target.value)
    setSelectedHours(null)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen z-[100] flex items-center justify-center p-4 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative z-10 w-full max-w-md mx-auto my-auto"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          >
            <AnimatedBorderlineCard innerClassName="bg-[#1e2335] px-8 py-10 shadow-2xl flex flex-col mx-auto">
              
              <h2 className="text-xl font-medium text-white mb-8 text-center px-4">
                Let's set up your OJT tracking. How many hours do you need to complete?
              </h2>
              
              <div className="mb-6">
                <label className="text-sm font-medium text-[#8e98b0] mb-3 block">
                  Target OJT Hours <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {[300, 486, 600].map(val => (
                    <button
                      key={val}
                      onClick={() => handlePresetClick(val)}
                      className={`py-3 rounded-xl border font-semibold transition-all ${
                        selectedHours === val 
                          ? 'bg-[#2b3a55] border-[#519cf2] text-white shadow-[0_0_10px_rgba(81,156,242,0.2)]'
                          : 'bg-[#1a1f30] border-white/5 text-[#8e98b0] hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {val} hrs
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Or enter custom hours..."
                  value={customHours}
                  onChange={handleCustomChange}
                  className="w-full bg-[#101421] border border-white/5 rounded-xl px-4 py-3.5 text-white placeholder-[#4e5873] focus:outline-none focus:border-[#519cf2] focus:ring-1 focus:ring-[#519cf2] transition-all"
                />
                <p className="text-xs text-[#4e5873] mt-2">Select above or enter your required hours</p>
              </div>

              <div className="mb-8">
                <label className="text-sm font-medium text-[#8e98b0] mb-3 block">
                  Target End Date (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-[#4e5873]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="date"
                    className="w-full bg-[#101421] border border-white/5 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-[#519cf2] focus:ring-1 focus:ring-[#519cf2] transition-all [color-scheme:dark]"
                  />
                </div>
                <p className="text-xs text-[#4e5873] mt-2">Set a deadline to track your pace</p>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-[#c8b89a] hover:bg-[#b5a383] text-[#0d0d0f] font-bold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(200,184,154,0.3)] hover:shadow-[0_6px_20px_rgba(200,184,154,0.4)] hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Start Tracking
              </button>
            </AnimatedBorderlineCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default SetupOjtModal
