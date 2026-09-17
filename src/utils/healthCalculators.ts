import { CycleRecord, VitalRecord } from '../types';

export type VitalAlert = NonNullable<VitalRecord['alert']>;

export interface CyclePrediction {
  lastPeriodStart: Date | null;
  nextPeriodStart: Date | null;
  nextPeriodEnd: Date | null;
  ovulationDate: Date | null;
  fertileWindowStart: Date | null;
  fertileWindowEnd: Date | null;
  currentCycleDay: number;
  phase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | 'late';
  phaseDescription: string;
  isLate?: boolean;
  daysLate?: number;
}

export function calculateCyclePredictions(
  cycles: CycleRecord[],
  defaultCycleLength = 28,
  defaultPeriodDuration = 5
): CyclePrediction {
  if (!cycles || cycles.length === 0) {
    const today = new Date();
    return {
      lastPeriodStart: null,
      nextPeriodStart: null,
      nextPeriodEnd: null,
      ovulationDate: null,
      fertileWindowStart: null,
      fertileWindowEnd: null,
      currentCycleDay: 1,
      phase: 'follicular',
      phaseDescription: 'Log your first period to activate personalized predictions.',
    };
  }

  // Sort cycles descending by start date
  const sorted = [...cycles].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
  const latest = sorted[0];
  const lastStart = new Date(latest.startDate + 'T00:00:00');

  // Compute average cycle length if we have >= 2 cycles
  let avgCycle = defaultCycleLength;
  if (sorted.length >= 2) {
    const diffs: number[] = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      const d1 = new Date(sorted[i].startDate + 'T00:00:00').getTime();
      const d2 = new Date(sorted[i + 1].startDate + 'T00:00:00').getTime();
      const days = Math.round((d1 - d2) / (1000 * 60 * 60 * 24));
      if (days >= 20 && days <= 45) {
        diffs.push(days);
      }
    }
    if (diffs.length > 0) {
      avgCycle = Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length);
    }
  }

  const nextStart = new Date(lastStart);
  nextStart.setDate(nextStart.getDate() + avgCycle);

  const nextEnd = new Date(nextStart);
  nextEnd.setDate(nextEnd.getDate() + defaultPeriodDuration);

  // Ovulation usually occurs 14 days before next period
  const ovulation = new Date(nextStart);
  ovulation.setDate(ovulation.getDate() - 14);

  const fertileStart = new Date(ovulation);
  fertileStart.setDate(fertileStart.getDate() - 5);

  const fertileEnd = new Date(ovulation);
  fertileEnd.setDate(fertileEnd.getDate() + 1);

  // Current day
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = today.getTime() - lastStart.getTime();
  const currentCycleDay = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);

  // Check if period is late (today is past nextPeriodStart without a new period logged)
  const isLate = today > nextStart;
  const daysLate = isLate
    ? Math.max(1, Math.floor((today.getTime() - nextStart.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  // Phase calculation
  let phase: CyclePrediction['phase'] = 'follicular';
  let phaseDescription = 'Estrogen begins rising, boosting focus and renewal.';

  if (isLate) {
    phase = 'late';
    phaseDescription = `Your period is approximately ${daysLate} ${daysLate === 1 ? 'day' : 'days'} later than predicted. Don't worry — our bodies frequently shift. Tap for step-by-step calming guidance.`;
  } else if (currentCycleDay <= defaultPeriodDuration) {
    phase = 'menstrual';
    phaseDescription = 'Your body is resting and releasing. Prioritize gentle movement and warmth.';
  } else if (today >= fertileStart && today <= fertileEnd) {
    phase = 'ovulatory';
    phaseDescription = 'Peak energy, peak fertility window, and heightened vitality.';
  } else if (today > fertileEnd && today < nextStart) {
    phase = 'luteal';
    phaseDescription = 'Progesterone peaks. A natural time for nesting, listening to cravings, and soothing self-care.';
  }

  return {
    lastPeriodStart: lastStart,
    nextPeriodStart: nextStart,
    nextPeriodEnd: nextEnd,
    ovulationDate: ovulation,
    fertileWindowStart: fertileStart,
    fertileWindowEnd: fertileEnd,
    currentCycleDay,
    phase,
    phaseDescription,
    isLate,
    daysLate,
  };
}

export function evaluateBloodPressure(
  systolic?: number,
  diastolic?: number
): VitalRecord['alert'] | undefined {
  if (!systolic || !diastolic) return undefined;

  if (systolic >= 180 || diastolic >= 120) {
    return {
      level: 'urgent',
      title: 'Urgent Care Nudge: Very High BP Reading',
      message: 'This reading is significantly above standard levels. Please sit quietly for 5 minutes and re-test. If it remains at or above 180/120, contact an on-call physician or emergency care promptly.',
    };
  }

  if (systolic >= 140 || diastolic >= 90) {
    return {
      level: 'high',
      title: 'Notice: High Range Blood Pressure',
      message: 'Your numbers are in the Stage 2 range. If you often see readings like this, writing them down to review with your doctor is a great next step.',
    };
  }

  if (systolic >= 130 || diastolic >= 80) {
    return {
      level: 'elevated',
      title: 'Gentle Notice: Slightly Elevated BP',
      message: 'A bit higher than your baseline. Stress, caffeine, or rushing can cause momentary spikes. Try hydrating and taking 3 gentle breaths.',
    };
  }

  return undefined;
}

export function celsiusToFahrenheit(c: number): number {
  return Math.round(((c * 9) / 5 + 32) * 10) / 10;
}

export function fahrenheitToCelsius(f: number): number {
  return Math.round((((f - 32) * 5) / 9) * 10) / 10;
}

export function mgDlToMmol(mgDl: number): number {
  return Math.round((mgDl / 18.0182) * 10) / 10;
}

export function mmolToMgDl(mmol: number): number {
  return Math.round(mmol * 18.0182);
}

export function evaluateBloodGlucose(
  glucose?: number,
  unit: 'mg/dL' | 'mmol/L' = 'mg/dL',
  context: 'fasting' | 'before_meal' | 'after_meal' | 'bedtime' | 'random' = 'fasting'
): VitalRecord['alert'] | undefined {
  if (!glucose) return undefined;

  const mgDl = unit === 'mmol/L' ? mmolToMgDl(glucose) : glucose;

  if (mgDl < 54) {
    return {
      level: 'urgent',
      title: '🚨 Critical Low Blood Sugar (<54 mg/dL)',
      message:
        'Severe hypoglycemia detected. Use the Rule of 15 immediately: consume 15 grams of fast-acting carbohydrate (e.g. 1/2 cup fruit juice, 3-4 glucose tablets, or 1 tbsp honey), rest, and recheck in 15 minutes. If symptoms persist or worsen, seek urgent medical help.',
    };
  }

  if (mgDl < 70) {
    return {
      level: 'high',
      title: 'Warning: Low Blood Sugar (<70 mg/dL)',
      message:
        'Your blood glucose is low (hypoglycemia). Eat a healthy snack with quick carbohydrates and protein (e.g. apple slices with peanut butter or a glass of milk), and sit comfortably.',
    };
  }

  if (mgDl >= 250) {
    return {
      level: 'urgent',
      title: 'Urgent Alert: High Blood Glucose (≥250 mg/dL)',
      message:
        'Significantly elevated blood sugar. Drink plenty of water to prevent dehydration, avoid simple sugars, and check for ketones if you have Type 1 or insulin-dependent diabetes. Contact your endocrinologist or physician if readings stay high.',
    };
  }

  if (context === 'fasting' || context === 'before_meal') {
    if (mgDl >= 126) {
      return {
        level: 'high',
        title: 'High Fasting Glucose (≥126 mg/dL)',
        message:
          'Fasting reading is elevated. Repeated morning readings above 126 mg/dL (7.0 mmol/L) should be discussed with your physician for diabetic or insulin resistance management.',
      };
    }
    if (mgDl >= 100) {
      return {
        level: 'elevated',
        title: 'Elevated Fasting Glucose (100–125 mg/dL)',
        message:
          'Your fasting glucose is slightly above optimal baseline (pre-diabetes range). Wholesome fiber-rich breakfast, gentle walking, and staying hydrated support metabolic balance.',
      };
    }
  } else if (context === 'after_meal') {
    if (mgDl >= 200) {
      return {
        level: 'high',
        title: 'High Post-Meal Glucose (≥200 mg/dL)',
        message:
          'Blood sugar remains high 2 hours after food. Note down what you ate and consider discussing dietary composition or medication timing with your healthcare team.',
      };
    }
    if (mgDl >= 140) {
      return {
        level: 'elevated',
        title: 'Mildly Elevated Post-Meal Glucose (140–199 mg/dL)',
        message:
          'Slightly higher post-prandial spike. A gentle 10-minute walk after meals can help muscles absorb circulating glucose naturally.',
      };
    }
  }

  return undefined;
}

export function evaluatePulse(pulse?: number): VitalRecord['alert'] | undefined {
  if (!pulse) return undefined;
  if (pulse >= 120) {
    return {
      level: 'urgent',
      title: 'Elevated Resting Pulse (>120 bpm)',
      message:
        'Resting heart rate is significantly fast. Rest quietly for a few minutes, sip water, and practice slow diaphragmatic breathing. If accompanied by chest tightness or dizziness, seek medical review.',
    };
  }
  if (pulse >= 100) {
    return {
      level: 'elevated',
      title: 'High Resting Heart Rate (100–120 bpm)',
      message:
        'Your pulse is elevated. Stress, fever, hormonal fluctuations (e.g. ovulation/luteal phase or thyroid shifts), dehydration, or caffeine can elevate pulse. Rest and breathe deeply.',
    };
  }
  if (pulse < 50) {
    return {
      level: 'elevated',
      title: 'Low Pulse (<50 bpm)',
      message:
        'Low resting heart rate (bradycardia). Unless you are a high-endurance athlete, keep an eye on symptoms like lightheadedness or fatigue and mention it to your doctor.',
    };
  }
  return undefined;
}

export function evaluateTemperature(
  tempCelsius: number | undefined,
  isCancerPatient: boolean = false
): VitalAlert | undefined {
  if (!tempCelsius) return undefined;

  // Crucial clinical safety check for cancer patients undergoing chemo/radiation
  if (isCancerPatient && tempCelsius >= 38.0) {
    return {
      level: 'urgent',
      title: '🚨 Urgent Oncology Alert: Neutropenic Fever Risk',
      message:
        'A temperature of 38.0°C (100.4°F) or higher during or following cancer treatment is a critical medical event that requires immediate oncology contact or emergency department evaluation to prevent systemic infection.',
    };
  }

  if (tempCelsius >= 39.5) {
    return {
      level: 'urgent',
      title: 'Urgent Care Notice: High Fever (>103°F)',
      message:
        'Your temperature is significantly high. Stay hydrated, apply a cool cloth, and seek prompt medical advice if it remains high or is accompanied by stiff neck or shortness of breath.',
    };
  }

  if (tempCelsius >= 38.0) {
    return {
      level: 'high',
      title: 'Notice: Fever Detected',
      message:
        'A fever indicates your immune system is responding. Drink plenty of fluids, rest comfortably, and reach out to your doctor if symptoms persist over 48 hours.',
    };
  }

  if (tempCelsius >= 37.3) {
    return {
      level: 'elevated',
      title: 'Gentle Notice: Low-Grade Warmth',
      message:
        'Slightly elevated. This can happen around ovulation (luteal phase shift), dehydration, or mild inflammation. Sip water and re-check later.',
    };
  }

  if (tempCelsius < 35.0) {
    return {
      level: 'urgent',
      title: 'Urgent Notice: Hypothermia Range',
      message:
        'Your body temperature is abnormally low. Warm yourself with blankets, sip warm broth or tea, and consult medical help if your temperature remains below 35°C (95°F).',
    };
  }

  return undefined;
}
