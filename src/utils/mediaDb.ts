/**
 * IndexedDB high-capacity storage for Hi-Quality Master Audio & Video files (up to 1 GB).
 * Prevents localStorage quota exceeded errors and preserves 100% original uncompressed fidelity.
 */

const DB_NAME = 'DussehraMediaDB_v1';
const DB_VERSION = 1;
const STORE_NAME = 'media_files';

interface StoredMediaRecord {
  id: string;
  blob: Blob;
  name: string;
  mimeType: string;
  size: number;
  savedAt: string;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Stores a raw uncompressed media blob (Audio/Video up to 1GB) in IndexedDB.
 */
export async function saveMediaBlob(
  fileId: string,
  blob: Blob,
  name: string,
  mimeType: string
): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const record: StoredMediaRecord = {
        id: fileId,
        blob,
        name,
        mimeType,
        size: blob.size,
        savedAt: new Date().toISOString(),
      };
      const req = store.put(record);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to save media in IndexedDB:', err);
    return false;
  }
}

/**
 * Retrieves a stored media blob by its unique file ID.
 */
export async function getMediaBlob(fileId: string): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.get(fileId);
      req.onsuccess = () => {
        const record = req.result as StoredMediaRecord | undefined;
        resolve(record ? record.blob : null);
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Creates an object URL for a media file stored in IndexedDB.
 */
export async function getMediaBlobUrl(fileId: string): Promise<string | null> {
  const blob = await getMediaBlob(fileId);
  if (!blob) return null;
  return URL.createObjectURL(blob);
}

/**
 * Deletes a media file from IndexedDB.
 */
export async function deleteMediaBlob(fileId: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.delete(fileId);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  } catch {
    // Ignore error
  }
}

/**
 * Helper to download the exact uncompressed Hi-Quality file to the user's computer.
 */
export async function downloadHiQualityMedia(fileId: string, fallbackUrl?: string, filename = 'song_master.mp3') {
  let blob = await getMediaBlob(fileId);
  let url = blob ? URL.createObjectURL(blob) : fallbackUrl;

  if (!url) {
    alert('ફાઇલ ડાઉનલોડ કરવા માટે ઉપલબ્ધ નથી.');
    return;
  }

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  if (blob) {
    setTimeout(() => URL.revokeObjectURL(url!), 10000);
  }
}
