import { Episode } from '../types';
import { EPISODES_DATA } from '../data/episodesData';

const STORAGE_KEY = 'kua_broadcast_saved_episodes';
const IDB_NAME = 'kua_podcast_db';
const IDB_STORE = 'recorded_videos';

// Open IndexedDB database for large video blob storage
function openVideoDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(IDB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Save video blob into IndexedDB
export async function saveVideoBlobToIdb(episodeId: string, blob: Blob): Promise<void> {
  try {
    const db = await openVideoDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      const req = store.put(blob, episodeId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('Could not save video blob to IndexedDB:', e);
  }
}

// Retrieve video blob from IndexedDB and create object URL
export async function getVideoBlobFromIdb(episodeId: string): Promise<Blob | null> {
  try {
    const db = await openVideoDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(episodeId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('Could not load video blob from IndexedDB:', e);
    return null;
  }
}

// Load broadcast episodes saved in localStorage
export function loadBroadcastEpisodes(): Episode[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.warn('Error reading broadcast episodes from localStorage:', err);
    return [];
  }
}

// Save a new broadcast episode into localStorage and trigger sync event
export function saveBroadcastEpisode(newEpisode: Episode, videoBlob?: Blob): Episode[] {
  try {
    const existing = loadBroadcastEpisodes();
    // Prepend new episode (avoid duplicates by id)
    const filtered = existing.filter((ep) => ep.id !== newEpisode.id);
    const updated = [newEpisode, ...filtered];
    
    // Save metadata to localStorage (without giant video blob URL if not persistent)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // If a blob is provided, asynchronously persist it to IndexedDB
    if (videoBlob) {
      saveVideoBlobToIdb(newEpisode.id, videoBlob).catch((e) => {
        console.warn('Failed to store video in IDB:', e);
      });
    }

    // Dispatch global event for instant UI reactivity across components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kua_broadcast_saved', { detail: newEpisode }));
    }

    return updated;
  } catch (err) {
    console.warn('Error saving broadcast episode to localStorage:', err);
    return loadBroadcastEpisodes();
  }
}

// Delete an episode from storage
export function deleteBroadcastEpisode(id: string): Episode[] {
  try {
    const existing = loadBroadcastEpisodes();
    const updated = existing.filter((ep) => ep.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kua_broadcast_saved'));
    }
    return updated;
  } catch (err) {
    console.warn('Error deleting broadcast episode:', err);
    return loadBroadcastEpisodes();
  }
}

// Get combined list of all episodes (broadcast archives + predefined default episodes)
export function getAllEpisodes(): Episode[] {
  const customEpisodes = loadBroadcastEpisodes();
  const existingIds = new Set(customEpisodes.map((e) => e.id));
  const defaults = EPISODES_DATA.filter((e) => !existingIds.has(e.id));
  return [...customEpisodes, ...defaults];
}
