import React, { useState } from 'react'
import { addBulkLogs, getCurrentUser } from '../firebase'
import DatePicker from './DatePicker'
import { TimePicker } from './TimePicker'
import { formatHours } from '../utils/format'

const toMin = ({ h, m, p }) => { let hr = h % 12; if (p === 'PM') hr += 12; return hr * 60 + m }

const limitWords = (value, maxWords) => {
  const words = String(value || '').trim().split(/\s+/).filter(Boolean)
  if (words.length <= maxWords) return value
  return words.slice(0, maxWords).join(' ')
}

const createDefaultEntry = () => ({
  id:      crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
  logDate: new Date().toISOString().slice(0, 10),
  timeIn:  { h: 8, m: 0, p: 'AM' },
  timeOut: { h: 5, m: 0, p: 'PM' },
  breakHr: 1,
  notes:   '',
})

const BulkAddModal = ({ isOpen, onClose, onSave }) => {
  const [entries, setEntries] = useState([createDefaultEntry()])
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')

  if (!isOpen) return null

  const handleChange = (id, field, value) =>
    setEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e))

  const handleTimeChange = (id, part, val) =>
    setEntries(prev => prev.map(e => e.id === id ? { ...e, [part]: val } : e))

  const handleAddRow = () => setEntries(prev => [...prev, createDefaultEntry()])
  const handleRemove = (id) => setEntries(prev => prev.length <= 1 ? prev : prev.filter(e => e.id !== id))

  const handleSaveAll = async () => {
    const user = getCurrentUser()
    if (!user) { setError('You must be signed in to save logs.'); return }
    setSaving(true); setError('')
    try {
      await addBulkLogs(user.uid, entries)
      onSave?.(entries)
      setEntries([createDefaultEntry()])
      onClose()
    } catch (err) {
      setError('Save failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-visible flex flex-col"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-modal)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <h2 className="text-[1rem] font-semibold" style={{ color: 'var(--text)' }}>Bulk Add Entries</h2>
            <p className="text-[0.75rem] mt-0.5" style={{ color: 'var(--muted)' }}>Quickly add multiple OJT logs at once.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ color: 'var(--muted)' }}>✕</button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 overflow-y-auto">
          {entries.map((entry, idx) => {
            const raw = (toMin(entry.timeOut) - toMin(entry.timeIn)) / 60
            const net = Math.max(0, raw - (entry.breakHr || 0))
            return (
              <div key={entry.id} className="rounded-2xl px-4 py-4"
                style={{ backgroundColor: 'var(--surface-alt)', border: '1px solid var(--border)' }}>

                {/* Entry Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ color: 'var(--accent)', backgroundColor: 'var(--accent-bg)' }}>
                    Entry {idx + 1}
                  </span>
                  <button type="button" onClick={() => handleRemove(entry.id)} className="text-[0.7rem]"
                    style={{ color: 'var(--muted)' }}>Remove</button>
                </div>

                {/* Date + Time */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[0.72rem] uppercase mb-1.5" style={{ color: 'var(--muted)' }}>Date</label>
                    <DatePicker value={entry.logDate} onChange={val => handleChange(entry.id, 'logDate', val)} />
                  </div>
                  <div>
                    <label className="block text-[0.72rem] uppercase mb-1.5" style={{ color: 'var(--muted)' }}>Time In</label>
                    <TimePicker value={entry.timeIn} onChange={val => handleTimeChange(entry.id, 'timeIn', val)} />
                  </div>
                  <div>
                    <label className="block text-[0.72rem] uppercase mb-1.5" style={{ color: 'var(--muted)' }}>Time Out</label>
                    <TimePicker value={entry.timeOut} onChange={val => handleTimeChange(entry.id, 'timeOut', val)} />
                  </div>
                </div>

                {/* Hours info banner */}
                <div className="flex items-start gap-3 px-4 py-3 rounded-xl mt-4"
                  style={{ backgroundColor: 'var(--accent-bg)', border: '1px solid rgba(200,184,154,0.25)' }}>
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" style={{ color: 'var(--accent)' }}>
                    <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 8v4l3 3" />
                  </svg>
                  <p className="text-[0.77rem] leading-relaxed" style={{ color: 'var(--accent)' }}>
                    You worked for <strong>{formatHours(raw)} hrs</strong>. Only <strong>{formatHours(net)} hrs</strong> counted due to <strong>{entry.breakHr || 0} hr</strong> break.
                  </p>
                </div>

                {/* Break */}
                <div className="mt-4">
                  <label className="block text-[0.72rem] uppercase tracking-widest mb-1.5" style={{ color: 'var(--muted)' }}>Break</label>
                  <select value={entry.breakHr} onChange={e => handleChange(entry.id, 'breakHr', +e.target.value)}
                    className="theme-input w-full rounded-xl px-4 py-2.5 text-[0.85rem] cursor-pointer">
                    {[0, 0.5, 1, 1.5, 2].map(v => (<option key={v} value={v}>{v === 0 ? 'No break' : `${v} hr`}</option>))}
                  </select>
                </div>

                {/* Notes */}
                <div className="mt-4">
                  <label className="block text-[0.72rem] uppercase mb-1.5" style={{ color: 'var(--muted)' }}>Notes</label>
                  <textarea rows={2} value={entry.notes}
                    onChange={e => handleChange(entry.id, 'notes', limitWords(e.target.value, 30))}
                    className="theme-input w-full rounded-xl px-4 py-2.5 text-[0.85rem]"
                    placeholder="Describe the work for this entry…"
                  />
                </div>
              </div>
            )
          })}

          {/* Add Row */}
          <button type="button" onClick={handleAddRow}
            className="w-full py-2.5 rounded-xl border-dashed text-[0.8rem]"
            style={{ borderWidth: '1px', borderColor: 'var(--border)', color: 'var(--muted)' }}>
            + Add Another Row
          </button>

          {error && (
            <p className="text-[0.78rem] px-4 py-2 rounded-xl"
              style={{ color: '#e07070', backgroundColor: 'rgba(224,112,112,0.1)', border: '1px solid rgba(224,112,112,0.25)' }}>
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4" style={{ borderTop: '1px solid var(--border)' }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl"
            style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}>Cancel</button>
          <button onClick={handleSaveAll} disabled={saving}
            className="flex-1 py-2.5 rounded-xl font-medium"
            style={{
              background: saving ? 'rgba(200,184,154,0.4)' : 'linear-gradient(135deg, #c8b89a, #a89070)',
              color: '#0d0d0f',
              cursor: saving ? 'not-allowed' : 'pointer',
            }}>
            {saving ? 'Saving…' : `Add All Entries (${entries.length})`}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BulkAddModal
