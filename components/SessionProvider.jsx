'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'

const SessionContext = createContext()

export function SessionProvider({ children }) {
  const [session, setSession] = useState('writer')

  useEffect(() => {
    const storedSession = sessionStorage.getItem('session')
    if (storedSession) setSession(storedSession)
  }, [])

  const switchSession = (newSession) => {
    setSession(newSession)
    sessionStorage.setItem('session', newSession)
  }

  return (
    <SessionContext.Provider value={{ session, switchSession }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  return useContext(SessionContext)
}

// Add a function to clear the session
export function clearSession() {
  sessionStorage.removeItem('session')
}