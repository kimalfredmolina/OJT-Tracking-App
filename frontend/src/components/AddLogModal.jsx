import React, { useEffect, useMemo, useState } from 'react'
import { addLog, deleteLog, getCurrentUser, updateLog } from '../firebase'
import DatePicker from './DatePicker'
import { TimePicker } from './TimePicker'
import { formatHours } from '../utils/format'

const toMinutes = ({ h, m, p }) => {
  let hour = h % 12
  if (p === 'PM') hour += 12
  return hour * 60 + m
}

const parseTimeStr = (value, fallback) => {
  const match = String(value || '').match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return fallback
  const h = Math.min(12, Math.max(1, Number(match[1])))
  const m = Math.min(59, Math.max(0, Number(match[2])))
  const p = match[3].toUpperCase() === 'PM' ? 'PM' : 'AM'
  return { h, m, p }
}

const limitWords = (value, maxWords) => {
  const words = String(value || '').trim().split(/\s+/).filter(Boolean)
  if (words.length <= maxWords) return value
  return words.slice(0, maxWords).join(' ')
}

const AddLogModal = ({ isOpen, onClose, onSave, isDark, initialLog = null, initialDate = '' }) => {
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const isEdit = Boolean(initialLog && initialLog.id)

  const [logDate,  setLogDate]  = useState(todayStr)
  const [timeIn,   setTimeIn]   = useState({ h: 8,  m: 0, p: 'AM' })
  const [timeOut,  setTimeOut]  = useState({ h: 5,  m: 0, p: 'PM' })
  const [breakHr,  setBreakHr]  = useState(1)
  const [notes,    setNotes]    = useState('')
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')

  const rawHours      = (toMinutes(timeOut) - toMinutes(timeIn)) / 60
  const computedHours = Math.max(0, rawHours - breakHr)

  useEffect(() => {
    if (!isOpen) return
    setError('')
    if (isEdit) {
      setLogDate(initialLog.date || todayStr)
      setTimeIn(parseTimeStr(initialLog.timeIn,  { h: 8, m: 0, p: 'AM' }))
      setTimeOut(parseTimeStr(initialLog.timeOut, { h: 5, m: 0, p: 'PM' }))
      setBreakHr(Number(initialLog.breakHr ?? 1))
      setNotes(initialLog.notes || '')
    } else {
      setLogDate(initialDate || todayStr)
      setTimeIn({ h: 8, m: 0, p: 'AM' })
      setTimeOut({ h: 5, m: 0, p: 'PM' })
      setBreakHr(1)
      setNotes('')
    }
  }, [isOpen, isEdit, initialLog, todayStr, initialDate])

  const handleSave = async () => {
    if (rawHours <= 0) { setError('Time Out must be later than Time In.'); return }
    const user = getCurrentUser()
    if (!user) { setError('You must be signed in to save logs.'); return }
    setSaving(true); setError('')
    try {
      const logData = { logDate, timeIn, timeOut, breakHr, computedHours, notes }
      if (isEdit) {
        if (logDate === initialLog.date) {
          await updateLog(user.uid, logDate, initialLog.id, logData)
          onSave?.({ ...logData, id: initialLog.id }, 'edit')
        } else {
          const newKey = await addLog(user.uid, logData)
          await deleteLog(user.uid, initialLog.date, initialLog.id)
          onSave?.({ ...logData, id: newKey }, 'edit')
        }
      } else {
        const newKey = await addLog(user.uid, logData)
        onSave?.({ ...logData, id: newKey }, 'add')
      }
      onClose()
    } catch (err) {
      setError('Save failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-visible"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-modal)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <h2 className="text-[1rem] font-semibold" style={{ color: 'var(--text)' }}>
              {isEdit ? 'Edit Log' : 'Add New Log'}
            </h2>
            <p className="text-[0.75rem] mt-0.5" style={{ color: 'var(--muted)' }}>
              {isEdit ? 'Update your OJT hours and activities.' : 'Record your OJT hours and daily activities.'}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ color: 'var(--muted)' }}>✕</button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-[0.72rem] uppercase tracking-widest mb-1.5" style={{ color: 'var(--muted)' }}>Date</label>
            <DatePicker value={logDate} onChange={setLogDate} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.72rem] uppercase tracking-widest mb-1.5" style={{ color: 'var(--muted)' }}>Time In</label>
              <TimePicker value={timeIn} onChange={setTimeIn} />
            </div>
            <div>
              <label className="block text-[0.72rem] uppercase tracking-widest mb-1.5" style={{ color: 'var(--muted)' }}>Time Out</label>
              <TimePicker value={timeOut} onChange={setTimeOut} />
            </div>
          </div>

          <div className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--accent-bg)', border: '1px solid rgba(200,184,154,0.25)' }}>
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" style={{ color: 'var(--accent)' }}>
              <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 8v4l3 3" />
            </svg>
            <p className="text-[0.77rem] leading-relaxed" style={{ color: isDark ? '#c8b89a' : '#8a6a40' }}>
              You worked for <strong>{formatHours(rawHours)} hrs</strong>. Only <strong>{formatHours(computedHours)} hrs</strong> counted due to <strong>{breakHr} hr</strong> break.
            </p>
          </div>

          <div>
            <label className="block text-[0.72rem] uppercase tracking-widest mb-1.5" style={{ color: 'var(--muted)' }}>Break</label>
            <select value={breakHr} onChange={e => setBreakHr(+e.target.value)} className="theme-input w-full rounded-xl px-4 py-2.5 text-[0.85rem]">
              {[0, 0.5, 1, 1.5, 2].map(v => (
                <option key={v} value={v}>{v === 0 ? 'No break' : `${v} hr`}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[0.72rem] uppercase tracking-widest mb-1.5" style={{ color: 'var(--muted)' }}>Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(limitWords(e.target.value, 30))}
              placeholder="Describe the work you did today…"
              className="theme-input w-full rounded-xl px-4 py-3 text-[0.85rem] resize-none"
            />
          </div>

          {error && (
            <p className="text-[0.78rem] px-4 py-2 rounded-xl" style={{ color: '#e07070', backgroundColor: 'rgba(224,112,112,0.1)', border: '1px solid rgba(224,112,112,0.25)' }}>
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4" style={{ borderTop: '1px solid var(--border)' }}>
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
            {saving ? 'Saving…' : (isEdit ? 'Save Changes' : 'Save Log')}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-[0.875rem]"
            style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddLogModal
