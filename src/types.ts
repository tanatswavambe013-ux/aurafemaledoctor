export type MoodType = 'calm' | 'peaceful' | 'hopeful' | 'tired' | 'anxious' | 'in_pain' | 'empowered' | 'sensitive';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  age: number;
  height: number;
  heightUnit: 'cm' | 'in';
  weightUnit: 'kg' | 'lbs';
  temperatureUnit?: 'C' | 'F';
  glucoseUnit?: 'mg/dL' | 'mmol/L';
  conditions: string[];
  reasonsForUse?: string[]; // e.g. "Cancer Care & Recovery", "Menstrual Cycle & Cramps", "Trying to Conceive", "Hypertension & Vitals", "Water & Prayer Wellness", "Hormone Balance / PCOS"
  primaryConcernsOrProblems?: string; // Detailed state of reason/problems she is experiencing
  cancerSpecifics?: {
    hasCancerHistory?: boolean;
    cancerType?: string; // e.g. "Breast Cancer", "Ovarian Cancer", "Cervical Cancer", "Other"
    phase?: 'newly_diagnosed' | 'in_chemo_radiation' | 'post_surgery' | 'hormone_therapy' | 'remission_survivor' | 'prevention';
    chemoCycle?: string;
    oncologistName?: string;
    nextTreatmentDate?: string;
  };
  waterTargetGlasses?: number; // default 8
  waterConsumedToday?: number; // count of glasses logged today
  lastWaterResetDate?: string; // YYYY-MM-DD
  cycleLength: number;
  periodDuration: number;
  isRegistered: boolean;
  createdAt: string;
  lastSelfExamDate?: string;
  subscription: {
    status: 'active' | 'trial' | 'none';
    plan: string;
    amount: number;
    currency: string;
    paymentMethod: 'card' | 'paypal' | 'ecocash' | 'flutterwave' | 'paystack';
    renewalDate: string;
    autoRenew: boolean;
  };
}

export interface VitalRecord {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  weight?: number; // stored in user's selected unit
  systolic?: number;
  diastolic?: number;
  pulse?: number;
  pulseMethod?: 'camera_optical' | 'manual_tap' | 'device';
  temperature?: number; // stored in Celsius, displayable in C or F
  temperatureMethod?: 'forehead' | 'oral' | 'axillary';
  bloodGlucose?: number;
  bloodGlucoseUnit?: 'mg/dL' | 'mmol/L';
  bloodGlucoseContext?: 'fasting' | 'before_meal' | 'after_meal' | 'bedtime' | 'random';
  notes?: string;
  alert?: {
    level: 'normal' | 'elevated' | 'high' | 'urgent';
    title: string;
    message: string;
  };
}

export interface CycleRecord {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  flow: 'light' | 'medium' | 'heavy' | 'spotting';
  symptoms: string[];
  mood?: MoodType;
  notes?: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  type: 'medication' | 'period' | 'self_exam' | 'vitals' | 'appointment' | 'water' | 'prayer' | 'custom';
  time: string; // HH:MM
  frequency: 'daily' | 'weekly' | 'monthly' | 'one_time' | 'cycle_linked' | 'hourly';
  enabled: boolean;
  friendlyMessage: string;
  targetDate?: string; // For one-time appointments (YYYY-MM-DD)
  dosageOrDoctor?: string;
  prayerTradition?: 'christian' | 'islamic' | 'jewish' | 'hindu' | 'interfaith' | 'mindful';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isRedFlag?: boolean;
}

export interface SelfExamStep {
  step: number;
  title: string;
  description: string;
  visualNote: string;
  tips: string;
}

export interface ScreeningGuide {
  ageRange: string;
  title: string;
  recommendation: string;
  frequency: string;
  specialConsideration: string;
}
