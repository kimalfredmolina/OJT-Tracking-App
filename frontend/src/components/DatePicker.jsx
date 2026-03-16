import React, { useEffect, useMemo, useRef, useState } from 'react'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const pad2 = (n) => String(n).padStart(2, '0')

const toYMD = (date) => {
  if (!date) return ''
  const y = date.getFullYear()
  const m = pad2(date.getMonth() + 1)
  const d = pad2(date.getDate())
  return `${y}-${m}-${d}`
}

const toMDY = (date) => {
  if (!date) return ''
  const m = pad2(date.getMonth() + 1)
  const d = pad2(date.getDate())
  const y = date.getFullYear()
  return `${m}/${d}/${y}`
}

const parseYMD = (value) => {
  if (typeof value !== 'string') return null
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2]) - 1
  const day = Number(match[3])
  const date = new Date(year, month, day)
  if (Number.isNaN(date.getTime())) return null
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null
  return date
}

const DatePicker = ({ value, onChange, placeholder = 'mm/dd/yyyy' }) => {
  const [open, setOpen] = useState(false)
  const selectedDate = useMemo(() => parseYMD(value), [value])
  const initialDate = selectedDate || new Date()
  const [viewYear, setViewYear] = useState(initialDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth())
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (open) {
      const d = selectedDate || new Date()
      setViewYear(d.getFullYear())
      setViewMonth(d.getMonth())
    }
  }, [open, selectedDate])

  useEffect(() => {
    if (!open) return
    const handleClick = (e) => {
      if (!wrapperRef.current) return
      if (!wrapperRef.current.contains(e.target)) setOpen(false)
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const handleSelect = (day) => {
    const date = new Date(viewYear, viewMonth, day)
    onChange?.(toYMD(date))
    setOpen(false)
  }

  const moveMonth = (delta) => {
    const next = new Date(viewYear, viewMonth + delta, 1)
    setViewYear(next.getFullYear())
    setViewMonth(next.getMonth())
  }

  return (
    <div className="date-picker" ref={wrapperRef}>
      <input
        type="text"
        value={selectedDate ? toMDY(selectedDate) : ''}
        placeholder={placeholder}
        readOnly
        onClick={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        className="theme-input theme-date w-full"
      />

      {open && (
        <div className="date-popover">
          <div className="date-popover-header">
            <span className="date-popover-title">{MONTHS[viewMonth]} {viewYear}</span>
            <div className="date-popover-actions">
              <button type="button" className="date-nav" onClick={() => moveMonth(-1)} aria-label="Previous month">‹</button>
              <button type="button" className="date-nav" onClick={() => moveMonth(1)} aria-label="Next month">›</button>
            </div>
          </div>

          <div className="date-popover-grid">
            {WEEKDAYS.map(d => (
              <div key={d} className="date-weekday">{d}</div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`e-${i}`} className="date-empty" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const isSelected = selectedDate
                && selectedDate.getFullYear() === viewYear
                && selectedDate.getMonth() === viewMonth
                && selectedDate.getDate() === day
              return (
                <button
                  type="button"
                  key={day}
                  className={`date-day${isSelected ? ' is-selected' : ''}`}
                  onClick={() => handleSelect(day)}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default DatePicker
