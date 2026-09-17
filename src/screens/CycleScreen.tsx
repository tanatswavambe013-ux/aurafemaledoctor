import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Sparkles,
  Heart,
  Plus,
  Info,
  Trash2,
} from 'lucide-react';
import { CycleRecord, UserProfile } from '../types';
import { calculateCyclePredictions } from '../utils/healthCalculators';
import { LatePeriodAlertCard } from '../components/LatePeriodAlertCard';

interface CycleScreenProps {
  cycles: CycleRecord[];
  user: UserProfile;
  onSaveCycle: (cycle: CycleRecord) => void;
  onDeleteCycle: (id: string) => void;
  onOpenQuickLog: () => void;
  onOpenLatePeriodGuide?: () => void;
}

export const CycleScreen: React.FC<CycleScreenProps> = ({
  cycles,
  user,
  onSaveCycle,
  onDeleteCycle,
  onOpenQuickLog,
  onOpenLatePeriodGuide,
}) => {
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const predictions = calculateCyclePredictions(cycles, user.cycleLength, user.periodDuration);

  // Month navigation
  const prevMonth = () => {
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1)
    );
  };
  const nextMonth = () => {
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1)
    );
  };

  const monthYearStr = currentMonthDate.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Calendar math
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  // Format date helper (YYYY-MM-DD)
  const toDateKey = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  // Check if a day belongs to past period, predicted period, or fertile window
  const getDayStatus = (dayNum: number) => {
    const key = toDateKey(year, month, dayNum);
    const dayDate = new Date(year, month, dayNum);
    dayDate.setHours(0, 0, 0, 0);

    // 1. Is it a recorded past period?
    const inPastPeriod = cycles.some((c) => {
      const s = new Date(c.startDate + 'T00:00:00');
      const e = new Date(c.endDate + 'T00:00:00');
      return dayDate >= s && dayDate <= e;
    });
    if (inPastPeriod) return 'period-logged';

    // 2. Is it in predicted next period?
    if (predictions.nextPeriodStart && predictions.nextPeriodEnd) {
      const pStart = new Date(predictions.nextPeriodStart);
      pStart.setHours(0, 0, 0, 0);
      const pEnd = new Date(predictions.nextPeriodEnd);
      pEnd.setHours(0, 0, 0, 0);
      if (dayDate >= pStart && dayDate <= pEnd) return 'period-predicted';
    }

    // 3. Is it ovulation day?
    if (predictions.ovulationDate) {
      const ovDate = new Date(predictions.ovulationDate);
      ovDate.setHours(0, 0, 0, 0);
      if (dayDate.getTime() === ovDate.getTime()) return 'ovulation';
    }

    // 4. Is it fertile window?
    if (predictions.fertileWindowStart && predictions.fertileWindowEnd) {
      const fStart = new Date(predictions.fertileWindowStart);
      fStart.setHours(0, 0, 0, 0);
      const fEnd = new Date(predictions.fertileWindowEnd);
      fEnd.setHours(0, 0, 0, 0);
      if (dayDate >= fStart && dayDate <= fEnd) return 'fertile';
    }

    // 5. Is it today?
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dayDate.getTime() === today.getTime()) return 'today';

    return 'default';
  };

  const getStyleForStatus = (status: string) => {
    switch (status) {
      case 'period-logged':
        return 'bg-rose-500 text-white font-bold shadow-sm';
      case 'period-predicted':
        return 'bg-rose-100 text-rose-800 border-2 border-dashed border-rose-300 font-bold';
      case 'ovulation':
        return 'bg-indigo-500 text-white font-bold shadow-sm ring-2 ring-indigo-200';
      case 'fertile':
        return 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold';
      case 'today':
        return 'border-2 border-stone-800 font-bold text-stone-800';
      default:
        return 'text-stone-700 hover:bg-stone-100';
    }
  };

  return (
    <div className="space-y-5 pb-24 animate-fade-in">
      {/* Screen Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold text-stone-800">
            Cycle & Ovulation Tracker
          </h2>
          <p className="text-xs text-stone-500">
            Intelligent predictions based on your personal rhythm.
          </p>
        </div>
        <button
          onClick={onOpenQuickLog}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Log Period</span>
        </button>
      </div>

      {/* Proactive Late Period Alert (if period is late) */}
      {predictions.isLate && (
        <LatePeriodAlertCard
          daysLate={predictions.daysLate}
          onOpenGuide={onOpenLatePeriodGuide || (() => {})}
        />
      )}

      {/* Cycle Phase Insights Card */}
      <div className="bg-gradient-to-br from-rose-50 to-pink-50/60 p-4 rounded-3xl border border-rose-200/70 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-rose-700">
                Cycle Day {predictions.currentCycleDay}
              </span>
              <h3 className="font-serif text-base font-bold text-stone-800 capitalize">
                {predictions.phase} Phase
              </h3>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-white text-stone-700 rounded-full border border-rose-200">
            ~{user.cycleLength} Days Baseline
          </span>
        </div>
        <p className="text-xs text-stone-600 mt-2.5 leading-relaxed">
          {predictions.phaseDescription}
        </p>

        {/* Step-by-Step Late Period Guidance Prompt */}
        <div className="mt-3 pt-3 border-t border-rose-200/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-rose-900">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-100" />
            <span className="font-medium">Period late or feeling anxious?</span>
          </div>
          <button
            onClick={onOpenLatePeriodGuide}
            className="text-xs font-bold text-rose-700 hover:text-rose-900 underline"
          >
            Step-by-step guidance
          </button>
        </div>
      </div>

      {/* Interactive Calendar Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100">
        {/* Calendar Nav */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="w-8 h-8 rounded-full bg-stone-50 text-stone-600 hover:bg-stone-100 flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h3 className="font-serif font-bold text-stone-800 text-base">
            {monthYearStr}
          </h3>
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-full bg-stone-50 text-stone-600 hover:bg-stone-100 flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day of week labels */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <span key={d} className="text-[11px] font-semibold text-stone-400">
              {d}
            </span>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {daysArray.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="h-10" />;
            }
            const status = getDayStatus(day);
            const style = getStyleForStatus(status);

            return (
              <div
                key={`day-${day}`}
                className={`h-10 rounded-xl flex flex-col items-center justify-center text-xs transition-all relative ${style}`}
              >
                <span>{day}</span>
                {status === 'ovulation' && (
                  <span className="text-[7px] leading-tight font-extrabold uppercase">
                    Ovu
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-5 pt-4 border-t border-stone-100 grid grid-cols-2 gap-2 text-[11px] text-stone-600">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-rose-500" />
            <span>Logged Period</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-rose-100 border border-dashed border-rose-400" />
            <span>Predicted Period</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-indigo-500" />
            <span>Ovulation Peak</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-indigo-50 border border-indigo-200" />
            <span>Fertile Window</span>
          </div>
        </div>
      </div>

      {/* Cycle History and Symptom Logs */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100">
        <h3 className="font-serif font-bold text-stone-800 text-sm mb-3">
          Past Recorded Cycles & Symptoms
        </h3>

        {cycles.length === 0 ? (
          <p className="text-xs text-stone-500 text-center py-4">
            No past cycles logged yet. Tap "Log Period" above to get started.
          </p>
        ) : (
          <div className="space-y-3">
            {[...cycles].reverse().map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/60 flex items-start justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-stone-800">
                      {c.startDate} to {c.endDate}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold capitalize">
                      {c.flow} flow
                    </span>
                  </div>

                  {c.symptoms && c.symptoms.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {c.symptoms.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] bg-white text-stone-600 px-2 py-0.5 rounded-md border border-stone-200"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {c.mood && (
                    <span className="text-[10px] text-stone-500 block">
                      Recorded mood: {c.mood}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onDeleteCycle(c.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                  title="Remove cycle entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
