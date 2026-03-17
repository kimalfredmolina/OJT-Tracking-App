import React, { useMemo } from 'react'

const AccountPage = ({ user, logs = [], settings, onBack, onDelete }) => {
  const totalHours = useMemo(
    () => logs.reduce((sum, log) => sum + (log.hours || 0), 0),
    [logs]
  )

  const firstLog = logs[logs.length - 1]?.date
  const lastLog = logs[0]?.date

  const initial = user?.displayName?.[0]
    ?? user?.email?.[0]?.toUpperCase()
    ?? 'U'

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[0.8rem] font-medium transition-all"
          style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
        <div className="rounded-2xl p-6 theme-card space-y-5">
          <div className="flex items-center gap-4">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user?.displayName ?? user?.email ?? 'User avatar'}
                className="w-16 h-16 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold"
                style={{ background: 'linear-gradient(135deg, #c8b89a, #8a7a6a)', color: '#0d0d0f' }}
              >
                {initial}
              </div>
            )}
            <div>
              <h2 className="text-xl theme-text">{user?.displayName ?? 'User'}</h2>
              <p className="theme-muted text-sm">{user?.email ?? ''}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="theme-muted text-[0.7rem] uppercase tracking-widest">Provider</p>
              <p className="theme-text">{user?.providerData?.[0]?.providerId ?? '—'}</p>
            </div>
            <div>
              <p className="theme-muted text-[0.7rem] uppercase tracking-widest">Created</p>
              <p className="theme-text">{user?.metadata?.creationTime ?? '—'}</p>
            </div>
            <div>
              <p className="theme-muted text-[0.7rem] uppercase tracking-widest">Last Sign-in</p>
              <p className="theme-text">{user?.metadata?.lastSignInTime ?? '—'}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6 theme-card space-y-4">
          <h3 className="theme-text text-lg">Data Summary</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="theme-muted text-[0.7rem] uppercase tracking-widest">Total Logs</p>
              <p className="theme-text text-lg">{logs.length}</p>
            </div>
            <div>
              <p className="theme-muted text-[0.7rem] uppercase tracking-widest">Total Hours</p>
              <p className="theme-text text-lg">{Math.round(totalHours * 10) / 10}</p>
            </div>
            <div>
              <p className="theme-muted text-[0.7rem] uppercase tracking-widest">Required</p>
              <p className="theme-text text-lg">{settings?.requiredHours ?? 500} hrs</p>
            </div>
            <div>
              <p className="theme-muted text-[0.7rem] uppercase tracking-widest">Latest Log</p>
              <p className="theme-text">{lastLog ?? '—'}</p>
            </div>
            <div>
              <p className="theme-muted text-[0.7rem] uppercase tracking-widest">First Log</p>
              <p className="theme-text">{firstLog ?? '—'}</p>
            </div>
          </div>

          <div className="pt-2 border-t theme-divider">
            <p className="theme-muted text-[0.7rem] uppercase tracking-widest mb-2">Danger Zone</p>
            <button
              type="button"
              onClick={onDelete}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.45)' }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--danger-bg)'
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.8)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.45)'
              }}
            >
              Delete account and all data
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden theme-card">
        <div className="px-6 py-4 border-b theme-divider">
          <h3 className="theme-text text-[0.85rem] uppercase tracking-widest">All Logs</h3>
        </div>
        <div className="max-h-[360px] overflow-y-auto activity-scroll">
          <table className="w-full text-[0.8rem] min-w-[320px]">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Date', 'Hours', 'Notes'].map(h => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-[0.68rem] uppercase tracking-widest font-medium"
                    style={{ color: 'var(--muted)', position: 'sticky', top: 0, backgroundColor: 'var(--surface)', zIndex: 1 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr
                  key={`${log.date}-${log.id ?? i}`}
                  className="transition-colors"
                  style={{ borderBottom: i !== logs.length - 1 ? '1px solid var(--border)' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(128,128,128,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td className="px-6 py-3.5 font-medium" style={{ color: 'var(--accent)' }}>{log.displayDate ?? log.date}</td>
                  <td className="px-6 py-3.5" style={{ color: 'var(--text)' }}>{log.hours} hrs</td>
                  <td className="px-6 py-3.5" style={{ color: 'var(--muted)' }}>{log.notes}</td>
                </tr>
              ))}
              {!logs.length && (
                <tr>
                  <td className="px-6 py-6 text-sm theme-muted" colSpan={3}>
                    No logs yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default AccountPage
