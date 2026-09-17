import React, { useState } from 'react';
import {
  Ribbon,
  Thermometer,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  Heart,
  MessageSquareHeart,
  CheckCircle2,
  ListOrdered,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { UserProfile } from '../types';

interface CancerCareCardProps {
  user: UserProfile;
  onOpenTempTester: () => void;
  onNavigate: (screen: string) => void;
}

export const CancerCareCard: React.FC<CancerCareCardProps> = ({
  user,
  onOpenTempTester,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'lymphedema'>('overview');

  const cancerDetails = user.cancerSpecifics;
  const cancerType = cancerDetails?.cancerType || 'Breast Cancer';
  const phase = cancerDetails?.phase || 'in_chemo_radiation';

  const phaseLabels: Record<string, string> = {
    newly_diagnosed: 'Newly Diagnosed & Exploring Options',
    in_chemo_radiation: 'Active Chemo & Radiation Phase',
    post_surgery: 'Post-Surgical Healing & Recovery',
    hormone_therapy: 'Hormone / Endocrine Maintenance',
    remission_survivor: 'Remission & Survivorship Journey',
  };

  const oncologyQuestions = [
    'What target white blood cell (ANC) count should I look for in my lab results?',
    'What specific temperature should trigger a call to your on-call triage line?',
    'Are there gentle anti-nausea options that won’t interfere with my other medications?',
    'What exercises or arm movements are safe right now to prevent lymphedema?',
    'How should I adjust my hydration and electrolytes on infusion days?',
  ];

  return (
    <section className="rounded-3xl bg-gradient-to-br from-rose-950 via-stone-900 to-rose-900 text-white p-5 shadow-md border border-rose-800/40 relative overflow-hidden animate-fade-in">
      {/* Subtle ribbon watermark backdrop */}
      <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
        <Ribbon className="w-48 h-48 text-rose-300" />
      </div>

      <div className="relative z-10 space-y-3.5">
        {/* Top Tag & Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500/30 border border-rose-400/40 text-rose-200 flex items-center justify-center">
              <Ribbon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-300 block">
                Personalized Care Companion
              </span>
              <h3 className="font-serif font-bold text-white text-base">
                {cancerType} Support Hub
              </h3>
            </div>
          </div>
          <span className="text-[11px] bg-rose-500/20 text-rose-200 border border-rose-400/30 px-2.5 py-0.5 rounded-full font-medium">
            {phaseLabels[phase] || 'Active Care'}
          </span>
        </div>

        {/* High Priority Neutropenic Fever Monitor Banner */}
        <div className="bg-rose-900/50 border border-rose-700/60 rounded-2xl p-3 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Thermometer className="w-4 h-4 text-rose-300 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-rose-100 block">
                Fever Watch (Neutropenia Safety)
              </span>
              <p className="text-[11px] text-rose-200/80 leading-relaxed">
                Check temp if you feel chills or fatigue. ≥38.0°C (100.4°F) is an urgent oncology call.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenTempTester}
            className="flex-shrink-0 px-2.5 py-1.5 bg-rose-500 hover:bg-rose-400 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            Check Temp
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex gap-1.5 p-1 bg-black/20 rounded-xl">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-1 text-[11px] font-semibold rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-rose-200 hover:text-white'
            }`}
          >
            Daily Tips
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`flex-1 py-1 text-[11px] font-semibold rounded-lg transition-all ${
              activeTab === 'questions'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-rose-200 hover:text-white'
            }`}
          >
            Doctor Questions
          </button>
          <button
            onClick={() => setActiveTab('lymphedema')}
            className={`flex-1 py-1 text-[11px] font-semibold rounded-lg transition-all ${
              activeTab === 'lymphedema'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-rose-200 hover:text-white'
            }`}
          >
            Arm Care & Rest
          </button>
        </div>

        {/* Tab 1: Daily Tips */}
        {activeTab === 'overview' && (
          <div className="space-y-2 text-xs text-rose-100">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/10 p-2.5 rounded-xl">
                <span className="font-bold text-white block text-[11px]">Hydration Priority:</span>
                <span className="text-[10px] text-rose-200/90 leading-tight block mt-0.5">
                  Small, frequent sips of water with lemon help kidney clearance and metallic taste.
                </span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl">
                <span className="font-bold text-white block text-[11px]">Fatigue Pacing:</span>
                <span className="text-[10px] text-rose-200/90 leading-tight block mt-0.5">
                  Rest is an active healing act, not a defeat. Give yourself permission to pause.
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('chat')}
              className="w-full py-2.5 px-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-medium text-rose-100 flex items-center justify-between transition-colors mt-2"
            >
              <div className="flex items-center gap-2">
                <MessageSquareHeart className="w-4 h-4 text-rose-300" />
                <span>Ask SheDoctor AI: "Managing chemo fatigue & nutrition"</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-rose-300" />
            </button>
          </div>
        )}

        {/* Tab 2: Questions for Oncologist */}
        {activeTab === 'questions' && (
          <div className="space-y-2 text-xs">
            <p className="text-[11px] text-rose-200">
              Save or screenshot these for your next clinic visit:
            </p>
            <ul className="space-y-1.5">
              {oncologyQuestions.slice(0, 3).map((q, idx) => (
                <li
                  key={idx}
                  className="bg-white/10 p-2 rounded-xl text-[11px] text-white flex items-start gap-2"
                >
                  <span className="font-bold text-rose-300">{idx + 1}.</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tab 3: Lymphedema & Arm Care */}
        {activeTab === 'lymphedema' && (
          <div className="space-y-2 text-xs text-rose-100 bg-white/10 p-3 rounded-2xl">
            <span className="font-bold text-white block">Post-Surgery & Axillary Node Care:</span>
            <ul className="space-y-1 text-[11px] text-rose-200/90 list-disc pl-4">
              <li>Avoid blood pressure cuffs, blood draws, or IVs on the affected surgical arm.</li>
              <li>Practice gentle finger, wrist, and shoulder circles daily to encourage lymph drainage.</li>
              <li>Moisturize skin gently and wear protective gloves when gardening or doing dishes.</li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
