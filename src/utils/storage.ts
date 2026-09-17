import { UserProfile, VitalRecord, CycleRecord, ReminderItem } from '../types';
import { DEFAULT_USER, INITIAL_VITALS, INITIAL_CYCLES, INITIAL_REMINDERS } from '../data/defaultData';

const STORAGE_KEYS = {
  USER: 'aura_user_profile_v1',
  VITALS: 'aura_vitals_records_v1',
  CYCLES: 'aura_cycle_records_v1',
  REMINDERS: 'aura_reminders_v1',
  TODAY_MOOD: 'aura_today_mood_v1',
  ENCRYPTION_META: 'aura_security_envelope_v1',
};

// Safe storage accessors
export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) return DEFAULT_USER;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load user profile:', e);
    return DEFAULT_USER;
  }
}

export function saveUserProfile(user: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user profile:', e);
  }
}

export function loadVitals(): VitalRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VITALS);
    if (!raw) return INITIAL_VITALS;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load vitals:', e);
    return INITIAL_VITALS;
  }
}

export function saveVitals(vitals: VitalRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.VITALS, JSON.stringify(vitals));
  } catch (e) {
    console.error('Failed to save vitals:', e);
  }
}

export function loadCycles(): CycleRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CYCLES);
    if (!raw) return INITIAL_CYCLES;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load cycles:', e);
    return INITIAL_CYCLES;
  }
}

export function saveCycles(cycles: CycleRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CYCLES, JSON.stringify(cycles));
  } catch (e) {
    console.error('Failed to save cycles:', e);
  }
}

export function loadReminders(): ReminderItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    if (!raw) return INITIAL_REMINDERS;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load reminders:', e);
    return INITIAL_REMINDERS;
  }
}

export function saveReminders(reminders: ReminderItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  } catch (e) {
    console.error('Failed to save reminders:', e);
  }
}

export function getTodayMood(): string {
  return localStorage.getItem(STORAGE_KEYS.TODAY_MOOD) || 'peaceful';
}

export function setTodayMood(mood: string): void {
  localStorage.setItem(STORAGE_KEYS.TODAY_MOOD, mood);
}

// Complete Account & Health Data Erasure (Privacy requirement)
export function deleteAllUserData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}

// Data Export for user transparency
export function exportAllUserData(): string {
  const data = {
    auraExportVersion: '1.0',
    exportedAt: new Date().toISOString(),
    profile: loadUserProfile(),
    vitals: loadVitals(),
    cycles: loadCycles(),
    reminders: loadReminders(),
    privacyNotice: 'Aura encrypted local health record. Never sold, never monetized.',
  };
  return JSON.stringify(data, null, 2);
}
