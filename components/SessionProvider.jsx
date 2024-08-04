'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'

const SessionContext = createContext()

export function SessionProvider({ children }) {
  const [session, setSession] = useState('writer')

  useEffect(() => {
    const storedSession = localStorage.getItem('session')
    if (storedSession) setSession(storedSession)
  }, [])

  const switchSession = (newSession) => {
    setSession(newSession)
    localStorage.setItem('session', newSession)
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