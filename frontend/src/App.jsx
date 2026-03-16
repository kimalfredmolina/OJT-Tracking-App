import React, { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import LoginPage from './authentication/LoginPage'
import HomePage from './pages/HomePage'
import RegisterSuccessModal from './components/RegisterSuccessModal'

const App = () => {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const [, setForceUpdate] = useState(0)

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  const toggleTheme = () => setIsDark((prev) => !prev)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setTimeout(() => {
        setUser(currentUser)
        setChecking(false)
      }, 100)
    })
    return () => unsubscribe()
  }, [])

  const handleCloseSuccess = () => {
    localStorage.removeItem('showRegisterSuccess')
    setForceUpdate(prev => prev + 1)
  }

  if (checking) return null

  if (user && localStorage.getItem('showRegisterSuccess') === 'true') {
    return (
      <div className="relative">
        <LoginPage isDark={isDark} toggleTheme={toggleTheme} />
        <RegisterSuccessModal 
          isOpen={true} 
          onClose={handleCloseSuccess}
          userEmail={user.email}
        />
      </div>
    )
  }

  return user
    ? <HomePage isDark={isDark} toggleTheme={toggleTheme} user={user} />
    : <LoginPage isDark={isDark} toggleTheme={toggleTheme} />
}

export default App