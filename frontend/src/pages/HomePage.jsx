import React, { useState, useEffect, useMemo } from 'react'
import * as XLSX from 'xlsx'
import Navbar        from '../components/Navbar'
import StatCard      from '../components/StatCard'
import ProgressBar   from '../components/ProgressBar'
import ActivityTable from '../components/ActivityTable'
import CalendarView  from '../components/CalendarView'
import WeeklySummary from '../components/WeeklySummary'
import AddLogModal   from '../components/AddLogModal'
import BulkAddModal  from '../components/BulkAddModal'
import SetupOjtModal from '../components/SetupOjtModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import ToastStack from '../components/ToastStack'
import NoteViewModal from '../components/NoteViewModal'
import AccountPage from './AccountPage'
import {
  onAuthChange,
  deleteLog,
  deleteAccountAndData,
  saveSettings,
  subscribeLogs,
  subscribeSettings,
} from '../firebase'

const isValidDateKey = (value) => {
  if (typeof value !== 'string') return false
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const d = new Date(`${value}T00:00:00`)
  return !Number.isNaN(d.getTime())
}

const buildWeeklySummaries = (logs) => {
  const byWeek = {}
  logs.forEach(log => {
    if (!isValidDateKey(log.date)) return
    const d   = new Date(`${log.date}T00:00:00`)
    // ISO week key: year-week
    const day = d.getDay() || 7
    const monday = new Date(d)
    monday.setDate(d.getDate() - day + 1)
    const key = monday.toISOString().slice(0, 10)

    if (!byWeek[key]) byWeek[key] = { key, total: 0, tasks: [] }
    byWeek[key].total += log.hours || 0
    if (log.notes) byWeek[key].tasks.push(log.notes)
  })

  return Object.values(byWeek)
    .sort((a, b) => (a.key > b.key ? 1 : -1))
    .map((w, i) => ({
      label: `Week ${i + 1}`,
      total: Math.round(w.total * 10) / 10,
      tasks: w.tasks.slice(0, 5),
    }))
}

