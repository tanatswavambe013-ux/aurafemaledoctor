import { UserProfile, VitalRecord, CycleRecord, ReminderItem, ScreeningGuide, SelfExamStep } from '../types';

export const COMMON_CONDITIONS = [
  'Breast Cancer (In-Treatment / Chemo)',
  'Breast Cancer Survivor / Remission',
  'Gynecologic Cancer (Ovarian / Cervical / Uterine)',
  'PCOS (Polycystic Ovary Syndrome)',
  'Endometriosis',
  'Type 2 Diabetes / Pre-diabetes',
  'Hypertension (High Blood Pressure)',
  'Anxiety / Depression / PTSD',
  'Hypothyroidism / Hashimoto\'s',
  'Uterine Fibroids / Adenomyosis',
  'Gestational Diabetes / Postpartum',
  'Autoimmune / Lupus / Rheumatoid',
  'Perimenopause / Menopause Transition',
  'Fertility / Trying to Conceive'
];

export const REASONS_FOR_USE_OPTIONS = [
  { id: 'cancer_support', label: 'Cancer Care & Oncology Support', emoji: '🎗️' },
  { id: 'cycle_tracking', label: 'Period, Ovulation & Cycle Tracking', emoji: '🩸' },
  { id: 'vitals_monitoring', label: 'Blood Pressure & Temperature Testing', emoji: '🩺' },
  { id: 'water_prayer', label: 'Daily Water & Prayer / Spiritual Reminders', emoji: '🕊️' },
  { id: 'hormone_pcos', label: 'Hormonal Health & PCOS / Endo Comfort', emoji: '🌿' },
  { id: 'breast_awareness', label: 'Breast Cancer Awareness & Self-Exams', emoji: '🌸' },
  { id: 'fertility', label: 'Fertility & Preparing for Pregnancy', emoji: '👶' },
  { id: 'mental_wellness', label: 'Daily Affirmations & Emotional Resilience', emoji: '✨' },
];

export const DEFAULT_USER: UserProfile = {
  id: 'aura_user_primary',
  name: 'Maya',
  email: 'maya@sisterhood.org',
  age: 32,
  height: 165,
  heightUnit: 'cm',
  weightUnit: 'kg',
  temperatureUnit: 'C',
  conditions: ['PCOS (Polycystic Ovary Syndrome)', 'Anxiety / Depression / PTSD'],
  reasonsForUse: [
    'Hormonal Health & PCOS / Endo Comfort',
    'Blood Pressure & Temperature Testing',
    'Daily Water & Prayer / Spiritual Reminders',
    'Breast Cancer Awareness & Self-Exams'
  ],
  primaryConcernsOrProblems: 'Navigating irregular hormonal cycles, keeping daily blood pressure and body temperature stable, and staying hydrated and spiritually grounded through daily prayer.',
  waterTargetGlasses: 8,
  waterConsumedToday: 5,
  lastWaterResetDate: new Date().toISOString().split('T')[0],
  cycleLength: 29,
  periodDuration: 5,
  isRegistered: true,
  createdAt: '2026-08-01',
  lastSelfExamDate: '2026-08-20',
  subscription: {
    status: 'active',
    plan: 'Aura Care Monthly',
    amount: 1.00,
    currency: 'USD',
    paymentMethod: 'card',
    renewalDate: '2026-10-17',
    autoRenew: true,
  },
};

export const INITIAL_VITALS: VitalRecord[] = [
  {
    id: 'v-1',
    date: '2026-09-03',
    time: '08:30',
    weight: 64.2,
    systolic: 118,
    diastolic: 78,
    pulse: 72,
    temperature: 36.6,
    temperatureMethod: 'oral',
    notes: 'Feeling calm after a morning walk.',
  },
  {
    id: 'v-2',
    date: '2026-09-07',
    time: '09:00',
    weight: 64.5,
    systolic: 122,
    diastolic: 80,
    pulse: 76,
    temperature: 36.8,
    temperatureMethod: 'forehead',
    notes: 'Busy work day, slightly tired.',
  },
  {
    id: 'v-3',
    date: '2026-09-11',
    time: '08:15',
    weight: 64.0,
    systolic: 116,
    diastolic: 76,
    pulse: 70,
    temperature: 36.5,
    temperatureMethod: 'forehead',
  },
  {
    id: 'v-4',
    date: '2026-09-14',
    time: '19:40',
    weight: 64.8,
    systolic: 138,
    diastolic: 88,
    pulse: 82,
    temperature: 37.2,
    temperatureMethod: 'oral',
    notes: 'Slightly high reading after stressful commute.',
    alert: {
      level: 'elevated',
      title: 'Gentle Notice: Blood Pressure is Elevated',
      message: 'Take 5 slow, deep breaths, drink some water, and re-test in 15 minutes. If elevated readings continue over several days, please reach out to your doctor.',
    },
  },
  {
    id: 'v-5',
    date: '2026-09-17',
    time: '08:00',
    weight: 63.9,
    systolic: 119,
    diastolic: 78,
    pulse: 73,
    temperature: 36.6,
    temperatureMethod: 'forehead',
    notes: 'Woke up well-rested!',
  },
];

export const INITIAL_CYCLES: CycleRecord[] = [
  {
    id: 'c-1',
    startDate: '2026-07-21',
    endDate: '2026-07-26',
    flow: 'medium',
    symptoms: ['Mild cramps', 'Fatigue'],
    mood: 'tired',
  },
  {
    id: 'c-2',
    startDate: '2026-08-19',
    endDate: '2026-08-24',
    flow: 'heavy',
    symptoms: ['Severe cramps', 'Bloating', 'Breast tenderness'],
    mood: 'sensitive',
  },
];

export const INITIAL_REMINDERS: ReminderItem[] = [
  {
    id: 'r-1',
    title: 'Morning Vitamin & Inositol',
    type: 'medication',
    time: '08:30',
    frequency: 'daily',
    enabled: true,
    friendlyMessage: 'Time for your morning nourishment and gentle self-care, lovely.',
    dosageOrDoctor: '1 capsule with breakfast',
  },
  {
    id: 'r-water-1',
    title: 'Hydration Gentle Nudge',
    type: 'water',
    time: '11:00',
    frequency: 'daily',
    enabled: true,
    friendlyMessage: 'A refreshing glass of water to nourish your skin, hormones, and cells.',
  },
  {
    id: 'r-prayer-1',
    title: 'Daily Prayer & Gratitude Reflection',
    type: 'prayer',
    time: '12:30',
    frequency: 'daily',
    enabled: true,
    friendlyMessage: 'Take 2 quiet minutes to breathe, pray, and lay down any burdens you are carrying.',
    prayerTradition: 'interfaith',
  },
  {
    id: 'r-2',
    title: 'Gentle Vitals Check (BP, Temp & Weight)',
    type: 'vitals',
    time: '09:00',
    frequency: 'weekly',
    enabled: true,
    friendlyMessage: 'A calm moment to log your numbers so we can keep an eye on your baseline.',
  },
  {
    id: 'r-3',
    title: 'Monthly Breast Self-Exam',
    type: 'self_exam',
    time: '10:00',
    frequency: 'monthly',
    enabled: true,
    friendlyMessage: 'Just 5 mindful minutes to check in with your body and know what is normal for you.',
  },
  {
    id: 'r-4',
    title: 'Annual Well-Woman Checkup with Dr. Ellis',
    type: 'appointment',
    time: '14:30',
    frequency: 'one_time',
    targetDate: '2026-10-05',
    enabled: true,
    friendlyMessage: 'Your upcoming consultation with Dr. Ellis — keep any questions written down!',
    dosageOrDoctor: 'Dr. Sarah Ellis, St. Jude Women\'s Clinic',
  },
];

export const SELF_EXAM_STEPS: SelfExamStep[] = [
  {
    step: 1,
    title: 'Visual Check in the Mirror',
    description: 'Stand before a mirror with your shoulders straight and arms relaxed on your hips. Look at your breasts.',
    visualNote: 'Arms at hips, facing forward under good lighting',
    tips: 'Notice their usual size, shape, and skin color. Look for any visible distortion, swelling, skin dimpling, or nipple inversion.',
  },
  {
    step: 2,
    title: 'Raise Your Arms High',
    description: 'Now, raise your arms overhead and look for the exact same changes from different angles.',
    visualNote: 'Both arms raised straight upward above head',
    tips: 'Raising your arms tenses the underlying pectoral muscles, which makes any skin tethering or asymmetry more visible.',
  },
  {
    step: 3,
    title: 'Gentle Nipple Observation',
    description: 'Look carefully at your nipples. Gently squeeze each nipple between two fingers.',
    visualNote: 'Soft inspection of nipple & areola area',
    tips: 'Check if there is any unusual fluid discharge (milky, yellow, clear, or blood-tinged) that happens without nursing.',
  },
  {
    step: 4,
    title: 'Lying Down: Surface Palpation',
    description: 'Lie down flat on a bed. Place a small pillow under your right shoulder and put your right arm behind your head.',
    visualNote: 'Lying flat, right arm tucked behind head',
    tips: 'When lying down, breast tissue spreads evenly over the chest wall, making it much easier to feel all layers of tissue.',
  },
  {
    step: 5,
    title: 'Circular Firm Pressure with Finger Pads',
    description: 'Use the finger pads (not the tips) of your 3 middle fingers. Move in small dime-sized circular motions.',
    visualNote: 'Light, medium, and firm circular sweeps',
    tips: 'Use light pressure for surface tissue, medium pressure for midway, and firm pressure to feel tissue closest to the ribcage.',
  },
  {
    step: 6,
    title: 'Collarbone & Underarm Check',
    description: 'Extend your sweep from the collarbone down to the bra line, and across into your underarm / armpit area.',
    visualNote: 'Inspect the axillary lymph nodes under the arm',
    tips: 'Lymph nodes in the underarm can also swell. Switch sides and repeat steps 4 through 6 for your left breast.',
  },
];

export const SCREENING_GUIDES: ScreeningGuide[] = [
  {
    ageRange: 'Ages 20 – 39',
    title: 'Clinical Breast Exam & Breast Self-Awareness',
    recommendation: 'Clinical breast exam every 1 to 3 years by a healthcare professional. Monthly personal self-exams to become familiar with your natural baseline.',
    frequency: 'Every 1-3 years',
    specialConsideration: 'If you have a direct family history (mother, sister) or known BRCA1/BRCA2 genetic risk, consult your doctor about starting MRI screenings earlier.',
  },
  {
    ageRange: 'Ages 40 – 49',
    title: 'Annual or Biennial Mammogram Screening',
    recommendation: 'The USPSTF and American Cancer Society recommend all women begin screening mammograms at age 40, repeated every 1 to 2 years based on personal choice and doctor advice.',
    frequency: 'Every 1-2 years',
    specialConsideration: 'Discuss breast density with your radiologist. Women with dense breast tissue may benefit from supplementary 3D mammography (tomosynthesis) or ultrasound.',
  },
  {
    ageRange: 'Ages 50 – 74',
    title: 'Routine Mammogram Screenings',
    recommendation: 'Regular screening mammogram every 1 to 2 years. Continued clinical evaluation for any newly noticed sensations.',
    frequency: 'Every 1-2 years',
    specialConsideration: 'Consistent biennial screening in this age window has demonstrated the highest survival protection through early detection.',
  },
  {
    ageRange: 'Ages 75 & Beyond',
    title: 'Personalized Care & Continued Screening',
    recommendation: 'Screening mammography should continue as long as a woman is in good general health and expected to live 10 years or longer.',
    frequency: 'Discuss with your doctor',
    specialConsideration: 'Screening decisions are made collaboratively based on personal health goals, vitality, and medical history.',
  },
];

export const BREAST_SYMPTOMS_CHECKLIST = [
  {
    id: 'lump',
    label: 'A new lump or noticeable thickening in the breast or armpit',
    concernLevel: 'high',
    detail: 'Most lumps are non-cancerous cysts or fibroadenomas, but an ultrasound or mammogram is the best way to be certain.'
  },
  {
    id: 'skin_dimple',
    label: 'Dimpling, puckering, or redness resembling orange peel skin',
    concernLevel: 'high',
    detail: 'Skin changes can happen when deeper tissue changes pull slightly on Cooper’s ligaments.'
  },
  {
    id: 'nipple_invert',
    label: 'A newly inverted nipple or change in the direction it points',
    concernLevel: 'high',
    detail: 'If a nipple that was previously outward turns inward suddenly, let your doctor examine it.'
  },
  {
    id: 'nipple_discharge',
    label: 'Spontaneous fluid or bloody discharge from one nipple',
    concernLevel: 'high',
    detail: 'Spontaneous discharge from a single duct should always be reviewed clinically.'
  },
  {
    id: 'pain_focal',
    label: 'Persistent localized pain in one specific spot that does not fade with your cycle',
    concernLevel: 'moderate',
    detail: 'General cyclical breast soreness is very common; isolated non-cyclical pain warrants a quick check.'
  },
  {
    id: 'swollen_lymph',
    label: 'Swollen lymph nodes or firmness felt in the collarbone or armpit',
    concernLevel: 'moderate',
    detail: 'Can be linked to minor infections or immune activity, but should be monitored.'
  },
  {
    id: 'size_asymmetry',
    label: 'A sudden, noticeable change in the size, shape, or contour of one breast',
    concernLevel: 'moderate',
    detail: 'Natural slight asymmetry is normal for almost everyone; sudden changes are what to note.'
  }
];
