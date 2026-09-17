import React from 'react';
import { Heart, Sparkles, ChevronRight, Wind, AlertCircle, Calendar } from 'lucide-react';

interface LatePeriodAlertCardProps {
  daysLate?: number;
  onOpenGuide: () => void;
  isCompact?: boolean;
}

export const LatePeriodAlertCard: React.FC<LatePeriodAlertCardProps> = ({
  daysLate = 1,
  onOpenGuide,
  isCompact = false,
}) => {
  if (isCompact) {
    return (
      <div className="p-3.5 rounded-3xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <Heart className="w-4 h-4 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-rose-900">
                Period {daysLate} {daysLate === 1 ? 'Day' : 'Days'} Late
              </span>
              <span className="text-[10px] bg-rose-100 text-rose-700 font-semibold px-1.5 py-0.2 rounded-full">
                Gentle Care
              </span>
            </div>
            <p className="text-[11px] text-rose-700/90">
              Take a breath. Explore our calm step-by-step guide.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenGuide}
          className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1 flex-shrink-0"
        >
          <span>Open Guide</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-rose-600 to-pink-600 text-white p-5 shadow-sm">
      {/* Gentle background glow */}
      <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />

      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-100 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-rose-200 animate-ping" />
            <span>Gentle Cycle Nudge • Period Update</span>
          </div>
          <span className="text-xs font-bold bg-white/20 text-white px-2.5 py-0.5 rounded-full backdrop-blur-xs">
            {daysLate} {daysLate === 1 ? 'day' : 'days'} past expected
          </span>
        </div>

        <div>
          <h3 className="font-serif text-lg font-bold">
            Your Period is a Little Late — Take a Gentle Breath
          </h3>
          <p className="text-xs text-rose-100 mt-1 leading-relaxed max-w-sm">
            Our bodies are sensitive to stress, illness, travel, and everyday life. We’ve prepared an
            encouraging, step-by-step guide to help you navigate testing, symptoms, and peace of mind.
          </p>
        </div>

        <div className="pt-1 flex items-center gap-2.5">
          <button
            onClick={onOpenGuide}
            className="px-4 py-2.5 bg-white text-rose-700 hover:bg-rose-50 font-bold rounded-2xl text-xs shadow-sm transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Step-by-Step Guidance</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-1 text-[11px] text-rose-100">
            <Heart className="w-3 h-3 fill-rose-200" />
            <span>Encouragement & Clarity</span>
          </div>
        </div>
      </div>
    </section>
  );
};
