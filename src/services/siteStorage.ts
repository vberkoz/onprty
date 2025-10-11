// Site storage service using IndexedDB
export interface StoredSite {
  id: string;
  name: string;
  description: string;
  files: { [fileName: string]: string };
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'live' | 'error';
  url?: string;
}

const DB_NAME = 'OnprtyDB';
const DB_VERSION = 1;
const STORE_NAME = 'sites';

let db: IDBDatabase;

export async function initDB(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve();
    };

    request.onerror = () => {
      reject(new Error('Failed to open database'));
    };
  });
}

export async function saveSite(site: Omit<StoredSite, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const id = crypto.randomUUID();
  const now = new Date();
  
  const siteToStore: StoredSite = {
    ...site,
    id,
    createdAt: now,
    updatedAt: now,
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(siteToStore);

    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(new Error('Failed to save site'));
  });
}

export async function getSites(): Promise<StoredSite[]> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = (event) => {
      const sites = (event.target as IDBRequest).result;
      resolve(sites.sort((a: StoredSite, b: StoredSite) => b.updatedAt.getTime() - a.updatedAt.getTime()));
    };
    request.onerror = () => reject(new Error('Failed to get sites'));
  });
}

export async function getSite(id: string): Promise<StoredSite | null> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result || null);
    };
    request.onerror = () => reject(new Error('Failed to get site'));
  });
}

export async function updateSite(id: string, updates: Partial<StoredSite>): Promise<void> {
  const site = await getSite(id);
  if (!site) throw new Error('Site not found');

  const updatedSite = {
    ...site,
    ...updates,
    updatedAt: new Date(),
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(updatedSite);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error('Failed to update site'));
  });
}

export async function deleteSite(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error('Failed to delete site'));
  });
}

export function downloadSiteAsZip(site: StoredSite): void {
  // Create a simple zip-like structure
  const files = Object.entries(site.files);
  const zipContent = files.map(([name, content]) => 
    `--- ${name} ---\n${content}\n`
  ).join('\n');
  
  const blob = new Blob([zipContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${site.name}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}