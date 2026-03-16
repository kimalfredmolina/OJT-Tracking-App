import React from 'react'

const ToastStack = ({ toasts = [], onDismiss }) => (
  <div className="toast-container">
    {toasts.map(t => (
      <div key={t.id} className={`toast ${t.tone || 'success'}`}>
        <span className="toast-text">{t.message}</span>
        <button type="button" className="toast-close" onClick={() => onDismiss?.(t.id)} aria-label="Dismiss">
          x
        </button>
      </div>
    ))}
  </div>
)

export default ToastStack
