import React, { useState } from 'react';
import { X, Scale, HeartPulse, Droplets, Check, AlertCircle, Thermometer, Droplet } from 'lucide-react';
import { UserProfile, VitalRecord, CycleRecord, MoodType } from '../types';
import {
  evaluateBloodPressure,
  evaluateTemperature,
  evaluateBloodGlucose,
  fahrenheitToCelsius,
  mmolToMgDl,
} from '../utils/healthCalculators';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSaveVital: (vital: VitalRecord) => void;
  onSaveCycle: (cycle: CycleRecord) => void;
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveVital,
  onSaveCycle,
}) => {
  const [tab, setTab] = useState<'vitals' | 'period'>('vitals');

  // Vitals form state
  const [weight, setWeight] = useState<string>('');
  const [systolic, setSystolic] = useState<string>('');
  const [diastolic, setDiastolic] = useState<string>('');
  const [pulse, setPulse] = useState<string>('');
  const [temperature, setTemperature] = useState<string>('');
  const [temperatureMethod, setTemperatureMethod] = useState<'forehead' | 'oral' | 'axillary'>('forehead');
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>(user.temperatureUnit || 'C');
  const [bloodGlucose, setBloodGlucose] = useState<string>('');
  const [glucoseUnit, setGlucoseUnit] = useState<'mg/dL' | 'mmol/L'>(user.glucoseUnit || 'mg/dL');
  const [glucoseContext, setGlucoseContext] = useState<'fasting' | 'before_meal' | 'after_meal' | 'bedtime' | 'random'>('fasting');
  const [vitalNotes, setVitalNotes] = useState<string>('');

  // Period form state
  const [periodStartDate, setPeriodStartDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [periodDurationDays, setPeriodDurationDays] = useState<number>(user.periodDuration || 5);
  const [flow, setFlow] = useState<CycleRecord['flow']>('medium');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [periodMood, setPeriodMood] = useState<MoodType>('calm');

  const SYMPTOM_OPTIONS = [
    'Mild cramps',
    'Severe cramps',
    'Bloating',
    'Headache',
    'Fatigue',
    'Mood swings',
    'Breast tenderness',
    'Backache',
    'Cravings',
    'Acne',
  ];

  if (!isOpen) return null;

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const wNum = weight ? parseFloat(weight) : undefined;
    const sysNum = systolic ? parseInt(systolic, 10) : undefined;
    const diaNum = diastolic ? parseInt(diastolic, 10) : undefined;
    const pulseNum = pulse ? parseInt(pulse, 10) : undefined;

    const isCancerPatient =
      user.conditions.some((c) => c.toLowerCase().includes('cancer')) ||
      Boolean(user.cancerSpecifics?.hasCancerHistory);

    let tempCelsius: number | undefined = undefined;
    if (temperature) {
      const parsedTemp = parseFloat(temperature);
      if (!isNaN(parsedTemp)) {
        tempCelsius = tempUnit === 'F' ? fahrenheitToCelsius(parsedTemp) : parsedTemp;
      }
    }

    const glucoseNum = bloodGlucose ? parseFloat(bloodGlucose) : undefined;

    if (!wNum && !sysNum && !diaNum && tempCelsius === undefined && glucoseNum === undefined && !pulseNum) {
      alert('Please enter at least one reading (BP, pulse, temperature, glucose, or weight).');
      return;
    }

    const bpAlert = evaluateBloodPressure(sysNum, diaNum);
    const tempAlert = tempCelsius !== undefined ? evaluateTemperature(tempCelsius, isCancerPatient) : null;
    const glucoseAlert = glucoseNum !== undefined ? evaluateBloodGlucose(glucoseNum, glucoseUnit, glucoseContext) : null;
    
    // Prefer urgent alert if any triggers it
    const activeAlert =
      (glucoseAlert?.level === 'urgent' ? glucoseAlert : null) ||
      (tempAlert?.level === 'urgent' ? tempAlert : null) ||
      (bpAlert?.level === 'urgent' ? bpAlert : null) ||
      glucoseAlert ||
      bpAlert ||
      tempAlert ||
      undefined;

    const now = new Date();
    const record: VitalRecord = {
      id: 'vital_' + Date.now(),
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      weight: wNum,
      systolic: sysNum,
      diastolic: diaNum,
      pulse: pulseNum,
      temperature: tempCelsius,
      temperatureMethod: tempCelsius !== undefined ? temperatureMethod : undefined,
      bloodGlucose: glucoseNum,
      bloodGlucoseUnit: glucoseNum !== undefined ? glucoseUnit : undefined,
      bloodGlucoseContext: glucoseNum !== undefined ? glucoseContext : undefined,
      notes: vitalNotes.trim() || undefined,
      alert: activeAlert,
    };

    onSaveVital(record);
    onClose();
  };

  const handleSavePeriod = (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(periodStartDate + 'T00:00:00');
    const end = new Date(start);
    end.setDate(end.getDate() + periodDurationDays);

    const newCycle: CycleRecord = {
      id: 'cycle_' + Date.now(),
      startDate: periodStartDate,
      endDate: end.toISOString().split('T')[0],
      flow,
      symptoms: selectedSymptoms,
      mood: periodMood,
    };

    onSaveCycle(newCycle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF7F5] w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-rose-100 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-rose-100/60 bg-white/70">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-800">Quick Health Log</h3>
            <p className="text-xs text-stone-500">Fast, private, and judgment-free</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-800 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-3 pb-1 bg-white/40">
          <div className="grid grid-cols-2 p-1 bg-stone-100/80 rounded-xl">
            <button
              onClick={() => setTab('vitals')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                tab === 'vitals'
                  ? 'bg-white text-stone-800 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <HeartPulse className="w-4 h-4 text-rose-500" />
              Weight & BP
            </button>
            <button
              onClick={() => setTab('period')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                tab === 'period'
                  ? 'bg-white text-stone-800 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Droplets className="w-4 h-4 text-rose-400" />
              Period & Cycle
            </button>
          </div>
        </div>

        {/* Tab content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {tab === 'vitals' ? (
            <form onSubmit={handleSaveVitals} className="space-y-4">
              {/* Weight */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Weight ({user.weightUnit})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    placeholder={`e.g. ${user.weightUnit === 'kg' ? '64.5' : '142'}`}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm"
                  />
                  <Scale className="absolute right-3 top-2.5 w-4 h-4 text-stone-400" />
                </div>
              </div>

              {/* Blood Pressure */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Blood Pressure (Systolic / Diastolic mmHg)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Systolic (e.g. 118)"
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Diastolic (e.g. 78)"
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm"
                  />
                </div>
              </div>

              {/* Pulse */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Resting Heart Rate / Pulse (bpm)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 72"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm"
                />
              </div>

              {/* Temperature */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-stone-700 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                    Body Temperature
                  </label>
                  <div className="flex bg-stone-200/80 p-0.5 rounded-lg text-[10px]">
                    <button
                      type="button"
                      onClick={() => setTempUnit('C')}
                      className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                        tempUnit === 'C' ? 'bg-white text-stone-800 shadow-xs' : 'text-stone-500'
                      }`}
                    >
                      °C
                    </button>
                    <button
                      type="button"
                      onClick={() => setTempUnit('F')}
                      className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                        tempUnit === 'F' ? 'bg-white text-stone-800 shadow-xs' : 'text-stone-500'
                      }`}
                    >
                      °F
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.1"
                    placeholder={tempUnit === 'C' ? 'e.g. 36.6' : 'e.g. 98.6'}
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm"
                  />
                  <select
                    value={temperatureMethod}
                    onChange={(e) => setTemperatureMethod(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-300 text-xs font-medium"
                  >
                    <option value="forehead">Forehead / Non-Contact</option>
                    <option value="oral">Oral Thermometer</option>
                    <option value="axillary">Underarm (Axillary)</option>
                  </select>
                </div>
                {user.conditions.some((c) => c.toLowerCase().includes('cancer')) && (
                  <span className="text-[10px] text-rose-600 block">
                    🎗️ Oncology Safety: Fever ≥38.0°C (100.4°F) is monitored closely for neutropenic infection.
                  </span>
                )}
              </div>

              {/* Blood Sugar (Glucose) */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-stone-700 flex items-center gap-1">
                    <Droplet className="w-3.5 h-3.5 text-amber-500 fill-amber-300" />
                    Blood Sugar (Glucose)
                  </label>
                  <div className="flex bg-stone-200/80 p-0.5 rounded-lg text-[10px]">
                    <button
                      type="button"
                      onClick={() => setGlucoseUnit('mg/dL')}
                      className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                        glucoseUnit === 'mg/dL' ? 'bg-white text-stone-800 shadow-xs' : 'text-stone-500'
                      }`}
                    >
                      mg/dL
                    </button>
                    <button
                      type="button"
                      onClick={() => setGlucoseUnit('mmol/L')}
                      className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                        glucoseUnit === 'mmol/L' ? 'bg-white text-stone-800 shadow-xs' : 'text-stone-500'
                      }`}
                    >
                      mmol/L
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step={glucoseUnit === 'mmol/L' ? '0.1' : '1'}
                    placeholder={glucoseUnit === 'mg/dL' ? 'e.g. 95' : 'e.g. 5.3'}
                    value={bloodGlucose}
                    onChange={(e) => setBloodGlucose(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300 text-sm"
                  />
                  <select
                    value={glucoseContext}
                    onChange={(e) => setGlucoseContext(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-300 text-xs font-medium"
                  >
                    <option value="fasting">Fasting (Morning)</option>
                    <option value="before_meal">Before Meal</option>
                    <option value="after_meal">2h Post-Meal</option>
                    <option value="bedtime">Bedtime</option>
                    <option value="random">Random Check</option>
                  </select>
                </div>
                <span className="text-[10px] text-stone-500 block">
                  Capillary test-strip or continuous glucose monitor reading.
                </span>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Gentle Notes (Context, sleep, feeling)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Took reading after morning meditation"
                  value={vitalNotes}
                  onChange={(e) => setVitalNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl text-sm shadow-sm transition-all"
              >
                Save Vitals Entry
              </button>
            </form>
          ) : (
            <form onSubmit={handleSavePeriod} className="space-y-4">
              {/* Period Start Date */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Period Start Date
                </label>
                <input
                  type="date"
                  value={periodStartDate}
                  onChange={(e) => setPeriodStartDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm"
                />
              </div>

              {/* Estimated Duration */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Expected Duration (Days)
                </label>
                <input
                  type="number"
                  min="2"
                  max="12"
                  value={periodDurationDays}
                  onChange={(e) => setPeriodDurationDays(parseInt(e.target.value, 10) || 5)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm"
                />
              </div>

              {/* Flow intensity */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Flow Intensity
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['spotting', 'light', 'medium', 'heavy'] as CycleRecord['flow'][]).map(
                    (f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFlow(f)}
                        className={`py-2 text-xs font-medium rounded-xl border capitalize transition-all ${
                          flow === f
                            ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-rose-50'
                        }`}
                      >
                        {f}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Symptoms you are feeling today
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SYMPTOM_OPTIONS.map((sym) => {
                    const isSelected = selectedSymptoms.includes(sym);
                    return (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => toggleSymptom(sym)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-rose-100 text-rose-800 border-rose-300 font-semibold'
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {sym}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl text-sm shadow-sm transition-all"
              >
                Log Period & Update Predictions
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
