import React, { useState } from 'react';
import {
  Droplet,
  X,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Clock,
  Sparkles,
  Info,
  Apple,
} from 'lucide-react';
import { VitalRecord, UserProfile } from '../types';
import {
  evaluateBloodGlucose,
  mgDlToMmol,
  mmolToMgDl,
} from '../utils/healthCalculators';

interface BloodGlucoseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveGlucose: (vital: Partial<VitalRecord>) => void;
  user: UserProfile;
}

export const BloodGlucoseModal: React.FC<BloodGlucoseModalProps> = ({
  isOpen,
  onClose,
  onSaveGlucose,
  user,
}) => {
  const [unit, setUnit] = useState<'mg/dL' | 'mmol/L'>(
    user.glucoseUnit || 'mg/dL'
  );
  const [context, setContext] = useState<
    'fasting' | 'before_meal' | 'after_meal' | 'bedtime' | 'random'
  >('fasting');
  const [glucoseInput, setGlucoseInput] = useState<string>('95');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [showTechniqueGuide, setShowTechniqueGuide] = useState(false);

  if (!isOpen) return null;

  const numericValue = parseFloat(glucoseInput) || 0;
  const alert = evaluateBloodGlucose(numericValue, unit, context);

  // Normalize to mg/dL for display ranges
  const mgDlValue = unit === 'mmol/L' ? mmolToMgDl(numericValue) : numericValue;

  const handleUnitToggle = (newUnit: 'mg/dL' | 'mmol/L') => {
    if (newUnit === unit) return;
    if (newUnit === 'mmol/L') {
      const converted = mgDlToMmol(numericValue);
      setGlucoseInput(converted ? converted.toString() : '');
    } else {
      const converted = mmolToMgDl(numericValue);
      setGlucoseInput(converted ? converted.toString() : '');
    }
    setUnit(newUnit);
  };

  const toggleSymptom = (sym: string) => {
    setSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numericValue || numericValue <= 0) {
      alert && window.alert('Please enter a valid blood sugar reading.');
      return;
    }

    const now = new Date();
    const evaluatedAlert = evaluateBloodGlucose(numericValue, unit, context);

    const symptomText = symptoms.length > 0 ? ` [Symptoms: ${symptoms.join(', ')}]` : '';
    const fullNotes = `${context.replace('_', ' ')} reading${symptomText}${notes ? ` - ${notes}` : ''}`;

    onSaveGlucose({
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      bloodGlucose: numericValue,
      bloodGlucoseUnit: unit,
      bloodGlucoseContext: context,
      notes: fullNotes,
      alert: evaluatedAlert,
    });

    onClose();
  };

  const commonSymptoms = [
    'Shaky / Trembling',
    'Dizziness',
    'Excessive Thirst',
    'Fatigue / Brain Fog',
    'Frequent Urination',
    'Feeling Great',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-xl border border-stone-100 max-h-[92vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Droplet className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-stone-800 text-base leading-tight">
                Blood Sugar (Glucose) Log
              </h2>
              <span className="text-[11px] text-stone-500">
                Capillary Glucometer & CGM Monitor
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Timing / Context selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Testing Context
            </label>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {[
                { id: 'fasting', label: 'Fasting (Morning)' },
                { id: 'before_meal', label: 'Before Meal' },
                { id: 'after_meal', label: '2h After Meal' },
                { id: 'bedtime', label: 'Bedtime' },
                { id: 'random', label: 'Random Check' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setContext(item.id as any)}
                  className={`py-2 px-2 rounded-xl text-center font-medium border transition-all ${
                    context === item.id
                      ? 'bg-amber-500 text-white border-amber-500 font-semibold shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <span className="truncate block text-[11px]">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Value & Unit input */}
          <div className="bg-stone-50/80 p-4 rounded-3xl border border-stone-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-700">
                Blood Glucose Reading
              </label>
              <div className="flex bg-stone-200/80 p-0.5 rounded-lg text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => handleUnitToggle('mg/dL')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    unit === 'mg/dL'
                      ? 'bg-white text-stone-800 shadow-xs'
                      : 'text-stone-500'
                  }`}
                >
                  mg/dL
                </button>
                <button
                  type="button"
                  onClick={() => handleUnitToggle('mmol/L')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    unit === 'mmol/L'
                      ? 'bg-white text-stone-800 shadow-xs'
                      : 'text-stone-500'
                  }`}
                >
                  mmol/L
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                step={unit === 'mmol/L' ? '0.1' : '1'}
                value={glucoseInput}
                onChange={(e) => setGlucoseInput(e.target.value)}
                placeholder={unit === 'mg/dL' ? '95' : '5.3'}
                className="w-full text-3xl font-bold font-mono text-stone-800 bg-white px-4 py-2.5 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              <span className="text-sm font-semibold text-stone-400 flex-shrink-0">
                {unit}
              </span>
            </div>

            {/* Range feedback badge */}
            <div className="pt-1">
              {numericValue > 0 && (
                <div
                  className={`p-2.5 rounded-2xl text-xs flex items-start gap-2 ${
                    mgDlValue < 70
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : (context === 'fasting' && mgDlValue <= 99) ||
                        (context === 'after_meal' && mgDlValue < 140)
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : mgDlValue >= 200
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {mgDlValue < 70 || mgDlValue >= 200 ? (
                    <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block">
                      {mgDlValue < 54
                        ? 'Severe Low (<54 mg/dL)'
                        : mgDlValue < 70
                        ? 'Low Range (Hypoglycemia)'
                        : context === 'fasting'
                        ? mgDlValue <= 99
                          ? 'Optimal Fasting (70–99 mg/dL)'
                          : mgDlValue <= 125
                          ? 'Elevated Fasting (100–125 mg/dL)'
                          : 'High Fasting (≥126 mg/dL)'
                        : mgDlValue < 140
                        ? 'Normal Post-Meal (<140 mg/dL)'
                        : mgDlValue < 200
                        ? 'Elevated Post-Meal (140–199 mg/dL)'
                        : 'High Post-Meal (≥200 mg/dL)'}
                    </span>
                    <span className="text-[11px] opacity-90 block mt-0.5">
                      {alert ? alert.message : 'Within clinical target for your logged context.'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Associated Symptoms */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Any symptoms right now?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {commonSymptoms.map((sym) => {
                const isSelected = symptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => toggleSymptom(sym)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs transition-all ${
                      isSelected
                        ? 'bg-stone-800 text-white font-semibold'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {sym}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Notes (Food eaten, insulin, or medication)
            </label>
            <input
              type="text"
              placeholder="e.g. Oatmeal with chia seeds, or Metformin 500mg taken"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>

          {/* Hypoglycemia Quick Emergency Tip */}
          {mgDlValue < 70 && mgDlValue > 0 && (
            <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Apple className="w-4 h-4 text-rose-600" />
                <span>The Clinical "Rule of 15" for Low Blood Sugar:</span>
              </div>
              <p className="text-[11px] text-rose-800 leading-relaxed">
                Take 15g of fast-acting sugar (4 oz orange juice, 3-4 glucose tablets, or 1 tablespoon honey). Rest for 15 minutes, then recheck your blood sugar.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Droplet className="w-4 h-4 fill-white" />
              <span>Save Glucose Reading</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 font-semibold rounded-2xl text-xs sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Why Glucometer is Required Explainer */}
        <div className="pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={() => setShowTechniqueGuide(!showTechniqueGuide)}
            className="w-full flex items-center justify-between text-[11px] font-semibold text-stone-500 hover:text-stone-800"
          >
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-amber-500" />
              Best practices for accurate glucometer testing
            </span>
            <span className="text-amber-600">{showTechniqueGuide ? 'Hide' : 'View guide'}</span>
          </button>

          {showTechniqueGuide && (
            <div className="mt-2.5 p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-[11px] text-stone-700 space-y-2 leading-relaxed animate-fade-in">
              <p>
                <strong>1. Wash with warm soapy water:</strong> Traces of fruit or lotion on fingers can falsely skyrocket your reading. Dry thoroughly before testing.
              </p>
              <p>
                <strong>2. Lance the side of the fingertip:</strong> Pricking the side rather than the center pad hurts significantly less because there are fewer nerve endings.
              </p>
              <p>
                <strong>3. Why cameras cannot test glucose:</strong> Unlike pulse (which optical cameras can detect via visible blood color pulses), blood sugar requires measuring glucose molecules through enzymatic electrochemistry or interstitial filaments.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
