import React, { useState } from 'react'
import Navbar        from '../components/Navbar'
import StatCard      from '../components/StatCard'
import ProgressBar   from '../components/ProgressBar'
import ActivityTable from '../components/ActivityTable'
import CalendarView  from '../components/CalendarView'
import WeeklySummary from '../components/WeeklySummary'
import AddLogModal   from '../components/AddLogModal'
import BulkAddModal  from '../components/BulkAddModal'
import SetupOjtModal from '../components/SetupOjtModal'

const REQUIRED_HOURS = 500

const SAMPLE_LOGS = [
  { id: 1, date: 'Feb 23', hours: 8, notes: 'Designed UI components' },
  { id: 2, date: 'Feb 24', hours: 8, notes: 'Debugged API responses' },
  { id: 3, date: 'Feb 25', hours: 8, notes: 'Fixed database queries' },
  { id: 4, date: 'Feb 26', hours: 8, notes: 'Code review & testing' },
]

const SAMPLE_WEEKS = [
  { label: 'Week 1', total: 40, tasks: ['Design UI', 'Component library'] },
  { label: 'Week 2', total: 40, tasks: ['Bug fixing', 'API integration'] },
  { label: 'Week 3', total: 36, tasks: ['Code review', 'Testing'] },
]

const today     = new Date()
const deadline  = new Date('2026-05-28')
const daysLeft  = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
const COMPLETED = SAMPLE_LOGS.reduce((s, l) => s + l.hours, 0)
const REMAINING = REQUIRED_HOURS - COMPLETED
const AVG_DAILY = Math.round(COMPLETED / SAMPLE_LOGS.length)
const loggedDays = new Set(SAMPLE_LOGS.map(l => parseInt(l.date.split(' ')[1])))

const STAT_CARDS = [
  {
    id: 'stat-required', label: 'Required', value: `${REQUIRED_HOURS} hrs`,
    sub: 'Total internship hours',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </>
    ),
  },
  {
    id: 'stat-completed', label: 'Completed', value: `${COMPLETED} hrs`,
    sub: `${Math.round((COMPLETED / REQUIRED_HOURS) * 100)}% done`, highlight: true,
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />,
  },
  {
    id: 'stat-remaining', label: 'Remaining', value: `${REMAINING} hrs`, sub: 'Hours to go',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
  },
  {
    id: 'stat-deadline', label: 'Deadline', value: 'May 28, 2026', sub: `In ${daysLeft} days`,
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
  },
]

const HomePage = ({ isDark, toggleTheme }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [bulkModalOpen, setBulkModalOpen] = useState(false)
  
  const [needsSetup, setNeedsSetup] = useState(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('needsSetup') === 'true') {
      return true
    }
    return false
  })

  const handleSetupComplete = () => {
    setNeedsSetup(false)
    localStorage.removeItem('needsSetup')
  }

  const handleSaveLog = (logData) => {
    console.log('New log saved:', logData)
  }

  return (
    <div className="theme-bg theme-text font-sans min-h-screen overflow-x-hidden" style={{ transition: 'background-color 0.3s, color 0.3s' }}>
      <div className="fixed -top-36 -left-36 w-[500px] h-[500px] rounded-full pointer-events-none blur-[100px]" style={{ background: 'radial-gradient(circle, #c8b89a, transparent)', opacity: isDark ? 0.1 : 0.07 }} />
      <div className="fixed -bottom-24 -right-24 w-[400px] h-[400px] rounded-full pointer-events-none blur-[100px]" style={{ background: 'radial-gradient(circle, #7a6a5a, transparent)', opacity: isDark ? 0.1 : 0.07 }} />

      <Navbar isDark={isDark} toggleTheme={toggleTheme}onAddLog={() => setModalOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-8 space-y-6">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">{STAT_CARDS.map(card => (<StatCard key={card.id} {...card} />))}</div>

        <ProgressBar completed={COMPLETED} required={REQUIRED_HOURS} avgDaily={AVG_DAILY} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

          <div className="space-y-6">
            <ActivityTable
              logs={SAMPLE_LOGS}
              onAddLog={() => setModalOpen(true)}
              onBulkAdd={() => setBulkModalOpen(true)}
            />
            <CalendarView  loggedDays={loggedDays} />
          </div>

          <WeeklySummary weeks={SAMPLE_WEEKS} />
        </div>
      </main>

      <AddLogModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveLog}
        isDark={isDark}
      />

      <BulkAddModal
        isOpen={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        onSave={(entries) => {
          console.log('Bulk entries:', entries)
        }}
      />

      <SetupOjtModal
        isOpen={needsSetup}
        onClose={handleSetupComplete}
      />
    </div>
  )
}

export default HomePage
