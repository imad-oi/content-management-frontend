export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('TextContentDB', 2) // Version 2

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      const transaction = event.target.transaction
      
      // Check if the 'content' object store already exists
      if (!db.objectStoreNames.contains('content')) {
        const store = db.createObjectStore('content', { keyPath: 'id', autoIncrement: true })
        store.createIndex('session', 'session', { unique: false })
      }

      // Get the existing store if it was already created
      const store = transaction.objectStore('content')

      // Check if the 'timestamp' index already exists, if not create it
      if (!store.indexNames.contains('timestamp')) {
        store.createIndex('timestamp', 'timestamp', { unique: false })
      }
    }
  })
}
export async function addContent(content) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['content'], 'readwrite')
    const store = transaction.objectStore('content')
    const request = store.add({
      ...content,
      timestamp: new Date().toISOString(), // Add timestamp
      isFile: content.isFile || false
    })

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

export async function getContentBySession(session) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['content'], 'readonly')
    const store = transaction.objectStore('content')
    const index = store.index('session')
    const request = index.getAll(session)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      // Sort the results by timestamp in descending order
      const sortedResults = request.result.sort((a, b) => 
        new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
      )
      resolve(sortedResults)
    }
  })
}

export async function getAllContent() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['content'], 'readonly')
    const store = transaction.objectStore('content')
    // const index = store.index('timestamp')
    const request = store.getAll()

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      // Sort the results by timestamp in descending order
      const sortedResults = request.result.sort((a, b) => 
        new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
      )
      resolve(sortedResults)
    }
  })
}

// New function to get a chunk of content
export async function getContentChunk(id, start, end) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['content'], 'readonly')
    const store = transaction.objectStore('content')
    const request = store.get(id)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const fullText = request.result.text
      resolve(fullText.slice(start, end))
    }
  })
}

// New function to get content metadata (everything except the full text)
export async function getContentMetadata() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['content'], 'readonly')
    const store = transaction.objectStore('content')
    const request = store.getAll()

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const metadata = request.result.map(item => ({
        id: item.id,
        session: item.session,
        timestamp: item.timestamp,
        previewText: item.text.slice(0, 100) + (item.text.length > 100 ? '...' : ''),
        textLength: item.text.length
      }))
      // Sort the results by timestamp in descending order
      metadata.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      resolve(metadata)
    }
  })
}