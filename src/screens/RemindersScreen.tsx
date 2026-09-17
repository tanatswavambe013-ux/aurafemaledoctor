import React, { useState } from 'react';
import {
  BellRing,
  Plus,
  Pill,
  Droplets,
  Ribbon,
  Activity,
  Calendar,
  Clock,
  Trash2,
  CheckCircle2,
  X,
  Sparkles,
  Heart,
  BookOpen,
} from 'lucide-react';
import { ReminderItem } from '../types';

interface RemindersScreenProps {
  reminders: ReminderItem[];
  onToggleReminder: (id: string) => void;
  onAddReminder: (reminder: ReminderItem) => void;
  onDeleteReminder: (id: string) => void;
}

export const RemindersScreen: React.FC<RemindersScreenProps> = ({
  reminders,
  onToggleReminder,
  onAddReminder,
  onDeleteReminder,
}) => {
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ReminderItem['type']>('medication');
  const [time, setTime] = useState('08:30');
  const [frequency, setFrequency] = useState<ReminderItem['frequency']>('daily');
  const [friendlyMessage, setFriendlyMessage] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [dosageOrDoctor, setDosageOrDoctor] = useState('');
  const [prayerTradition, setPrayerTradition] = useState<ReminderItem['prayerTradition']>('interfaith');

  const typeConfig: Record<
    ReminderItem['type'],
    { label: string; icon: any; color: string; defaultCopy: string }
  > = {
    water: {
      label: 'Water & Hydration',
      icon: Droplets,
      color: 'bg-sky-100 text-sky-700',
      defaultCopy: 'A cool, revitalizing glass of water to nourish your body, cells, and hormones, lovely.',
    },
    prayer: {
      label: 'Prayer & Spiritual Reflection',
      icon: Heart,
      color: 'bg-purple-100 text-purple-700',
      defaultCopy: 'A quiet, sacred moment to breathe, pray, and lay down any burdens you carry.',
    },
    medication: {
      label: 'Medication / Supplement',
      icon: Pill,
      color: 'bg-rose-100 text-rose-700',
      defaultCopy: 'Gentle reminder for your nourishment and meds, lovely.',
    },
    period: {
      label: 'Period & Ovulation',
      icon: Droplets,
      color: 'bg-pink-100 text-pink-700',
      defaultCopy: 'Your predicted cycle window is approaching. Treat yourself kindly today.',
    },
    self_exam: {
      label: 'Monthly Self-Exam',
      icon: Ribbon,
      color: 'bg-rose-100 text-rose-800',
      defaultCopy: 'Just 5 mindful minutes to check in with your breast health today.',
    },
    vitals: {
      label: 'Vitals (BP, Temp & Weight)',
      icon: Activity,
      color: 'bg-amber-100 text-amber-700',
      defaultCopy: 'A calm moment to log your numbers so we can keep an eye on your baseline.',
    },
    appointment: {
      label: 'Doctor / Screening Visit',
      icon: Calendar,
      color: 'bg-indigo-100 text-indigo-700',
      defaultCopy: 'Upcoming appointment — remember to write down your questions beforehand!',
    },
    custom: {
      label: 'Custom Gentle Nudge',
      icon: Sparkles,
      color: 'bg-stone-100 text-stone-700',
      defaultCopy: 'Taking a soft breath and honoring your body today.',
    },
  };

  const handleTypeChange = (newType: ReminderItem['type']) => {
    setType(newType);
    if (!friendlyMessage || friendlyMessage === typeConfig[type].defaultCopy) {
      setFriendlyMessage(typeConfig[newType].defaultCopy);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please provide a name for this reminder.');
      return;
    }

    const newReminder: ReminderItem = {
      id: 'rem_' + Date.now(),
      title: title.trim(),
      type,
      time,
      frequency,
      enabled: true,
      friendlyMessage: friendlyMessage.trim() || typeConfig[type].defaultCopy,
      targetDate: frequency === 'one_time' ? targetDate : undefined,
      dosageOrDoctor: dosageOrDoctor.trim() || undefined,
      prayerTradition: type === 'prayer' ? prayerTradition : undefined,
    };

    onAddReminder(newReminder);
    setIsAdding(false);
    setTitle('');
    setFriendlyMessage('');
    setDosageOrDoctor('');
  };

  const applyPreset = (presetType: ReminderItem['type'], presetTitle: string, presetTime: string, presetCopy?: string) => {
    setType(presetType);
    setTitle(presetTitle);
    setTime(presetTime);
    setFrequency('daily');
    setFriendlyMessage(presetCopy || typeConfig[presetType].defaultCopy);
    setIsAdding(true);
  };

  return (
    <div className="space-y-5 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold text-stone-800">
            Gentle Reminders & Alarms
          </h2>
          <p className="text-xs text-stone-500">
            Loving nudges that sound like a friend, not a clinical alarm.
          </p>
        </div>
        <button
          onClick={() => {
            setIsAdding(true);
            setFriendlyMessage(typeConfig[type].defaultCopy);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Alarm</span>
        </button>
      </div>

      {/* Add Reminder Modal / Accordion */}
      {isAdding && (
        <div className="bg-white rounded-3xl p-5 shadow-md border border-rose-200 animate-fade-in space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
            <h3 className="font-serif font-bold text-stone-800 text-sm">
              Create New Caring Reminder
            </h3>
            <button
              onClick={() => setIsAdding(false)}
              className="text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-3.5">
            {/* Type selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Category
              </label>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                {(Object.keys(typeConfig) as ReminderItem['type'][]).map((t) => {
                  const Icon = typeConfig[t].icon;
                  const isSelected = type === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleTypeChange(t)}
                      className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                        isSelected
                          ? 'bg-rose-50 border-rose-400 text-rose-800 font-semibold'
                          : 'bg-stone-50/60 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{typeConfig[t].label.split('(')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Reminder Name
              </label>
              <input
                type="text"
                placeholder="e.g. Thyroid Medication, Blood Pressure Log, Mammogram"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>

            {/* Time and Frequency */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="one_time">One-time appointment</option>
                </select>
              </div>
            </div>

            {/* If one time, date */}
            {frequency === 'one_time' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Appointment Date
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>
            )}

            {/* If Prayer, select tradition */}
            {type === 'prayer' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Prayer Tradition or Focus
                </label>
                <select
                  value={prayerTradition}
                  onChange={(e) => setPrayerTradition(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
                >
                  <option value="interfaith">Interfaith / General Spiritual Peace & Healing</option>
                  <option value="christian">Christian Prayer & Scripture</option>
                  <option value="islamic">Islamic (Salah / Du'a)</option>
                  <option value="jewish">Jewish (Refuat HaNefesh / Tehillim)</option>
                  <option value="hindu">Hindu (Shanti / Mantra Meditation)</option>
                </select>
              </div>
            )}

            {/* Dosage or Doctor info */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Dosage or Doctor Details (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 50mcg with full glass of water, or Dr. Sarah at Metro Clinic"
                value={dosageOrDoctor}
                onChange={(e) => setDosageOrDoctor(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>

            {/* Friendly Notification Copy */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Caring Notification Copy
              </label>
              <textarea
                rows={2}
                value={friendlyMessage}
                onChange={(e) => setFriendlyMessage(e.target.value)}
                placeholder="Write a warm note to yourself..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl text-xs shadow-sm transition-all"
              >
                Save Reminder
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 font-semibold rounded-xl text-xs transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Quick Presets Bar */}
      <div className="bg-rose-50/60 border border-rose-100/90 rounded-2xl p-3.5 space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-wider text-rose-800 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-rose-600" />
          Quick One-Tap Reminders for Women:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            type="button"
            onClick={() =>
              applyPreset(
                'water',
                'Hydration & Hormone Balance',
                '11:00',
                'A refreshing glass of water to hydrate your cells, soothe cramps, and boost energy.'
              )
            }
            className="px-3 py-1.5 bg-white hover:bg-sky-50 text-sky-800 font-semibold rounded-xl border border-sky-200 shadow-xs flex items-center gap-1.5 whitespace-nowrap transition-colors"
          >
            <Droplets className="w-3.5 h-3.5 text-sky-500" />
            <span>+ Water Reminder</span>
          </button>

          <button
            type="button"
            onClick={() =>
              applyPreset(
                'prayer',
                'Midday Prayer & Peace Pause',
                '12:30',
                'Take 2 quiet minutes to breathe, pray, and lay down any burdens you carry.'
              )
            }
            className="px-3 py-1.5 bg-white hover:bg-purple-50 text-purple-800 font-semibold rounded-xl border border-purple-200 shadow-xs flex items-center gap-1.5 whitespace-nowrap transition-colors"
          >
            <Heart className="w-3.5 h-3.5 text-purple-500" />
            <span>+ Prayer & Reflection</span>
          </button>

          <button
            type="button"
            onClick={() =>
              applyPreset(
                'vitals',
                'Gentle BP & Temp Check',
                '09:00',
                'A quiet moment to test and log your blood pressure and temperature.'
              )
            }
            className="px-3 py-1.5 bg-white hover:bg-amber-50 text-amber-800 font-semibold rounded-xl border border-amber-200 shadow-xs flex items-center gap-1.5 whitespace-nowrap transition-colors"
          >
            <Activity className="w-3.5 h-3.5 text-amber-500" />
            <span>+ Vitals Test</span>
          </button>

          <button
            type="button"
            onClick={() =>
              applyPreset(
                'self_exam',
                'Monthly Breast Self-Exam',
                '10:00',
                'Just 5 mindful minutes to check in with your breast health and know your normal.'
              )
            }
            className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-800 font-semibold rounded-xl border border-rose-200 shadow-xs flex items-center gap-1.5 whitespace-nowrap transition-colors"
          >
            <Ribbon className="w-3.5 h-3.5 text-rose-500" />
            <span>+ Breast Exam</span>
          </button>
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {reminders.map((rem) => {
          const cfg = typeConfig[rem.type] || typeConfig.custom;
          const Icon = cfg.icon;

          return (
            <div
              key={rem.id}
              className={`p-4 rounded-3xl bg-white border transition-all flex items-start justify-between shadow-xs ${
                rem.enabled
                  ? 'border-stone-100'
                  : 'border-stone-100 opacity-60 bg-stone-50/50'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-stone-800 text-sm">
                      {rem.title}
                    </h4>
                    <span className="text-[10px] uppercase font-semibold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md">
                      {rem.frequency}
                    </span>
                  </div>

                  <p className="text-xs text-rose-900 font-medium italic">
                    "{rem.friendlyMessage}"
                  </p>

                  {rem.dosageOrDoctor && (
                    <p className="text-[11px] text-stone-500 font-medium">
                      📌 {rem.dosageOrDoctor}
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-xs font-mono font-semibold text-stone-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      {rem.time}
                    </span>
                    {rem.targetDate && (
                      <span className="text-xs text-stone-500 font-medium">
                        • {rem.targetDate}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                <button
                  onClick={() => onToggleReminder(rem.id)}
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                    rem.enabled ? 'bg-rose-500' : 'bg-stone-300'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow-xs transition-transform transform ${
                      rem.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>

                <button
                  onClick={() => onDeleteReminder(rem.id)}
                  className="p-1.5 text-stone-300 hover:text-rose-600 transition-colors"
                  title="Delete reminder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