/** Format a DB date string 'YYYY-MM-DD' to 'Mon DD' display form. */
const fmtDate = (dateStr) => {
  if (!isValidDateKey(dateStr)) return '—'
  const [, , day] = dateStr.split('-')
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.toLocaleString('en', { month: 'short' })} ${parseInt(day)}`
}

const makeStatCards = (required, completed, daysLeft, expectedEndDate) => {
  const remaining = required - completed
  const pct       = required > 0 ? Math.round((completed / required) * 100) : 0

  return [
    {
      id: 'stat-required', label: 'Required', value: `${required} hrs`,
      sub: 'Total internship hours',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.1 2.1 0 013.97 1.09l-9.82 9.82-3.44.62.62-3.44 9.82-9.82z" />
      ),
    },
    {
      id: 'stat-completed', label: 'Completed', value: `${completed} hrs`,
      sub: `${pct}% done`, highlight: true,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />,
    },
    {
      id: 'stat-remaining', label: 'Remaining', value: `${remaining} hrs`, sub: 'Hours to go',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    },
    {
      id: 'stat-deadline', label: 'Expected End',
      value: expectedEndDate
        ? new Date(expectedEndDate).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
        : '—',
      sub: daysLeft != null ? `In ${daysLeft} days` : '',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    },
  ]
}

const HomePage = ({ isDark, toggleTheme }) => {
  const [user,        setUser]        = useState(null)
  const [logs,        setLogs]        = useState([])
  const [settings,    setSettings]    = useState(null)
  const [modalOpen,   setModalOpen]   = useState(false)
  const [bulkOpen,    setBulkOpen]    = useState(false)
  const [needsSetup,  setNeedsSetup]  = useState(false)
  const [editingLog,  setEditingLog]  = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toasts, setToasts] = useState([])
  const [isEditingRequired, setIsEditingRequired] = useState(false)
  const [requiredDraft, setRequiredDraft] = useState('')
  const [requiredError, setRequiredError] = useState('')
  const [savingRequired, setSavingRequired] = useState(false)
  const [activeView, setActiveView] = useState('dashboard')
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false)
  const [noteViewLog, setNoteViewLog] = useState(null)

  useEffect(() => {
    const unsub = onAuthChange(u => {
      setUser(u)
      if (!u) {
        setLogs([])
        setSettings(null)
      }
    })
    return unsub
  }, [])

  useEffect(() => {
    if (!user) return
    const unsubLogs     = subscribeLogs(user.uid, setLogs)
    const unsubSettings = subscribeSettings(user.uid, (s) => {
      setSettings(s)
      setNeedsSetup(!s)          // show setup if no settings yet
    })
    return () => { unsubLogs(); unsubSettings() }
  }, [user])

  const required  = settings?.requiredHours ?? 500
  const completed = useMemo(() => logs.reduce((s, l) => s + (l.hours || 0), 0), [logs])
  const avgDaily  = logs.length ? Math.round(completed / logs.length) : 0

  const getEarliestLogDate = (items) => {
    let min = null
    items.forEach(l => {
      if (!isValidDateKey(l.date)) return
      if (!min || l.date < min) min = l.date
    })
    return min
  }

  const inferDailyHours = () => {
    if (!logs.length) return 8
    const avg = completed / logs.length
    if (!Number.isFinite(avg) || avg <= 0) return 8
    return avg <= 4.5 ? 4 : 8
  }

  const addWorkdays = (startDateStr, workdaysToAdd) => {
    let d = new Date(`${startDateStr}T00:00:00`)
    while (d.getDay() === 0 || d.getDay() === 6) {
      d.setDate(d.getDate() + 1)
    }
    let remaining = workdaysToAdd
    while (remaining > 0) {
      d.setDate(d.getDate() + 1)
      const day = d.getDay()
      if (day !== 0 && day !== 6) remaining -= 1
    }
    return d
  }

  const expectedEndDate = useMemo(() => {
    const start = getEarliestLogDate(logs)
    if (!start) return null
    const dailyHours = inferDailyHours()
    const neededDays = Math.ceil(required / dailyHours)
    if (!Number.isFinite(neededDays) || neededDays <= 0) return null
    return addWorkdays(start, Math.max(0, neededDays - 1))
  }, [logs, required, completed])

  const daysLeft  = expectedEndDate
    ? Math.ceil((new Date(expectedEndDate) - new Date()) / (1000 * 60 * 60 * 24))
    : null

  const statCards    = useMemo(() => makeStatCards(required, completed, daysLeft, expectedEndDate), [required, completed, daysLeft, expectedEndDate])
  const displayLogs  = useMemo(() =>
    logs.map(l => ({ ...l, displayDate: fmtDate(l.date) })), [logs])
  const weeklySummaries = useMemo(() => buildWeeklySummaries(logs), [logs])

  const exportReport = () => {
    const rows = displayLogs.map(l => ({
      Date: l.displayDate ?? l.date ?? '',
      Hours: l.hours ?? 0,
      Notes: l.notes ?? '',
    }))
    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Activity')

    const data = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ojt-activity-${new Date().toISOString().slice(0, 10)}.xlsx`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const openRequiredEdit = () => {
    setRequiredDraft(String(required))
    setRequiredError('')
    setIsEditingRequired(true)
  }

  const cancelRequiredEdit = () => {
    setRequiredError('')
    setIsEditingRequired(false)
  }

  const saveRequiredEdit = async () => {
    if (!user) return
    const nextVal = Number(requiredDraft)
    if (!Number.isFinite(nextVal) || nextVal < 1) {
      setRequiredError('Please enter a valid number of hours.')
      return
    }
    setSavingRequired(true)
    setRequiredError('')
    try {
      await saveSettings(user.uid, { ...(settings || {}), requiredHours: nextVal })
      pushToast('Required hours updated.')
      setIsEditingRequired(false)
    } catch (err) {
      setRequiredError('Save failed: ' + err.message)
    } finally {
      setSavingRequired(false)
    }
  }

  const openAddLog = () => {
    setEditingLog(null)
    setModalOpen(true)
  }

  const openEditLog = (log) => {
    setEditingLog(log)
    setModalOpen(true)
  }

  const closeLogModal = () => {
    setModalOpen(false)
    setEditingLog(null)
  }

  const handleDeleteLog = async (log) => {
    if (!user) return
    setDeleteTarget(log)
  }

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const pushToast = (message, tone = 'success') => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts(prev => [...prev, { id, message, tone }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 2600)
  }

  const confirmDelete = async () => {
    if (!user || !deleteTarget) return
    try {
      await deleteLog(user.uid, deleteTarget.date, deleteTarget.id)
      pushToast('Deleted successfully.', 'danger')
    } catch (err) {
      alert('Delete failed: ' + err.message)
    } finally {
      setDeleteTarget(null)
    }
  }

  const confirmDeleteAccount = async () => {
    if (!user) return
    try {
      await deleteAccountAndData(user)
      pushToast('Account deleted.', 'danger')
      setActiveView('dashboard')
    } catch (err) {
      if (err?.code === 'auth/requires-recent-login') {
        pushToast('Please log in again before deleting your account.', 'danger')
      } else {
        pushToast(`Delete failed: ${err.message}`, 'danger')
      }
    } finally {
      setDeleteAccountOpen(false)
    }
  }

  const isAccountView = activeView === 'account'

  return (
    <div
      className="theme-bg theme-text font-sans min-h-screen overflow-x-hidden"
      style={{ transition: 'background-color 0.3s, color 0.3s' }}
    >
      {/* Ambient blobs */}
      <div className="fixed -top-36 -left-36 w-[500px] h-[500px] rounded-full pointer-events-none blur-[100px]"
        style={{ background: 'radial-gradient(circle, #c8b89a, transparent)', opacity: isDark ? 0.1 : 0.07 }} />
      <div className="fixed -bottom-24 -right-24 w-[400px] h-[400px] rounded-full pointer-events-none blur-[100px]"
        style={{ background: 'radial-gradient(circle, #7a6a5a, transparent)', opacity: isDark ? 0.1 : 0.07 }} />

      <Navbar
        isDark={isDark}
        toggleTheme={toggleTheme}
        onAddLog={openAddLog}
        onOpenAccount={() => setActiveView('account')}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-8 space-y-6">
        {isAccountView ? (
          <AccountPage
            user={user}
            logs={displayLogs}
            settings={settings}
            onBack={() => setActiveView('dashboard')}
            onDelete={() => setDeleteAccountOpen(true)}
          />
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {statCards.map(card => {
                if (card.id !== 'stat-required') return <StatCard key={card.id} {...card} />
                const valueNode = isEditingRequired ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="number"
                      min="1"
                      value={requiredDraft}
                      onChange={e => setRequiredDraft(e.target.value)}
                      className="theme-input rounded-xl px-3 py-2 text-[1rem] font-semibold"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={saveRequiredEdit}
                        disabled={savingRequired}
                        className="px-3 py-1.5 rounded-lg text-[0.7rem] font-medium"
                        style={{
                          background: savingRequired ? 'rgba(200,184,154,0.4)' : 'linear-gradient(135deg, #c8b89a, #a89070)',
                          color: '#0d0d0f',
                          cursor: savingRequired ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {savingRequired ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelRequiredEdit}
                        className="px-3 py-1.5 rounded-lg text-[0.7rem]"
                        style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
                      >
                        Cancel
                      </button>
                    </div>
                    {requiredError && (
                      <span className="text-[0.68rem]" style={{ color: 'var(--danger)' }}>{requiredError}</span>
                    )}
                  </div>
                ) : (
                  `${required} hrs`
                )
                return (
                  <StatCard
                    key={card.id}
                    {...card}
                    value={valueNode}
                    onIconClick={!isEditingRequired ? openRequiredEdit : undefined}
                    iconTitle="Edit required hours"
                    iconAccent
                  />
                )
              })}
            </div>

            <ProgressBar completed={completed} required={required} avgDaily={avgDaily} />

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
              <div className="space-y-6">
                <ActivityTable
                  logs={displayLogs}
                  onAddLog={openAddLog}
                  onBulkAdd={() => setBulkOpen(true)}
                  onExport={exportReport}
                  onViewNote={setNoteViewLog}
                  onEditLog={openEditLog}
                  onDeleteLog={handleDeleteLog}
                />
                <CalendarView logs={logs} />
              </div>
              <WeeklySummary weeks={weeklySummaries} />
            </div>
          </>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 pb-10 pt-2">
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[0.75rem]"
          style={{ color: 'var(--muted)', borderTop: '1px solid var(--border)' }}
        >
          <a
            href="https://github.com/kimalfredmolina"
            target="_blank"
            rel="noreferrer"
            className="py-4 hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            GitHub
          </a>
          <span className="py-4">
            &copy; {new Date().getFullYear()} All rights reserved.
          </span>
        </div>
      </footer>

      <AddLogModal
        isOpen={modalOpen}
        onClose={closeLogModal}
        isDark={isDark}
        initialLog={editingLog}
        onSave={(log, mode) => {
          if (mode === 'edit') pushToast('Edit successfully.')
          if (mode === 'add') pushToast('Added successfully.')
        }}
      />

      <BulkAddModal
        isOpen={bulkOpen}
        onClose={() => setBulkOpen(false)}
        onSave={(entries) => {
          if (entries?.length) pushToast(`Added ${entries.length} logs successfully.`)
        }}
      />

      <SetupOjtModal
        isOpen={needsSetup}
        onClose={() => setNeedsSetup(false)}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Log"
        message="Are you sure you want to delete this log? This action cannot be undone."
      />

      <DeleteConfirmModal
        isOpen={deleteAccountOpen}
        onClose={() => setDeleteAccountOpen(false)}
        onConfirm={confirmDeleteAccount}
        title="Delete Account"
        message="This will permanently delete your account and all of your stored data. This action cannot be undone."
      />

      <NoteViewModal
        isOpen={Boolean(noteViewLog)}
        onClose={() => setNoteViewLog(null)}
        log={noteViewLog}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}

export default HomePage
