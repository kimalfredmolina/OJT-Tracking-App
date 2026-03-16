import React, { useState } from 'react'
import { saveSettings, getCurrentUser } from '../firebase'

const SetupOjtModal = ({ isOpen, onClose }) => {
  const [requiredHours, setRequiredHours] = useState(500)
  const [saving,        setSaving]        = useState(false)
  const [error,         setError]         = useState('')

  if (!isOpen) return null

  const handleSave = async () => {
    if (!requiredHours || requiredHours < 1) {
      setError('Please enter a valid number of required hours.')
      return
    }

    const user = getCurrentUser()
    if (!user) {
      setError('You must be signed in to save settings.')
      return
    }

    setSaving(true)
    setError('')

    try {
      await saveSettings(user.uid, {
        requiredHours: Number(requiredHours),
      })
      onClose()
    } catch (err) {
      setError('Failed to save: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-visible"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-modal)',
        }}
      >
        {/* Header */}
        <div className="px-6 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="text-[1rem] font-semibold" style={{ color: 'var(--text)' }}>
            Set Up Your OJT
          </h2>
          <p className="text-[0.75rem] mt-0.5" style={{ color: 'var(--muted)' }}>
            Configure your internship details to get started.
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Required Hours */}
          <div>
            <label className="block text-[0.72rem] uppercase tracking-widest mb-1.5" style={{ color: 'var(--muted)' }}>
              Required Hours *
            </label>
            <input
              type="number"
              min="1"
              value={requiredHours}
              onChange={e => setRequiredHours(e.target.value)}
              className="theme-input w-full rounded-xl px-4 py-2.5 text-[0.85rem]"
              placeholder="e.g. 500"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-[0.78rem] px-4 py-2 rounded-xl" style={{ color: '#e07070', backgroundColor: 'rgba(224,112,112,0.1)', border: '1px solid rgba(224,112,112,0.25)' }}>
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl text-[0.875rem] font-medium"
            style={{
              background: saving ? 'rgba(200,184,154,0.4)' : 'linear-gradient(135deg, #c8b89a, #a89070)',
              color: '#0d0d0f',
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Saving…' : 'Save & Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SetupOjtModal
