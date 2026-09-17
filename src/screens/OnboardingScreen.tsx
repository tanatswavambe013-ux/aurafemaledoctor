import React, { useState } from 'react';
import {
  Heart,
  Sparkles,
  ArrowRight,
  Check,
  ShieldCheck,
  Droplets,
  Activity,
  Ribbon,
  MessageSquareHeart,
  Target,
  FileText,
} from 'lucide-react';
import { UserProfile } from '../types';
import { COMMON_CONDITIONS, REASONS_FOR_USE_OPTIONS } from '../data/defaultData';

interface OnboardingScreenProps {
  onComplete: (user: UserProfile) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);

  // Form states
  const [name, setName] = useState('Maya');
  const [age, setAge] = useState(30);
  const [height, setHeight] = useState(165);
  const [heightUnit, setHeightUnit] = useState<'cm' | 'in'>('cm');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  
  // Reasons & Problems
  const [selectedReasons, setSelectedReasons] = useState<string[]>([
    'Period, Ovulation & Cycle Tracking',
    'Blood Pressure & Temperature Testing',
  ]);
  const [problemDescription, setProblemDescription] = useState('');

  // Medical conditions
  const [selectedConditions, setSelectedConditions] = useState<string[]>([
    'PCOS (Polycystic Ovary Syndrome)',
  ]);
  const [customCondition, setCustomCondition] = useState('');
  const [cancerStage, setCancerStage] = useState('');
  const [cancerTreatment, setCancerTreatment] = useState('chemotherapy');

  const hasCancerCondition = selectedConditions.some((c) =>
    c.toLowerCase().includes('cancer') || c.toLowerCase().includes('oncology')
  );

  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    );
  };

  const toggleCondition = (cond: string) => {
    setSelectedConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  };

  const addCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCondition.trim() && !selectedConditions.includes(customCondition.trim())) {
      setSelectedConditions((prev) => [...prev, customCondition.trim()]);
      setCustomCondition('');
    }
  };

  const handleFinish = () => {
    const newUser: UserProfile = {
      id: 'aura_user_' + Date.now(),
      name: name.trim() || 'Lovely',
      age: Number(age) || 28,
      height: Number(height) || 165,
      heightUnit,
      weightUnit,
      temperatureUnit: 'C',
      conditions: selectedConditions,
      reasonsForUse: selectedReasons,
      primaryConcernsOrProblems: problemDescription.trim() || undefined,
      cancerSpecifics: hasCancerCondition
        ? {
            hasCancerHistory: true,
            cancerType: cancerStage.trim() || 'Breast Cancer',
            phase: cancerTreatment === 'chemotherapy' ? 'in_chemo_radiation' : 'newly_diagnosed',
          }
        : undefined,
      waterTargetGlasses: 8,
      waterConsumedToday: 0,
      lastWaterResetDate: new Date().toISOString().split('T')[0],
      cycleLength: 28,
      periodDuration: 5,
      isRegistered: true,
      createdAt: new Date().toISOString().split('T')[0],
      subscription: {
        status: 'active',
        plan: 'Aura Care Monthly',
        amount: 1.0,
        currency: 'USD',
        paymentMethod: 'card',
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        autoRenew: true,
      },
    };

    onComplete(newUser);
  };

  const totalSteps = 4;

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col justify-between p-5 max-w-md mx-auto animate-fade-in">
      {/* Top Header Indicator */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <Heart className="w-4 h-4 fill-white/20" />
            </div>
            <span className="font-serif text-lg font-bold text-stone-800">
              Aura
            </span>
          </div>
          <span className="text-xs font-semibold text-stone-400">
            Step {step} of {totalSteps}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-stone-200/70 rounded-full overflow-hidden">
          <div
            className="h-full bg-rose-500 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Welcome & Demographics */}
      {step === 1 && (
        <div className="my-auto space-y-5">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Welcome, sister
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-800 leading-tight">
              A gentle health companion designed for women.
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Vitals, period rhythms, breast health awareness, prayer & water reminders, and condition-aware SheDoctor AI guidance — here for you every single day.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-stone-100 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                What should we call you?
              </label>
              <input
                type="text"
                placeholder="e.g. Maya"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Height ({heightUnit})
                </label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-3 rounded-2xl border border-stone-200 text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setHeightUnit(heightUnit === 'cm' ? 'in' : 'cm')}
                    className="px-2.5 py-3 rounded-2xl bg-stone-100 text-stone-600 text-xs font-semibold border border-stone-200"
                  >
                    {heightUnit}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Reasons for Use & Stated Problems */}
      {step === 2 && (
        <div className="my-auto space-y-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1">
              <Target className="w-3.5 h-3.5" />
              Your Focus & Needs
            </span>
            <h2 className="font-serif text-2xl font-bold text-stone-800">
              Why are you looking to use Aura?
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every woman's journey is unique. Select your reasons so Aura can tailor your home screen, daily alarms, and insights.
            </p>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-stone-100 shadow-sm space-y-3.5 max-h-[55vh] overflow-y-auto">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                Select what brings you here today:
              </label>
              <div className="flex flex-wrap gap-2">
                {REASONS_FOR_USE_OPTIONS.map((item) => {
                  const isSelected = selectedReasons.includes(item.label);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleReason(item.label)}
                      className={`px-3 py-2 rounded-2xl text-xs font-medium border text-left transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <span>{item.emoji}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tell us about your main health concerns or symptoms (Optional):
              </label>
              <textarea
                rows={3}
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="e.g. Recently diagnosed with PCOS, irregular periods, managing chemo fatigue, need a calm prayer/water reminder..."
                className="w-full px-3 py-2.5 text-xs rounded-2xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Your words directly inform SheDoctor AI's compassionate tone and personalized daily recommendations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Medical Conditions Selection & Cancer Care */}
      {step === 3 && (
        <div className="my-auto space-y-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Personalized Guidance
            </span>
            <h2 className="font-serif text-2xl font-bold text-stone-800">
              Are you managing any medical conditions?
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              If you have cancer, diabetes, hypertension, or any other condition, Aura adapts to support your specific journey.
            </p>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-stone-100 shadow-sm space-y-3 max-h-[50vh] overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {COMMON_CONDITIONS.map((c) => {
                const isSelected = selectedConditions.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCondition(c)}
                    className={`px-3 py-2 rounded-2xl text-xs font-medium border text-left transition-all ${
                      isSelected
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>

            {/* Custom condition input */}
            <div className="pt-2 border-t border-stone-100">
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                Other condition:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type any condition or symptom..."
                  value={customCondition}
                  onChange={(e) => setCustomCondition(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
                <button
                  type="button"
                  onClick={addCustom}
                  className="px-3 py-2 bg-stone-800 text-white rounded-xl text-xs font-semibold"
                >
                  Add
                </button>
              </div>
            </div>

            {/* If cancer selected: optional clinical details */}
            {hasCancerCondition && (
              <div className="mt-3 p-3.5 bg-rose-50/80 rounded-2xl border border-rose-200 space-y-2.5">
                <div className="flex items-center gap-2 text-rose-900 font-serif font-bold text-xs">
                  <Ribbon className="w-4 h-4 text-rose-600" />
                  <span>Personalized Cancer Care Support</span>
                </div>
                <p className="text-[11px] text-rose-800 leading-relaxed">
                  We will enable our dedicated Cancer Care Dashboard, 38.0°C fever alert safeguards, and oncology symptom tracker for you.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] font-semibold text-rose-800 block mb-0.5">Stage / Type</label>
                    <input
                      type="text"
                      placeholder="e.g. Stage II, Triple Negative"
                      value={cancerStage}
                      onChange={(e) => setCancerStage(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white rounded-xl border border-rose-200 text-xs text-stone-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-rose-800 block mb-0.5">Current Treatment</label>
                    <select
                      value={cancerTreatment}
                      onChange={(e) => setCancerTreatment(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white rounded-xl border border-rose-200 text-xs text-stone-800"
                    >
                      <option value="chemotherapy">Chemotherapy</option>
                      <option value="radiation">Radiation</option>
                      <option value="immunotherapy">Immunotherapy</option>
                      <option value="hormone_therapy">Hormone Therapy</option>
                      <option value="surgery_recovery">Post-Surgery</option>
                      <option value="remission">Remission / Surveillance</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Privacy, SheDoctor Intro & Confirmation */}
      {step === 4 && (
        <div className="my-auto space-y-4">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-3xl bg-rose-500 text-white flex items-center justify-center mx-auto shadow-md">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-800">
              Welcome to Your Safe Space
            </h2>
            <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
              Aura is here to accompany you every step of the way with warmth, precision, and privacy.
            </p>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-stone-100 shadow-sm space-y-3 text-xs text-stone-700">
            <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-rose-50/70 border border-rose-100">
              <MessageSquareHeart className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-stone-800 block">SheDoctor AI Companion</span>
                <span className="text-stone-600 text-[11px]">
                  Condition-aware care, symptom reviews, and appointment prep tailored to you.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-stone-800 block">Encrypted & Never Sold</span>
                <span className="text-stone-600 text-[11px]">
                  Your medical notes, vitals, and prayer logs remain strictly private on your device.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-amber-50/70 border border-amber-100">
              <Activity className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-stone-800 block">Vitals & Cancer Safeguards</span>
                <span className="text-stone-600 text-[11px]">
                  Built-in blood pressure & temperature testers with neutropenic fever alerts.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Button Actions */}
      <div className="pt-4">
        {step < totalSteps ? (
          <button
            onClick={() => setStep(step + 1)}
            className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Enter Aura Companion</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="w-full mt-2 py-2 text-xs text-stone-500 hover:text-stone-800 font-medium"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
};
