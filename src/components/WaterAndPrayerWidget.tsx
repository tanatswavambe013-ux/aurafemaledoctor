import React, { useState } from 'react';
import {
  Droplets,
  Heart,
  Plus,
  Minus,
  Sparkles,
  BellRing,
  Sun,
  Moon,
  Clock,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { UserProfile, ReminderItem } from '../types';

interface WaterAndPrayerWidgetProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onAddReminder: (reminder: ReminderItem) => void;
}

export const WaterAndPrayerWidget: React.FC<WaterAndPrayerWidgetProps> = ({
  user,
  onUpdateUser,
  onAddReminder,
}) => {
  const [activeSection, setActiveSection] = useState<'water' | 'prayer'>('water');
  const [selectedTradition, setSelectedTradition] = useState<
    'christian' | 'islamic' | 'jewish' | 'hindu' | 'interfaith'
  >('interfaith');
  const [isMeditating, setIsMeditating] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  // Water intake
  const glassesGoal = user.waterTargetGlasses || 8;
  const glassesDrank = user.waterConsumedToday ?? 5;

  const handleAddGlass = () => {
    const updated = {
      ...user,
      waterConsumedToday: Math.min(16, glassesDrank + 1),
    };
    onUpdateUser(updated);
  };

  const handleSubtractGlass = () => {
    const updated = {
      ...user,
      waterConsumedToday: Math.max(0, glassesDrank - 1),
    };
    onUpdateUser(updated);
  };

  const handleQuickAddWaterReminder = () => {
    const newRem: ReminderItem = {
      id: 'rem_water_' + Date.now(),
      title: 'Gentle Hydration Nudge',
      type: 'water',
      time: '14:00',
      frequency: 'daily',
      enabled: true,
      friendlyMessage: 'Time for a fresh glass of water to soothe and nourish your body, sister.',
    };
    onAddReminder(newRem);
    alert('Water reminder scheduled for 2:00 PM in your Alarms!');
  };

  const handleQuickAddPrayerReminder = (tradition: string) => {
    const newRem: ReminderItem = {
      id: 'rem_prayer_' + Date.now(),
      title: `${tradition} Prayer & Peace Pause`,
      type: 'prayer',
      time: '12:30',
      frequency: 'daily',
      enabled: true,
      friendlyMessage: 'A quiet, sacred moment to breathe, pray, and lay down any burdens you carry.',
      prayerTradition: selectedTradition,
    };
    onAddReminder(newRem);
    alert('Prayer reminder scheduled for 12:30 PM in your Alarms!');
  };

  const prayerAffirmations: Record<string, { title: string; prayer: string; source: string }> = {
    interfaith: {
      title: 'Daily Peace & Healing Prayer',
      prayer:
        'Divine Source of Life, grant my body gentle healing, grant my mind quiet stillness, and wrap my heart in peace. Let every breath restore my strength today.',
      source: 'Spiritual Sisterhood & Healing',
    },
    christian: {
      title: 'Christian Healing & Strength',
      prayer:
        '"Come to me, all you who are weary and burdened, and I will give you rest." Lord, carry my anxieties and grant healing grace to every cell.',
      source: 'Matthew 11:28',
    },
    islamic: {
      title: 'Dua for Health & Tranquility',
      prayer:
        'Allahumma ‘afini fi badani (O Allah, grant health to my body). O Allah, make this day easy, grant me patience, and envelop my home in barakah.',
      source: 'Sunan Abi Dawud',
    },
    jewish: {
      title: 'Refuat HaNefesh (Healing of Soul & Body)',
      prayer:
        'May the Holy One, Blessed be He, be filled with compassion to restore health, to heal, to strengthen and to revive. Send a complete healing from heaven.',
      source: 'Mi Sheberach Prayer for Healing',
    },
    hindu: {
      title: 'Maha Mrityunjaya & Shanti Mantra',
      prayer:
        'Om Shanti Shanti Shanti. May there be peace in my body, peace in my thoughts, and divine balance in all things. Let healing light surround me.',
      source: 'Vedic Peace Blessing',
    },
  };

  // Start 2 minute breath
  const startBreathingPrayer = () => {
    setIsMeditating(true);
    setBreathPhase('inhale');

    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (count % 3 === 1) setBreathPhase('inhale');
      else if (count % 3 === 2) setBreathPhase('hold');
      else setBreathPhase('exhale');

      if (count >= 12) {
        clearInterval(interval);
        setIsMeditating(false);
      }
    }, 4000);
  };

  const currentPrayer = prayerAffirmations[selectedTradition] || prayerAffirmations.interfaith;
  const progressPercent = Math.min(100, Math.round((glassesDrank / glassesGoal) * 100));

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100 space-y-4">
      {/* Widget Header & Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {activeSection === 'water' ? (
            <Droplets className="w-4 h-4 text-sky-500" />
          ) : (
            <Heart className="w-4 h-4 text-rose-500" />
          )}
          <h3 className="font-serif font-bold text-stone-800 text-sm">
            {activeSection === 'water'
              ? 'Daily Water Hydration'
              : 'Prayer & Spiritual Well-Being'}
          </h3>
        </div>

        <div className="flex bg-stone-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveSection('water')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              activeSection === 'water'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Water
          </button>
          <button
            onClick={() => setActiveSection('prayer')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              activeSection === 'prayer'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Prayer
          </button>
        </div>
      </div>

      {/* ================= WATER SECTION ================= */}
      {activeSection === 'water' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50/60 border border-sky-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 block">
                Today's Target
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-serif text-3xl font-bold text-sky-900">
                  {glassesDrank}
                </span>
                <span className="text-xs text-sky-700 font-medium">
                  / {glassesGoal} glasses (approx. {(glassesDrank * 250) / 1000}L)
                </span>
              </div>
              <p className="text-[11px] text-sky-800/80 mt-1">
                {glassesDrank >= glassesGoal
                  ? '🌟 Wonderful! You met your hydration goal today!'
                  : `${glassesGoal - glassesDrank} more glasses to reach optimal baseline.`}
              </p>
            </div>

            {/* Quick +/- loggers */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleSubtractGlass}
                className="w-8 h-8 rounded-xl bg-white text-sky-700 hover:bg-sky-100 border border-sky-200 flex items-center justify-center font-bold text-sm shadow-xs transition-colors"
                title="Remove 1 glass"
              >
                <Minus className="w-4 h-4" />
              </button>

              <button
                onClick={handleAddGlass}
                className="w-11 h-11 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center shadow-sm shadow-sky-200 group transition-all"
                title="Log +1 glass (250ml)"
              >
                <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          {/* Glasses Visual Icons */}
          <div className="flex items-center justify-between gap-1 px-1">
            {Array.from({ length: glassesGoal }).map((_, idx) => {
              const isFilled = idx < glassesDrank;
              return (
                <div
                  key={idx}
                  className={`flex-1 h-8 rounded-lg flex items-center justify-center transition-all ${
                    isFilled
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-300 border border-stone-200/60'
                  }`}
                  title={`Glass ${idx + 1}`}
                >
                  <Droplets className="w-3.5 h-3.5" />
                </div>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-stone-500">
              Optimal for hormones, energy & kidney flushing
            </span>
            <button
              onClick={handleQuickAddWaterReminder}
              className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1"
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>Set Water Alarm</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= PRAYER & SPIRITUAL SECTION ================= */}
      {activeSection === 'prayer' && (
        <div className="space-y-3.5 animate-fade-in">
          {/* Tradition selector */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-xs">
            {[
              { id: 'interfaith', label: 'Interfaith / Peace' },
              { id: 'christian', label: 'Christian' },
              { id: 'islamic', label: 'Islamic (Salah)' },
              { id: 'jewish', label: 'Jewish' },
              { id: 'hindu', label: 'Hindu (Shanti)' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTradition(t.id as any)}
                className={`px-2.5 py-1 rounded-xl whitespace-nowrap text-[11px] font-semibold transition-all ${
                  selectedTradition === t.id
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Sacred Scripture / Prayer Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50/90 to-amber-50/50 border border-rose-100/90 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-rose-800">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                {currentPrayer.title}
              </span>
              <span className="text-[10px] text-stone-500 font-normal">
                {currentPrayer.source}
              </span>
            </div>

            <p className="font-serif italic text-xs sm:text-sm text-stone-800 leading-relaxed">
              "{currentPrayer.prayer}"
            </p>
          </div>

          {/* Interactive 2-Minute Breathe & Pray Session */}
          {isMeditating ? (
            <div className="p-4 rounded-2xl bg-stone-900 text-white text-center space-y-2 animate-fade-in">
              <span className="text-[10px] uppercase font-bold tracking-widest text-rose-300">
                Peaceful Prayer Moment
              </span>
              <div className="text-xl font-serif font-bold text-white capitalize">
                {breathPhase === 'inhale' && 'Breathe In Peace & Grace...'}
                {breathPhase === 'hold' && 'Hold Gently in Quiet Gratitude...'}
                {breathPhase === 'exhale' && 'Release Every Worry & Pain...'}
              </div>
              <p className="text-xs text-stone-400">
                Lifting your heart and body to gentle healing.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={startBreathingPrayer}
                className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>2-Min Pray & Breathe</span>
              </button>

              <button
                onClick={() => handleQuickAddPrayerReminder(currentPrayer.title)}
                className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <BellRing className="w-3.5 h-3.5 text-rose-600" />
                <span>Set Daily Prayer Alarm</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
