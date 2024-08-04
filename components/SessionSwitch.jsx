'use client'

import { useSession } from './SessionProvider'
import { Button } from './ui/button'

export function SessionSwitch() {
  const { session, switchSession } = useSession()

  return (
    <div className="mb-4">
      <Button
        onClick={() => switchSession('writer')}
        variant={session === 'writer' ? 'default' : 'outline'}
        className="mr-2"
      >
        Writer
      </Button>
      <Button
        onClick={() => switchSession('publisher')}
        variant={session === 'publisher' ? 'default' : 'outline'}
      >
        Publisher
      </Button>
    </div>
  )
}