import { encryptData, decryptData } from './encryption';


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
    const encryptedContent = encryptData({
      ...content,
      timestamp: new Date().toISOString(),
      isFile: content.isFile || false
    })
    const request = store.add({encryptedContent })

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

export async function getContentBySession(session) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['content'], 'readonly')
    const store = transaction.objectStore('content')
    // const index = store.index('session')
    const request = store.getAll(session)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const decryptedResults = request.result.map(item => {
        const decrypted = decryptData(item.encryptedContent);
        return { id: item.id, ...decrypted };
      }).filter(item => item.session === session);

      // Sort the results by timestamp in descending order
      const sortedResults = decryptedResults.sort((a, b) => 
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
    const request = store.getAll()

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const decryptedResults = request.result.map(item => {
        if (item.encryptedContent) {
          const decrypted = decryptData(item.encryptedContent);
          return decrypted ? { id: item.id, ...decrypted } : null;
        } else {
          // Handle non-encrypted data
          return { id: item.id, ...item };
        }
      }).filter(Boolean); // Remove null values

      // Sort the results by timestamp in descending order
      const sortedResults = decryptedResults.sort((a, b) => 
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
      let fullText;
      if (request.result.encryptedContent) {
        const decrypted = decryptData(request.result.encryptedContent);
        fullText = decrypted ? decrypted.text : '';
      } else {
        // Handle non-encrypted data
        fullText = request.result.text || '';
      }
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
      const metadata = request.result.map(item => {
        let decrypted;
        if (item.encryptedContent) {
          decrypted = decryptData(item.encryptedContent);
        } else {
          // Handle non-encrypted data
          decrypted = item;
        }
        if (!decrypted) return null;
        return {
          id: item.id,
          session: decrypted.session,
          timestamp: decrypted.timestamp,
          previewText: decrypted.text.slice(0, 100) + (decrypted.text.length > 100 ? '...' : ''),
          textLength: decrypted.text.length,
          isFile: decrypted.isFile,
          fileName: decrypted.fileName
        };
      }).filter(Boolean); // Remove null values
      // Sort the results by timestamp in descending order
      metadata.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
      resolve(metadata)
    }
  })
}

// Function to delete content
export async function clearDatabase() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['content'], 'readwrite')
    const store = transaction.objectStore('content')
    const request = store.clear()

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}