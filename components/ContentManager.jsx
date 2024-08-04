'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from './SessionProvider'
import { addContent, getAllContent, getContentBySession } from '../lib/db'
import { createSyncChannel, broadcastUpdate } from '../lib/sync'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'

export function ContentManager() {
  const { session } = useSession()
  const [content, setContent] = useState('')
  const [contentList, setContentList] = useState([])
  const [syncChannel, setSyncChannel] = useState(null)

  const fetchContent = useCallback(async () => {
    try {
      const fetchedContent = await getAllContent()
      setContentList(fetchedContent)
    } catch (error) {
      console.error('Failed to fetch content:', error)
    }
  }, [])

  useEffect(() => {
    fetchContent()
    
    const channel = createSyncChannel((message) => {
      if (message.type === 'CONTENT_UPDATED') {
        fetchContent()
      }
    })
    setSyncChannel(channel)

    return () => {
      channel.close()
    }
  }, [fetchContent])

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const newContent = { text: content, session, timestamp: new Date().toISOString() }
      await addContent(newContent)
      setContent('')
      fetchContent()
      broadcastUpdate(syncChannel, { type: 'CONTENT_UPDATED' })
    } catch (error) {
      console.error('Failed to add content:', error)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your content here..."
          className="mb-2"
        />
        <Button type="submit">Add Content</Button>
      </form>
      <ul>
        {contentList.map((item) => (
          <li key={item.id} className="mb-2">
            <strong>{item.session}:</strong> {item.text}
          </li>
        ))}
      </ul>
    </div>
  )
}