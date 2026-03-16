import React from 'react'

/**
 * StatCard
 * @prop {string}  id        – element id
 * @prop {string}  label     – upper label (e.g. "Required")
 * @prop {string}  value     – large display value (e.g. "500 hrs")
 * @prop {string}  sub       – secondary line (e.g. "Total internship hours")
 * @prop {ReactNode} icon    – SVG path(s) rendered inside a 24×24 viewBox
 * @prop {boolean} highlight – accent colour treatment
 */
const StatCard = ({ id, label, value, sub, icon, highlight = false, onIconClick, iconTitle, iconAccent = false }) => (
  <div id={id} className="rounded-2xl px-4 sm:px-5 py-4 sm:py-5 flex flex-col gap-2.5 cursor-default" style={{ backgroundColor: 'var(--surface)', border: highlight ? '1px solid rgba(200,184,154,0.40)' : '1px solid var(--border)', transition: 'box-shadow 0.2s, transform 0.2s',}}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-card)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
  >
    <div className="flex items-center justify-between">
      <span className="text-[0.65rem] sm:text-[0.7rem] uppercase tracking-widest" style={{ color: 'var(--muted)' }}>{label}</span>
      {onIconClick ? (
        <button
          type="button"
          onClick={onIconClick}
          title={iconTitle}
          aria-label={iconTitle}
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            color: (highlight || iconAccent) ? 'var(--accent)' : 'var(--muted)',
            backgroundColor: (highlight || iconAccent) ? 'var(--accent-bg)' : 'rgba(128,128,128,0.08)',
            border: iconAccent ? '1px solid rgba(200,184,154,0.45)' : '1px solid transparent',
            boxShadow: iconAccent ? '0 0 0 1px rgba(200,184,154,0.15)' : 'none',
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">{icon}</svg>
        </button>
      ) : (
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ color: highlight ? 'var(--accent)' : 'var(--muted)', backgroundColor: highlight ? 'var(--accent-bg)' : 'rgba(128,128,128,0.08)', }} >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">{icon}</svg>
        </div>
      )}
    </div>

    <div className="text-[1.3rem] sm:text-[1.6rem] font-semibold tracking-tight leading-none" style={{ color: highlight ? 'var(--accent)' : 'var(--text)' }} >{value}</div>

    <p className="text-[0.7rem]" style={{ color: 'var(--muted)' }}>{sub}</p>
  </div>
)

export default StatCard
