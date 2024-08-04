export function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('TextContentDB', 1)
  
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result
        const store = db.createObjectStore('content', { keyPath: 'id', autoIncrement: true })
        store.createIndex('session', 'session', { unique: false })
      }
    })
  }
  
  export async function addContent(content) {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['content'], 'readwrite')
      const store = transaction.objectStore('content')
      const request = store.add(content)
  
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }
  

  // get content by session
  export async function getContentBySession(session) {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['content'], 'readonly')
      const store = transaction.objectStore('content')
      const index = store.index('session')
      const request = index.getAll(session)
  
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  // get all content
  export async function getAllContent() {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['content'], 'readonly')
      const store = transaction.objectStore('content')
      const request = store.getAll()
  
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }