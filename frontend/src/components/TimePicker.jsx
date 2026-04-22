import React, { useEffect, useRef, useState } from 'react'

const PAD = (n) => String(n).padStart(2, '0')
const HOURS   = Array.from({ length: 12 }, (_, i) => i + 1)
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5)

function Column({ items, selected, onSelect, format }) {
  const listRef = useRef(null)

  useEffect(() => {
    const idx = items.indexOf(selected)
    if (idx >= 0 && listRef.current) {
      const item = listRef.current.children[idx]
      if (item) item.scrollIntoView({ block: 'nearest' })
    }
  }, [selected, items])

  return (
    <ul ref={listRef} className="flex flex-col overflow-y-auto" style={{ maxHeight: '160px', scrollbarWidth: 'none' }}>
      {items.map(item => {
        const active = item === selected
        return (
          <li key={item}>
            <button
              type="button"
              onClick={() => onSelect(item)}
              className="w-full px-4 py-1.5 text-[0.82rem] text-center transition-colors"
              style={{
                color: active ? 'var(--accent)' : 'var(--text)',
                backgroundColor: active ? 'var(--accent-bg)' : 'transparent',
                fontWeight: active ? 600 : 400,
              }}
            >
              {format(item)}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export function TimePicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const set = (key, val) => onChange({ ...value, [key]: val })

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 rounded-xl px-3 py-2.5 w-full"
        style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
      >
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" style={{ color: 'var(--muted)' }}>
          <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 8v4l3 3" />
        </svg>
        <span className="text-[0.85rem] font-medium">
          {PAD(value.h)}:{PAD(value.m)} {value.p}
        </span>
      </button>

      {open && (
        <div
          className="absolute z-[60] mt-1 rounded-xl overflow-hidden"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-modal)',
            minWidth: '160px',
          }}
        >
          <div className="flex">
            <Column items={HOURS}        selected={value.h} onSelect={v => set('h', v)} format={v => PAD(v)} />
            <div className="w-px self-stretch" style={{ backgroundColor: 'var(--border)' }} />
            <Column items={MINUTES}      selected={value.m} onSelect={v => set('m', v)} format={v => PAD(v)} />
            <div className="w-px self-stretch" style={{ backgroundColor: 'var(--border)' }} />
            <Column items={['AM', 'PM']} selected={value.p} onSelect={v => set('p', v)} format={v => v} />
          </div>
        </div>
      )}
    </div>
  )
}
