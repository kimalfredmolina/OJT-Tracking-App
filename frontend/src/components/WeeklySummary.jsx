import React, { useMemo, useState } from 'react'
import { formatHours } from '../utils/format'

/**
 * WeeklySummary
 * @prop {Array} weeks – [{ label, total, tasks[] }]
 */
const WeeklySummary = ({ weeks = [] }) => {
  const [order, setOrder] = useState('latest')

  const displayWeeks = useMemo(() => {
    if (order === 'earliest') return weeks
    return [...weeks].reverse()
  }, [weeks, order])

  return (
    <div className="rounded-2xl overflow-hidden h-fit" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
        <h2 className="text-[0.75rem] font-semibold uppercase tracking-widest" style={{ color: 'var(--muted)' }}>Weekly Summary</h2>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setOrder('earliest')}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
            title="Show earliest first"
            style={{
              color: order === 'earliest' ? 'var(--accent)' : 'var(--muted)',
              border: '1px solid var(--border)',
              backgroundColor: order === 'earliest' ? 'var(--accent-bg)' : 'transparent',
            }}
          >
            <span className="text-sm">↑</span>
          </button>
          <button
            type="button"
            onClick={() => setOrder('latest')}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
            title="Show current first"
            style={{
              color: order === 'latest' ? 'var(--accent)' : 'var(--muted)',
              border: '1px solid var(--border)',
              backgroundColor: order === 'latest' ? 'var(--accent-bg)' : 'transparent',
            }}
          >
            <span className="text-sm">↓</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3 weekly-scroll" style={{ maxHeight: '520px', overflowY: 'auto' }}>
        {displayWeeks.map((wk, i) => (
          <div
            key={`${wk.label}-${i}`}
            className="rounded-xl p-4 transition-all duration-200"
            style={{ backgroundColor: 'var(--surface-alt)', border: '1px solid var(--border)' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(200,184,154,0.30)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[0.78rem] font-medium" style={{ color: 'var(--text)' }}>{wk.label}</span>
              <span className="text-[0.72rem] font-semibold" style={{ color: 'var(--accent)' }}>{formatHours(wk.total)} hrs</span>
            </div>

            <div className="w-full h-1 rounded-full mb-3" style={{ backgroundColor: 'rgba(128,128,128,0.1)' }}>
              <div
  className="h-full rounded-full"
  style={{
    width: `${Math.min((wk.total / 40) * 100, 100)}%`,
    background: 'linear-gradient(90deg, #c8b89a, #a89070)',
  }}
/>
            </div>

            <ul className="space-y-1">
              {wk.tasks.map((t, idx) => (
                <li key={`${wk.label}-${idx}`} className="flex items-center gap-2 text-[0.72rem]" style={{ color: 'var(--muted)' }}>
                  <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: 'var(--accent)', opacity: 0.7 }} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeeklySummary
