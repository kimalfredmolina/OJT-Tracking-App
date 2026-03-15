import React, { useState } from 'react'

const PAD = (n) => String(n).padStart(2, '0')

const createDefaultEntry = () => {
  const today = new Date().toISOString().slice(0, 10)

  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    date: today,
    timeIn: { h: 9, m: 30, p: 'AM' },
    timeOut: { h: 6, m: 30, p: 'PM' },
    notes: '',
  }
}

const BulkAddModal = ({ isOpen, onClose, onSave }) => {
  const [entries, setEntries] = useState([createDefaultEntry()])

  if (!isOpen) return null

  const handleChange = (id, field, value) => {
    setEntries(prev =>
      prev.map(e => (e.id === id ? { ...e, [field]: value } : e)),
    )
  }

  const handleTimeChange = (id, part, key, value) => {
    setEntries(prev =>
      prev.map(e => {
        if (e.id !== id) return e

        const updated = { ...e[part] }

        if (key === 'h') {
          updated.h = Math.min(12, Math.max(1, Number(value)))
        }

        if (key === 'm') {
          updated.m = Math.min(59, Math.max(0, Number(value)))
        }

        if (key === 'p') {
          updated.p = value
        }

        return { ...e, [part]: updated }
      }),
    )
  }

  const handleAddRow = () => {
    setEntries(prev => [...prev, createDefaultEntry()])
  }

  const handleRemove = (id) => {
    setEntries(prev =>
      prev.length <= 1 ? prev : prev.filter(e => e.id !== id),
    )
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

          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 overflow-y-auto">
          {entries.map((entry, idx) => (
            <div
              key={entry.id}
              className="rounded-2xl px-4 py-4"
              style={{
                backgroundColor: 'var(--surface-alt)',
                border: '1px solid var(--border)',
              }}
            >

              {/* Entry Header */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-[0.7rem] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ color: 'var(--accent)', backgroundColor: 'var(--accent-bg)' }}
                >
                  Entry {idx + 1}
                </span>

                <button
                  type="button"
                  onClick={() => handleRemove(entry.id)}
                  className="text-[0.7rem]"
                  style={{ color: 'var(--muted)' }}
                >
                  Remove
                </button>
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* Date */}
                <div>
                  <label className="block text-[0.72rem] uppercase mb-1.5"
                    style={{ color: 'var(--muted)' }}>
                    Date
                  </label>

                  <input
                    type="date"
                    value={entry.date}
                    onChange={e => handleChange(entry.id, 'date', e.target.value)}
                    className="theme-input w-full rounded-xl px-4 py-2.5 text-[0.85rem]"
                  />
                </div>

                {['timeIn', 'timeOut'].map(part => (
                  <div key={part}>

                    <label
                      className="block text-[0.72rem] uppercase mb-1.5"
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

                      {/* Hour */}
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={PAD(entry[part].h)}
                        onChange={e =>
                          handleTimeChange(entry.id, part, 'h', e.target.value)
                        }
                        className="w-8 bg-transparent text-center focus:outline-none"
                        style={{ color: 'var(--text)' }}
                      />

                      <span style={{ color: 'var(--muted)' }}>:</span>

                      {/* Minute */}
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={PAD(entry[part].m)}
                        onChange={e =>
                          handleTimeChange(entry.id, part, 'm', e.target.value)
                        }
                        className="w-8 bg-transparent text-center focus:outline-none"
                        style={{ color: 'var(--text)' }}
                      />

                      {/* AM PM */}
                      <select
                        value={entry[part].p}
                        onChange={e =>
                          handleTimeChange(entry.id, part, 'p', e.target.value)
                        }
                        className="ml-1 bg-transparent text-[0.7rem]"
                        style={{ color: 'var(--muted)' }}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>

                    </div>
                  </div>
                ))}

              </div>

              {/* Notes */}
              <div className="mt-4">
                <label className="block text-[0.72rem] uppercase mb-1.5"
                  style={{ color: 'var(--muted)' }}>
                  Notes
                </label>

                <textarea
                  rows={2}
                  value={entry.notes}
                  onChange={e => handleChange(entry.id, 'notes', e.target.value)}
                  className="theme-input w-full rounded-xl px-4 py-2.5 text-[0.85rem]"
                  placeholder="Describe the work for this entry…"
                />
              </div>

            </div>
          ))}

          {/* Add Row */}
          <button
            type="button"
            onClick={handleAddRow}
            className="w-full py-2.5 rounded-xl border-dashed text-[0.8rem]"
            style={{
              borderWidth: '1px',
              borderColor: 'var(--border)',
              color: 'var(--muted)',
            }}
          >
            + Add Another Row
          </button>
        </div>

        {/* Footer */}
        <div
          className="flex gap-3 px-6 py-4"
          style={{ borderTop: '1px solid var(--border)' }}
        >

          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl"
            style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}
          >
            Cancel
          </button>

          <button
            onClick={handleSaveAll}
            className="flex-1 py-2.5 rounded-xl font-medium"
            style={{
              background: 'linear-gradient(135deg, #c8b89a, #a89070)',
              color: '#0d0d0f',
            }}
          >
            Add All Entries
          </button>
        </div>
      </div>
    </div>
  )
}

export default BulkAddModal