'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSession } from './SessionProvider'
import { addContent, getAllContent, getContentChunk } from '../lib/db'
import { createSyncChannel, broadcastUpdate } from '../lib/sync'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Input } from './ui/input'

const CHUNK_SIZE = 1000 // Number of characters to load at a time

export function ContentManager() {
  const { session } = useSession()
  const [content, setContent] = useState('')
  const [contentList, setContentList] = useState([])
  const [syncChannel, setSyncChannel] = useState(null)
  const [expandedContent, setExpandedContent] = useState({})
  const fileInputRef = useRef(null)

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
    if (content.trim() === '') return

    try {
      const newContent = { text: content, session, timestamp: new Date().toISOString(), isFile: false  }
      await addContent(newContent)
      setContent('')
      fetchContent()
      broadcastUpdate(syncChannel, { type: 'CONTENT_UPDATED' })
    } catch (error) {
      console.error('Failed to add content:', error)
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const text = e.target.result
        const newContent = { text, session, isFile: true, fileName: file.name }
        await addContent(newContent)
        fetchContent()
        broadcastUpdate(syncChannel, { type: 'CONTENT_UPDATED' })
      } catch (error) {
        console.error('Failed to upload file:', error)
      }
    }
    reader.readAsText(file)
  }

  async function loadMoreContent(id) {
    const currentContent = expandedContent[id] || ''
    const nextChunk = await getContentChunk(id, currentContent.length, currentContent.length + CHUNK_SIZE)
    setExpandedContent(prev => ({
      ...prev,
      [id]: prev[id] ? prev[id] + nextChunk : nextChunk
    }))
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
      <Button type="submit" className="mr-2">Add Content</Button>
      <Input
        type="file"
        accept=".txt"
        onChange={handleFileUpload}
        ref={fileInputRef}
        className="hidden"
      />
      <Button type="button" onClick={() => fileInputRef.current.click()}>
        Upload File
      </Button>
    </form>
    <ul>
      {contentList.map((item) => (
        <li key={item.id} className="mb-4 p-4 border rounded">
          <strong>{item.session}:</strong> 
          {item.isFile && <span className="ml-2">(File: {item.fileName})</span>}
          <p>
            {expandedContent[item.id] || item.text.slice(0, CHUNK_SIZE)}
            {item.text.length > CHUNK_SIZE && !expandedContent[item.id] && '...'}
          </p>
          {item.text.length > CHUNK_SIZE && (expandedContent[item.id] || '').length < item.text.length && (
            <Button onClick={() => loadMoreContent(item.id)} className="mt-2">
              Load More
            </Button>
          )}
        </li>
      ))}
    </ul>
  </div>
  )
}