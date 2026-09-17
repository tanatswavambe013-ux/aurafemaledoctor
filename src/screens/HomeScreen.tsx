import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
  Droplets,
  Activity,
  Calendar,
  Ribbon,
  BellRing,
  CheckCircle2,
  ChevronRight,
  Smile,
  Frown,
  Meh,
  Sun,
  ShieldCheck,
  PlusCircle,
  MessageSquareHeart,
  HelpCircle,
  Camera,
  Droplet,
  HeartPulse,
} from 'lucide-react';
import { UserProfile, VitalRecord, CycleRecord, ReminderItem, MoodType } from '../types';
import { calculateCyclePredictions } from '../utils/healthCalculators';
import { CancerCareCard } from '../components/CancerCareCard';
import { WaterAndPrayerWidget } from '../components/WaterAndPrayerWidget';
import { LatePeriodAlertCard } from '../components/LatePeriodAlertCard';

interface HomeScreenProps {
  user: UserProfile;
  vitals: VitalRecord[];
  cycles: CycleRecord[];
  reminders: ReminderItem[];
  currentMood: string;
  onSelectMood: (mood: string) => void;
  onOpenQuickLog: () => void;
  onNavigate: (screen: string) => void;
  onToggleReminder: (id: string) => void;
  onUpdateUser: (user: UserProfile) => void;
  onAddReminder: (reminder: ReminderItem) => void;
  onOpenPulseScanner?: () => void;
  onOpenGlucoseModal?: () => void;
  onOpenTester?: (mode: 'bp' | 'temp') => void;
  onOpenLatePeriodGuide?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  vitals,
  cycles,
  reminders,
  currentMood,
  onSelectMood,
  onOpenQuickLog,
  onNavigate,
  onToggleReminder,
  onUpdateUser,
  onAddReminder,
  onOpenPulseScanner,
  onOpenGlucoseModal,
  onOpenTester,
  onOpenLatePeriodGuide,
}) => {
  const predictions = calculateCyclePredictions(cycles, user.cycleLength, user.periodDuration);
  const [affirmation, setAffirmation] = useState<string>(
    'Your body is carrying you with quiet grace. Listen gently, rest without guilt, and know you are never alone.'
  );
  const [isGeneratingAffirmation, setIsGeneratingAffirmation] = useState(false);

  // Latest vital
  const latestVital = vitals[vitals.length - 1];

  // Fetch or regenerate affirmation
  const fetchTailoredAffirmation = async () => {
    setIsGeneratingAffirmation(true);
    try {
      const res = await fetch('/api/affirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile: user, mood: currentMood }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.affirmation) setAffirmation(data.affirmation);
      }
    } catch (e) {
      console.warn('Could not fetch affirmation:', e);
    } finally {
      setIsGeneratingAffirmation(false);
    }
  };

  const moods: { id: MoodType; label: string; emoji: string }[] = [
    { id: 'peaceful', label: 'Peaceful', emoji: '🌿' },
    { id: 'hopeful', label: 'Hopeful', emoji: '🌸' },
    { id: 'sensitive', label: 'Sensitive', emoji: '☁️' },
    { id: 'tired', label: 'Tired', emoji: '🌙' },
    { id: 'anxious', label: 'Anxious', emoji: '🌊' },
    { id: 'in_pain', label: 'In Pain', emoji: '🩹' },
    { id: 'empowered', label: 'Strong', emoji: '✨' },
  ];

  const formatDate = (d: Date | null) => {
    if (!d) return '—';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-5 pb-24 animate-fade-in">
      {/* Daily Affirmation Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-100/90 via-rose-50 to-stone-100 p-5 shadow-sm border border-rose-200/60">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-rose-700 font-semibold text-xs tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Today's Caring Thought</span>
          </div>
          <button
            onClick={fetchTailoredAffirmation}
            disabled={isGeneratingAffirmation}
            className="text-[11px] text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1 transition-opacity disabled:opacity-50"
            title="Refresh tailored affirmation"
          >
            {isGeneratingAffirmation ? 'Refreshing...' : 'New inspiration'}
          </button>
        </div>

        <p className="font-serif text-base sm:text-lg text-stone-800 leading-relaxed italic">
          "{affirmation}"
        </p>

        {user.conditions.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-rose-200/40 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-stone-500 font-medium">Framed for:</span>
            {user.conditions.map((c) => (
              <span
                key={c}
                className="text-[11px] bg-white/80 text-rose-800 font-medium px-2 py-0.5 rounded-full border border-rose-200/80"
              >
                {c.split('(')[0].trim()}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Mood Check-in */}
      <section className="bg-white rounded-3xl p-4 shadow-sm border border-stone-100">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-600">
            How does your body feel today?
          </h2>
          <span className="text-[11px] text-rose-600 font-medium">SheDoctor notes this</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {moods.map((m) => {
            const isSelected = currentMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectMood(m.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-rose-500 text-white shadow-sm scale-105'
                    : 'bg-stone-50 text-stone-700 hover:bg-rose-50 border border-stone-200/60'
                }`}
              >
                <span>{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Personalized Cancer Care Card (conditionally rendered for cancer warrior) */}
      {(user.cancerSpecifics?.hasCancerHistory ||
        user.conditions.some((c) => c.toLowerCase().includes('cancer'))) && (
        <CancerCareCard
          user={user}
          onOpenTempTester={() => (onOpenTester ? onOpenTester('temp') : onNavigate('vitals'))}
          onNavigate={onNavigate}
        />
      )}

      {/* Quick Action Clinical & Testing Shortcuts */}
      <section className="grid grid-cols-2 gap-2.5">
        <button
          onClick={onOpenQuickLog}
          className="bg-white p-3.5 rounded-3xl shadow-sm border border-stone-100 hover:border-rose-200 transition-all text-left flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
            <PlusCircle className="w-4 h-4 text-stone-400 group-hover:text-rose-500" />
          </div>
          <div className="mt-2.5">
            <span className="text-xs font-bold text-stone-800 block">Log Vitals</span>
            <span className="text-[11px] text-stone-500">BP, Temp & Weight</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('cycle')}
          className="bg-white p-3.5 rounded-3xl shadow-sm border border-stone-100 hover:border-rose-200 transition-all text-left flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Droplets className="w-4 h-4" />
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-rose-500" />
          </div>
          <div className="mt-2.5">
            <span className="text-xs font-bold text-stone-800 block">Cycle Rhythm</span>
            <span className="text-[11px] text-stone-500">Day {predictions.currentCycleDay} • {predictions.phase}</span>
          </div>
        </button>

        {/* Camera Optical Pulse Scanner Shortcut */}
        <button
          onClick={() => onOpenPulseScanner && onOpenPulseScanner()}
          className="bg-white p-3.5 rounded-3xl shadow-sm border border-rose-100 hover:border-rose-300 transition-all text-left flex flex-col justify-between group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-2xl bg-rose-500 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <Camera className="w-4 h-4" />
            </div>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-xs font-bold text-rose-900 block flex items-center gap-1">
              Pulse Scanner
            </span>
            <span className="text-[10px] text-rose-600/90 font-medium">Camera optical PPG</span>
          </div>
        </button>

        {/* Blood Sugar Quick Log Shortcut */}
        <button
          onClick={() => onOpenGlucoseModal && onOpenGlucoseModal()}
          className="bg-white p-3.5 rounded-3xl shadow-sm border border-amber-100 hover:border-amber-300 transition-all text-left flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Droplet className="w-4 h-4 fill-amber-300" />
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-500" />
          </div>
          <div className="mt-2.5">
            <span className="text-xs font-bold text-stone-800 block">Blood Sugar</span>
            <span className="text-[10px] text-amber-700 font-medium">Glucometer & CGM</span>
          </div>
        </button>
      </section>

      {/* Proactive Late Period Interaction Card (if period is late) */}
      {predictions.isLate && (
        <LatePeriodAlertCard
          daysLate={predictions.daysLate}
          onOpenGuide={onOpenLatePeriodGuide || (() => {})}
        />
      )}

      {/* Cycle & Body Rhythm Status Card */}
      <section className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-rose-500" />
            <h3 className="font-serif font-bold text-stone-800 text-sm">
              Cycle Rhythm & Predictions
            </h3>
          </div>
          <button
            onClick={() => onNavigate('cycle')}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-0.5"
          >
            Calendar
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100/80 mb-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 block">
                Current Phase: {predictions.phase}
              </span>
              <p className="text-xs text-stone-600 mt-0.5">
                {predictions.phaseDescription}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xl font-serif font-bold text-rose-700">
                Day {predictions.currentCycleDay}
              </span>
              <span className="text-[10px] text-stone-500 block">of {user.cycleLength} days</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-stone-50 p-3 rounded-2xl">
            <span className="text-[10px] font-semibold text-stone-500 uppercase block">
              Predicted Next Period
            </span>
            <span className="font-bold text-stone-800 text-sm">
              {formatDate(predictions.nextPeriodStart)}
            </span>
          </div>
          <div className="bg-stone-50 p-3 rounded-2xl">
            <span className="text-[10px] font-semibold text-stone-500 uppercase block">
              Fertile / Ovulation Window
            </span>
            <span className="font-bold text-stone-800 text-sm">
              {formatDate(predictions.fertileWindowStart)} – {formatDate(predictions.fertileWindowEnd)}
            </span>
          </div>
        </div>

        {/* Step-by-Step Late Period Nudge / Reassurance Button */}
        <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-stone-600">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-100" />
            <span>Is your period late or feeling off?</span>
          </div>
          <button
            onClick={onOpenLatePeriodGuide}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline"
          >
            Step-by-step guidance
          </button>
        </div>
      </section>

      {/* Latest Vitals Summary */}
      <section className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-500" />
            <h3 className="font-serif font-bold text-stone-800 text-sm">
              Latest Vitals Snapshot
            </h3>
          </div>
          <button
            onClick={() => onNavigate('vitals')}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-0.5"
          >
            History & Trends
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {latestVital ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-stone-50 rounded-2xl">
              <span className="text-[10px] uppercase font-semibold text-stone-500 block">
                Blood Pressure
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-bold text-stone-800">
                  {latestVital.systolic || '—'}/{latestVital.diastolic || '—'}
                </span>
                <span className="text-[10px] text-stone-500">mmHg</span>
              </div>
              <span className="text-[10px] text-stone-400 block mt-0.5">
                Logged {latestVital.date}
              </span>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl">
              <span className="text-[10px] uppercase font-semibold text-stone-500 block">
                Weight
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-bold text-stone-800">
                  {latestVital.weight || '—'}
                </span>
                <span className="text-[10px] text-stone-500">{user.weightUnit}</span>
              </div>
              <span className="text-[10px] text-stone-400 block mt-0.5">
                Baseline stable
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 bg-stone-50 rounded-2xl">
            <p className="text-xs text-stone-500">No vitals logged yet today.</p>
            <button
              onClick={onOpenQuickLog}
              className="mt-2 text-xs text-rose-600 font-semibold underline"
            >
              Add your first entry
            </button>
          </div>
        )}

        {latestVital?.alert && (
          <div className="mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs">
            <p className="font-semibold">{latestVital.alert.title}</p>
            <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
              {latestVital.alert.message}
            </p>
          </div>
        )}
      </section>

      {/* Breast Cancer Awareness Hub Spotlight */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 to-pink-500 text-white p-5 shadow-sm">
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 text-rose-100 text-xs font-semibold uppercase tracking-wider mb-1">
            <Ribbon className="w-4 h-4" />
            <span>Breast Cancer Awareness</span>
          </div>
          <h3 className="font-serif text-lg font-bold">
            Monthly Self-Exam & Screening Check
          </h3>
          <p className="text-xs text-rose-100 mt-1 max-w-[280px] leading-relaxed">
            Knowing your normal baseline is one of the greatest gifts you can give your future self.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => onNavigate('awareness')}
              className="px-4 py-2 bg-white text-rose-700 font-semibold rounded-xl text-xs shadow-sm hover:bg-rose-50 transition-colors"
            >
              Interactive 6-Step Guide
            </button>
            <button
              onClick={() => onNavigate('awareness')}
              className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl text-xs transition-colors"
            >
              Age Guidelines
            </button>
          </div>
        </div>
      </section>

      {/* SheDoctor Companion Banner */}
      <section
        onClick={() => onNavigate('chat')}
        className="bg-white rounded-3xl p-4 shadow-sm border border-stone-100 hover:border-rose-200 transition-all cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-stone-800 text-rose-200 flex items-center justify-center flex-shrink-0">
            <MessageSquareHeart className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-serif font-bold text-stone-800 text-sm">
                Talk with SheDoctor AI
              </h4>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-1.5 py-0.2 rounded-full border border-emerald-200">
                Online
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Personalized guidance for your conditions & questions.
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-stone-400" />
      </section>

      {/* Daily Water Hydration & Quiet Prayer/Meditation Sanctuary */}
      <WaterAndPrayerWidget
        user={user}
        onUpdateUser={onUpdateUser}
        onAddReminder={onAddReminder}
      />

      {/* Today's Gentle Alarms & Reminders */}
      <section className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BellRing className="w-4 h-4 text-rose-500" />
            <h3 className="font-serif font-bold text-stone-800 text-sm">
              Today's Gentle Nudges
            </h3>
          </div>
          <button
            onClick={() => onNavigate('reminders')}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-0.5"
          >
            All Alarms
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {reminders.slice(0, 3).map((rem) => (
            <div
              key={rem.id}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                rem.enabled
                  ? 'bg-stone-50/80 border-stone-200/70'
                  : 'bg-stone-50/30 border-stone-100 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggleReminder(rem.id)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    rem.enabled
                      ? 'bg-rose-500 text-white'
                      : 'border-2 border-stone-300 text-transparent'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <div>
                  <p className="text-xs font-semibold text-stone-800">{rem.title}</p>
                  <p className="text-[11px] text-stone-500 italic">"{rem.friendlyMessage}"</p>
                </div>
              </div>
              <span className="text-xs font-mono font-medium text-stone-500 pl-2">
                {rem.time}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
