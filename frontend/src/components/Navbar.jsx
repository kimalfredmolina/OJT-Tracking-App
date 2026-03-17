import React, { useState, useRef, useEffect } from 'react'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'

const Navbar = ({ isDark, toggleTheme, onAddLog, onOpenAccount }) => {
  const user = auth.currentUser
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => signOut(auth)

  const initial = user?.displayName?.[0]
    ?? user?.email?.[0]?.toUpperCase()
    ?? 'U'

  const firstName = user?.displayName?.split(' ')[0]
    ?? user?.email?.split('@')[0]
    ?? 'User'

  return (
    <header
      className="fixed top-0 left-0 w-full z-30 backdrop-blur-md"
      style={{
        backgroundColor: 'var(--bg-80)',
        borderBottom: '1px solid var(--border)',
        transition: 'background-color 0.3s',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">

        {/* Logo here */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #c8b89a, #8a7a6a)' }}>
            <svg className="w-3.5 h-3.5 fill-current" style={{ color: '#0d0d0f' }} viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="hidden sm:block min-w-0">
            <p className="theme-text text-[0.8125rem] font-semibold leading-none tracking-tight truncate">
              OJT Hours Tracking
            </p>
            <p className="theme-muted text-[0.65rem] leading-none mt-0.5">
              Track your internship progress daily
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">

          {/* mobile view */}
          <button
            id="add-log-fab"
            onClick={onAddLog}
            className="sm:hidden w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shrink-0"
            style={{ background: 'linear-gradient(135deg, #c8b89a, #a89070)', color: '#0d0d0f', boxShadow: '0 2px 12px rgba(200,184,154,0.35)' }}
            title="Add New Log"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {/* desktop view */}
          <button id="add-log-btn" onClick={onAddLog} className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 text-[0.8rem] font-medium rounded-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0" style={{ background: 'linear-gradient(135deg, #c8b89a, #a89070)', color: '#0d0d0f', boxShadow: '0 2px 8px rgba(200,184,154,0.25)' }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /> </svg>
            Add New Log
          </button>

          {/* Profile dropdown */}
          <div className="relative" ref={dropRef}>
            <button
              id="profile-btn"
              onClick={() => setDropOpen(p => !p)}
              className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-lg transition-all duration-200"
              style={{ border: '1px solid var(--border)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user?.displayName ?? user?.email ?? 'User avatar'}
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[0.7rem] font-bold shrink-0"
                  style={{ background: 'linear-gradient(135deg, #c8b89a, #8a7a6a)', color: '#0d0d0f' }}
                >
                  {initial}
                </div>
              )}
              <span className="theme-text text-[0.8rem] hidden sm:block">{firstName}</span>
              <svg className="w-3 h-3 transition-transform duration-200" style={{ color: 'var(--muted)', transform: dropOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>

            {dropOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl overflow-hidden z-50" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-modal)', }}>
                <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                  <p className="theme-text text-[0.75rem] font-medium truncate">{user?.displayName ?? 'User'}</p>
                  <p className="theme-muted text-[0.68rem] truncate">{user?.email ?? ''}</p>
                </div>
                <button
                  id="menu-theme-toggle"
                  onClick={() => {
                    toggleTheme()
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-[0.8rem] transition-colors hover:opacity-90"
                  style={{ color: 'var(--muted)' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 flex items-center justify-center">
                      {isDark ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="5" />
                          <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                        </svg>
                      )}
                    </span>
                    <span>{isDark ? 'Dark mode' : 'Light mode'}</span>
                  </div>
                  <div
                    className="w-9 h-5 rounded-full flex items-center px-0.5 transition-colors duration-200"
                    style={{ backgroundColor: isDark ? 'var(--accent)' : 'var(--border)' }}
                  >
                    <div
                      className="w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200"
                      style={{ transform: isDark ? 'translateX(1rem)' : 'translateX(0)' }}
                    />
                  </div>
                </button>
                <button
                  id="menu-account"
                  onClick={() => {
                    onOpenAccount?.()
                    setDropOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[0.8rem] text-left transition-colors hover:opacity-80"
                  style={{ color: 'var(--muted)', borderTop: '1px solid var(--border)' }}
                >
                  <span className="w-4 h-4 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M16.5 7.063C16.5 10.258 14.57 13 12 13c-2.572 0-4.5-2.742-4.5-5.938C7.5 3.868 9.16 2 12 2s4.5 1.867 4.5 5.063zM4.102 20.142C4.487 20.6 6.145 22 12 22c5.855 0 7.512-1.4 7.898-1.857a.416.416 0 0 0 .09-.317C19.9 18.944 19.106 15 12 15s-7.9 3.944-7.989 4.826a.416.416 0 0 0 .091.317z"/></svg>
                  </span>
                  <span>Account</span>
                </button>
                <div style={{ borderTop: '1px solid var(--border)' }}>
                  <button id="menu-logout" onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-[0.8rem] text-left transition-colors" style={{ color: 'var(--danger)' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--danger-bg)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <span className="w-4 h-4 flex items-center justify-center">
                      <svg fill="currentColor" viewBox="0 0 52 52" width="24" height="24"><g><path d="M21,48.5v-3c0-0.8-0.7-1.5-1.5-1.5h-10C8.7,44,8,43.3,8,42.5v-33C8,8.7,8.7,8,9.5,8h10C20.3,8,21,7.3,21,6.5v-3C21,2.7,20.3,2,19.5,2H6C3.8,2,2,3.8,2,6v40c0,2.2,1.8,4,4,4h13.5C20.3,50,21,49.3,21,48.5z" /><path d="M49.6,27c0.6-0.6,0.6-1.5,0-2.1L36.1,11.4c-0.6-0.6-1.5-0.6-2.1,0l-2.1,2.1c-0.6,0.6-0.6,1.5,0,2.1l5.6,5.6c0.6,0.6,0.2,1.7-0.7,1.7H15.5c-0.8,0-1.5,0.6-1.5,1.4v3c0,0.8,0.7,1.6,1.5,1.6h21.2c0.9,0,1.3,1.1,0.7,1.7l-5.6,5.6c-0.6,0.6-0.6,1.5,0,2.1l2.1,2.1c0.6,0.6,1.5,0.6,2.1,0L49.6,27z" /></g></svg>
                    </span>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
