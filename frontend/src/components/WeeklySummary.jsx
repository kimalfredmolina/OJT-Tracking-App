import React from 'react'

/**
 * WeeklySummary
 * @prop {Array} weeks – [{ label, total, tasks[] }]
 */
const WeeklySummary = ({ weeks = [] }) => (
  <div className="rounded-2xl overflow-hidden h-fit" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
    <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
      <h2 className="text-[0.75rem] font-semibold uppercase tracking-widest" style={{ color: 'var(--muted)' }}>Weekly Summary</h2>
    </div>

    <div className="p-4 space-y-3 weekly-scroll" style={{ maxHeight: '520px', overflowY: 'auto' }}>
      {weeks.map((wk, i) => (
        <div key={i} className="rounded-xl p-4 transition-all duration-200" style={{ backgroundColor: 'var(--surface-alt)', border: '1px solid var(--border)' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(200,184,154,0.30)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[0.78rem] font-medium" style={{ color: 'var(--text)' }}>{wk.label}</span>
            <span className="text-[0.72rem] font-semibold" style={{ color: 'var(--accent)' }}>{wk.total} hrs</span>
          </div>

          <div className="w-full h-1 rounded-full mb-3" style={{ backgroundColor: 'rgba(128,128,128,0.1)' }}>
            <div className="h-full rounded-full" style={{ width: `${(wk.total / 48) * 100}%`, background: 'linear-gradient(90deg, #c8b89a, #a89070)' }} />
          </div>

          <ul className="space-y-1">{wk.tasks.map(t => (<li key={t} className="flex items-center gap-2 text-[0.72rem]" style={{ color: 'var(--muted)' }}>
            <span className="w-1 h-1 rounded-full shrink-0"style={{ backgroundColor: 'var(--accent)', opacity: 0.7 }} />{t}</li>))}
          </ul>
        </div>
      ))}
    </div>
  </div>
)

export default WeeklySummary
