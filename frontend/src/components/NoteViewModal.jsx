import React from 'react'

const NoteViewModal = ({ isOpen, onClose, log }) => {
  if (!isOpen || !log) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-visible"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-modal)',
        }}
      >
        <div className="flex items-start justify-between px-6 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <h2 className="text-[1rem] font-semibold" style={{ color: 'var(--text)' }}>
              Note
            </h2>
            <p className="text-[0.75rem] mt-0.5" style={{ color: 'var(--muted)' }}>
              {log.displayDate ?? log.date ?? ''}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ color: 'var(--muted)' }}>
            ✕
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-[0.9rem] leading-relaxed" style={{ color: 'var(--text)', whiteSpace: 'pre-wrap' }}>
            {log.notes || 'No notes provided.'}
          </p>
        </div>

        <div className="px-6 py-4" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-[0.875rem]"
            style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default NoteViewModal
