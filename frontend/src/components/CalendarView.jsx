import React, { useMemo, useState } from 'react'

/**
 * CalendarView
 * @prop {Array} logs â€“ [{ date: 'YYYY-MM-DD', ... }]
 */
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const parseDateKey = (value) => {
  if (typeof value !== 'string') return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const d = new Date(`${value}T00:00:00`)
  return Number.isNaN(d.getTime()) ? null : d
}

const CalendarView = ({ logs = [] }) => {
  const today       = new Date()
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const monthName   = MONTHS[calMonth]
  const firstDay    = new Date(calYear, calMonth, 1).getDay()
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const currentYear = today.getFullYear()
  const yearOptions = []
  for (let y = currentYear - 5; y <= currentYear + 5; y += 1) yearOptions.push(y)

  const loggedDays = useMemo(() => {
    const set = new Set()
    logs.forEach(log => {
      const d = parseDateKey(log.date)
      if (!d) return
      if (d.getFullYear() === calYear && d.getMonth() === calMonth) set.add(d.getDate())
    })
    return set
  }, [logs, calMonth, calYear])

  const baseStyle = {
    aspectRatio: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.5rem',
    fontSize: '0.72rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s',
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="px-5 sm:px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[0.75rem] font-semibold uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
            {monthName} {calYear}
          </h2>
          <div className="flex items-center gap-2">
            <select
              value={calMonth}
              onChange={e => setCalMonth(Number(e.target.value))}
              className="theme-input rounded-lg px-2 py-1 text-[0.7rem]"
              aria-label="Select month"
            >
              {MONTHS.map((m, idx) => (
                <option key={m} value={idx}>{m}</option>
              ))}
            </select>
            <select
              value={calYear}
              onChange={e => setCalYear(Number(e.target.value))}
              className="theme-input rounded-lg px-2 py-1 text-[0.7rem]"
              aria-label="Select year"
            >
              {yearOptions.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5">

        <div className="grid grid-cols-7 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} className="text-center text-[0.65rem] uppercase tracking-wider py-1" style={{ color: 'var(--muted)' }}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day      = i + 1
            const isToday  = day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear()
            const isLogged = loggedDays.has(day)

            if (isToday) return (
              <div key={day} style={{ ...baseStyle, background: 'linear-gradient(135deg, #c8b89a, #a89070)', color: '#0d0d0f' }}>{day}</div>
            )
            if (isLogged) return (
              <div key={day} style={{ ...baseStyle, color: 'var(--accent)', backgroundColor: 'var(--accent-bg)', border: '1px solid rgba(200,184,154,0.25)' }}>{day}</div>
            )
            return (
              <div key={day} style={{ ...baseStyle, color: 'var(--muted)' }} onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.backgroundColor = 'rgba(128,128,128,0.07)' }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.backgroundColor = 'transparent' }}>{day}</div>
            )
          })}
        </div>

        <div className="flex items-center gap-4 mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: 'linear-gradient(135deg, #c8b89a, #a89070)' }} />
            <span className="text-[0.65rem]" style={{ color: 'var(--muted)' }}>Today</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: 'var(--accent-bg)', border: '1px solid rgba(200,184,154,0.30)' }} />
            <span className="text-[0.65rem]" style={{ color: 'var(--muted)' }}>Logged</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarView
