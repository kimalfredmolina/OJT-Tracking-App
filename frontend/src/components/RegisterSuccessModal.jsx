import React from 'react'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedBorderlineCard from './AnimatedBorderlineCard'

const RegisterSuccessModal = ({ isOpen, onClose, userEmail }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative z-10 w-full max-w-sm"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          >
            <AnimatedBorderlineCard innerClassName="bg-[#1e2335] px-8 py-10 shadow-2xl flex flex-col items-center text-center">
              
              <div className="w-16 h-16 rounded-full bg-[#2ccd90] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(44,205,144,0.3)]">
                <svg className="w-8 h-8 text-white stroke-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">Register Successful!</h2>
              <p className="text-[#8e98b0] text-sm mb-4">
                Your account has been created successfully.
              </p>
              
              <p className="text-[#519cf2] font-medium mb-8">
                {userEmail || '@user'}
              </p>

              <div className="bg-[#101421] w-full rounded-xl p-4 mb-6 flex items-center justify-center gap-2 border border-white/5">
                <span className="text-lg">⏱️</span>
                <span className="text-[#8e98b0] text-sm leading-tight max-w-[200px]">
                  You're all set to start tracking your OJT hours!
                </span>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-[#c8b89a] hover:bg-[#b5a383] text-[#0d0d0f] font-bold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(200,184,154,0.3)] hover:shadow-[0_6px_20px_rgba(200,184,154,0.4)] hover:-translate-y-0.5 active:translate-y-0"
              >
                Continue to Dashboard
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </AnimatedBorderlineCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default RegisterSuccessModal
