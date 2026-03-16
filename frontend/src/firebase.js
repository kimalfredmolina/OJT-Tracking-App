import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase, ref, set, get, push, update, remove, onValue, off } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const db      = getFirestore(app);
export const auth    = getAuth(app);
export const storage = getStorage(app);
export const rtdb    = getDatabase(app);

// ─── Auth helpers ───────────────────────────────────────────────
export const getCurrentUser = () => auth.currentUser
export const onAuthChange   = (cb) => auth.onAuthStateChanged(cb)

// ─── Log helpers ────────────────────────────────────────────────
export const addLog = async (uid, { logDate, timeIn, timeOut, breakHr, computedHours, notes }) => {
  const dayRef = ref(rtdb, `${uid}/logs/${logDate}`)
  const existing = await get(dayRef)
  if (existing.exists()) {
    throw new Error('A log already exists for this date.')
  }
  const entry = {
    timeIn:    `${String(timeIn.h).padStart(2,'0')}:${String(timeIn.m).padStart(2,'0')} ${timeIn.p}`,
    timeOut:   `${String(timeOut.h).padStart(2,'0')}:${String(timeOut.m).padStart(2,'0')} ${timeOut.p}`,
    breakHr,
    hours:     computedHours,
    notes:     notes || '',
    createdAt: new Date().toISOString(),
  }
  const newRef = push(dayRef)
  await set(newRef, entry)
  return newRef.key
}

export const updateLog = async (uid, logDate, logId, { timeIn, timeOut, breakHr, computedHours, notes }) => {
  const entry = {
    timeIn:    `${String(timeIn.h).padStart(2,'0')}:${String(timeIn.m).padStart(2,'0')} ${timeIn.p}`,
    timeOut:   `${String(timeOut.h).padStart(2,'0')}:${String(timeOut.m).padStart(2,'0')} ${timeOut.p}`,
    breakHr,
    hours:     computedHours,
    notes:     notes || '',
    updatedAt: new Date().toISOString(),
  }
  await update(ref(rtdb, `${uid}/logs/${logDate}/${logId}`), entry)
}

export const deleteLog = async (uid, logDate, logId) => {
  await remove(ref(rtdb, `${uid}/logs/${logDate}/${logId}`))
}

export const addBulkLogs = async (uid, entries) => {
  const dates = entries.map(e => e.logDate).filter(Boolean)
  const uniqueDates = new Set(dates)
  if (uniqueDates.size !== dates.length) {
    throw new Error('Duplicate dates found in bulk entries.')
  }
  for (const date of uniqueDates) {
    const daySnap = await get(ref(rtdb, `${uid}/logs/${date}`))
    if (daySnap.exists()) {
      throw new Error(`A log already exists for ${date}.`)
    }
  }
  const updates = {}
  for (const entry of entries) {
    const { logDate, timeIn, timeOut, breakHr, notes } = entry
    const toMin = ({ h, m, p }) => { let hr = h % 12; if (p === 'PM') hr += 12; return hr * 60 + m }
    const hours = Math.max(0, (toMin(timeOut) - toMin(timeIn)) / 60 - (breakHr || 0))
    const newRef = push(ref(rtdb, `${uid}/logs/${logDate}`))
    updates[`${uid}/logs/${logDate}/${newRef.key}`] = {
      timeIn:    `${String(timeIn.h).padStart(2,'0')}:${String(timeIn.m).padStart(2,'0')} ${timeIn.p}`,
      timeOut:   `${String(timeOut.h).padStart(2,'0')}:${String(timeOut.m).padStart(2,'0')} ${timeOut.p}`,
      breakHr:   breakHr || 0,
      hours,
      notes:     notes || '',
      createdAt: new Date().toISOString(),
    }
  }
  await update(ref(rtdb), updates)
}

// ─── Settings helpers ───────────────────────────────────────────
export const saveSettings = async (uid, settings) => {
  await set(ref(rtdb, `${uid}/settings`), { ...settings, updatedAt: new Date().toISOString() })
}

// ─── Real-time listeners ────────────────────────────────────────
export const subscribeLogs = (uid, callback) => {
  const r = ref(rtdb, `${uid}/logs`)
  const handler = (snap) => {
    if (!snap.exists()) return callback([])
    const result = []
    snap.forEach(dateSnap => {
      dateSnap.forEach(logSnap => {
        result.push({ id: logSnap.key, date: dateSnap.key, ...logSnap.val() })
      })
    })
    callback(result.sort((a, b) => b.date.localeCompare(a.date)))
  }
  onValue(r, handler)
  return () => off(r, 'value', handler)
}

export const subscribeSettings = (uid, callback) => {
  const r = ref(rtdb, `${uid}/settings`)
  const handler = (snap) => callback(snap.exists() ? snap.val() : null)
  onValue(r, handler)
  return () => off(r, 'value', handler)
}
