import React, { useState } from 'react'

const PAD = (n) => String(n).padStart(2, '0')
const timeToMin = (h, m) => h * 60 + m

const createDefaultEntry = () => {
  const today = new Date().toISOString().slice(0, 10)
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    date: today,
    timeIn: { h: 8, m: 0 },
    timeOut: { h: 17, m: 0 },
    breakHr: 1,
    notes: '',
  }
}

/**
 * BulkAddModal
 * @prop {boolean}  isOpen    – controls visibility
 * @prop {function} onClose   – called when modal should close
 * @prop {function} onSave    – called with entries array when "Add All Entries" is clicked
 */
const BulkAddModal = ({ isOpen, onClose, onSave }) => {
  const [entries, setEntries] = useState([createDefaultEntry()])

  if (!isOpen) return null

  const handleChange = (id, field, value) => {
    setEntries(prev =>
      prev.map(e => (e.id === id ? { ...e, [field]: value } : e)),
    )
  }

  const handleTimeChange = (id, key, part, raw) => {
    const v = Number(raw.replace(/\D/g, '')) || 0
    const clamped = key === 'h' ? Math.min(23, Math.max(0, v)) : Math.min(59, Math.max(0, v))
    setEntries(prev =>
      prev.map(e =>
        e.id === id ? { ...e, [part]: { ...e[part], [key]: clamped } } : e,
      ),
    )
  }

  const handleAddRow = () => {
    setEntries(prev => [...prev, createDefaultEntry()])
  }

  const handleRemove = (id) => {
    setEntries(prev => (prev.length <= 1 ? prev : prev.filter(e => e.id !== id)))
  }

  const handleSaveAll = () => {
    onSave?.(entries)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-modal)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div>
            <h2 className="text-[1rem] font-semibold" style={{ color: 'var(--text)' }}>
              Bulk Add Entries
            </h2>
            <p className="text-[0.75rem] mt-0.5" style={{ color: 'var(--muted)' }}>
              Quickly add multiple OJT logs at once.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
            style={{ color: 'var(--muted)' }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'rgba(128,128,128,0.1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 overflow-y-auto">
          {entries.map((entry, idx) => (
            <div
              key={entry.id}
              className="rounded-2xl px-4 py-4 mb-2"
              style={{
                backgroundColor: 'var(--surface-alt)',
                border: '1px solid var(--border)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[0.7rem] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ color: 'var(--accent)', backgroundColor: 'var(--accent-bg)' }}
                  >
                    Entry {idx + 1}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(entry.id)}
                  className="flex items-center gap-1 text-[0.7rem]"
                  style={{ color: 'var(--muted)' }}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M10 7V5h4v2m-7 0v12a2 2 0 002 2h6a2 2 0 002-2V7" />
                  </svg>
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Date */}
                <div>
                  <label
                    className="block text-[0.72rem] uppercase tracking-widest mb-1.5"
                    style={{ color: 'var(--muted)' }}
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    value={entry.date}
                    onChange={e => handleChange(entry.id, 'date', e.target.value)}
                    className="theme-input w-full rounded-xl px-4 py-2.5 text-[0.85rem]"
                  />
                </div>

                {/* Time In */}
                {['timeIn', 'timeOut'].map(part => (
                  <div key={part}>
                    <label
                      className="block text-[0.72rem] uppercase tracking-widest mb-1.5"
                      style={{ color: 'var(--muted)' }}
                    >
                      {part === 'timeIn' ? 'Time In' : 'Time Out'}
                    </label>
                    <div
                      className="flex items-center gap-1 rounded-xl px-3 py-2.5"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={PAD(entry[part].h)}
                        onChange={e => handleTimeChange(entry.id, 'h', part, e.target.value)}
                        className="w-8 bg-transparent text-[0.85rem] text-center focus:outline-none"
                        style={{ color: 'var(--text)' }}
                      />
                      <span style={{ color: 'var(--muted)' }}>:</span>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={PAD(entry[part].m)}
                        onChange={e => handleTimeChange(entry.id, 'm', part, e.target.value)}
                        className="w-8 bg-transparent text-[0.85rem] text-center focus:outline-none"
                        style={{ color: 'var(--text)' }}
                      />
                      <span
                        className="text-[0.7rem] ml-1"
                        style={{ color: 'var(--muted)' }}
                      >
                        {entry[part].h < 12 ? 'AM' : 'PM'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hours info banner */}
              {(() => {
                const rawHours = (timeToMin(entry.timeOut.h, entry.timeOut.m) - timeToMin(entry.timeIn.h, entry.timeIn.m)) / 60
                const computedHours = Math.max(0, rawHours - entry.breakHr)
                return (
                  <div className="flex items-start gap-3 px-4 py-3 rounded-xl mt-4" style={{ backgroundColor: 'var(--accent-bg)', border: '1px solid rgba(200,184,154,0.25)' }}>
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" style={{ color: 'var(--accent)' }}>
                      <circle cx="12" cy="12" r="10" />
                      <path strokeLinecap="round" d="M12 8v4l3 3" />
                    </svg>
                    <p className="text-[0.77rem] leading-relaxed" style={{ color: 'var(--accent)' }}>You worked for <strong>{rawHours.toFixed(1)} hrs</strong>. Only <strong>{computedHours.toFixed(1)} hrs</strong> counted due to <strong>{entry.breakHr} hr</strong> break.</p>
                  </div>
                )
              })()}

              {/* Break */}
              <div className="mt-4">
                <label
                  className="block text-[0.72rem] uppercase tracking-widest mb-1.5"
                  style={{ color: 'var(--muted)' }}
                >
                  Break
                </label>
                <select
                  value={entry.breakHr}
                  onChange={e => handleChange(entry.id, 'breakHr', +e.target.value)}
                  className="theme-input w-full rounded-xl px-4 py-2.5 text-[0.85rem] cursor-pointer"
                >
                  {[0, 0.5, 1, 1.5, 2].map(v => (<option key={v} value={v}>{v === 0 ? 'No break' : `${v} hr`}</option>))}
                </select>
              </div>

              {/* Notes */}
              <div className="mt-4">
                <label
                  className="block text-[0.72rem] uppercase tracking-widest mb-1.5"
                  style={{ color: 'var(--muted)' }}
                >
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={entry.notes}
                  onChange={e => handleChange(entry.id, 'notes', e.target.value)}
                  placeholder="Describe the work for this entry…"
                  className="theme-input w-full rounded-xl px-4 py-2.5 text-[0.85rem] resize-none"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddRow}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[0.8rem] font-medium border-dashed"
            style={{
              borderWidth: '1px',
              borderColor: 'var(--border)',
              color: 'var(--muted)',
            }}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Another Row
          </button>
        </div>

        {/* Footer */}
        <div
          className="flex items-center gap-3 px-6 py-4"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[0.875rem] transition-all duration-200"
            style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--border-hover)'
              e.currentTarget.style.color = 'var(--accent)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--muted)'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAll}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[0.875rem] font-medium transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            style={{
              background: 'linear-gradient(135deg, #c8b89a, #a89070)',
              color: '#0d0d0f',
              boxShadow: '0 2px 8px rgba(200,184,154,0.25)',
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 7h16M4 12h16M4 17h16"
              />
            </svg>
            Add All Entries
          </button>
        </div>
      </div>
    </div>
  )
}

export default BulkAddModal

