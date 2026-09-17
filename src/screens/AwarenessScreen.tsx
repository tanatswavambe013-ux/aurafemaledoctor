import React, { useState } from 'react';
import {
  Ribbon,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calendar,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  PhoneCall,
  Shield,
  Clock,
  HeartHandshake,
} from 'lucide-react';
import { UserProfile } from '../types';
import {
  SELF_EXAM_STEPS,
  SCREENING_GUIDES,
  BREAST_SYMPTOMS_CHECKLIST,
} from '../data/defaultData';

interface AwarenessScreenProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onNavigate: (screen: string) => void;
}

export const AwarenessScreen: React.FC<AwarenessScreenProps> = ({
  user,
  onUpdateUser,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'exam' | 'guidelines' | 'symptoms' | 'library'>('exam');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [examCompletedToday, setExamCompletedToday] = useState<boolean>(false);

  const step = SELF_EXAM_STEPS[currentStepIndex];

  const handleCompleteExam = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    onUpdateUser({
      ...user,
      lastSelfExamDate: todayStr,
    });
    setExamCompletedToday(true);
  };

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const hasHighConcernSymptom = selectedSymptoms.some((id) => {
    const item = BREAST_SYMPTOMS_CHECKLIST.find((c) => c.id === id);
    return item?.concernLevel === 'high';
  });

  return (
    <div className="space-y-5 pb-24 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 rounded-3xl p-5 text-white shadow-sm">
        <div className="flex items-center gap-2 text-rose-100 text-xs font-semibold uppercase tracking-wider mb-1">
          <Ribbon className="w-4 h-4" />
          <span>Breast Health & Awareness Hub</span>
        </div>
        <h2 className="font-serif text-xl font-bold">
          Empowering Your Breast Health
        </h2>
        <p className="text-xs text-rose-100 mt-1 leading-relaxed">
          Knowledge, regular awareness, and early screening are your strongest allies. You deserve gentle, supportive guidance every month.
        </p>

        {user.lastSelfExamDate && (
          <div className="mt-3.5 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
            <span className="text-rose-100">Last monthly self-exam:</span>
            <span className="font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
              {user.lastSelfExamDate}
            </span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 p-1 bg-stone-100 rounded-2xl text-xs font-semibold">
        <button
          onClick={() => setActiveTab('exam')}
          className={`py-2 rounded-xl transition-all ${
            activeTab === 'exam'
              ? 'bg-white text-stone-800 shadow-sm'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Self-Exam
        </button>
        <button
          onClick={() => setActiveTab('guidelines')}
          className={`py-2 rounded-xl transition-all ${
            activeTab === 'guidelines'
              ? 'bg-white text-stone-800 shadow-sm'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          By Age
        </button>
        <button
          onClick={() => setActiveTab('symptoms')}
          className={`py-2 rounded-xl transition-all ${
            activeTab === 'symptoms'
              ? 'bg-white text-stone-800 shadow-sm'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Checklist
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`py-2 rounded-xl transition-all ${
            activeTab === 'library'
              ? 'bg-white text-stone-800 shadow-sm'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Risk Library
        </button>
      </div>

      {/* TAB 1: 6-STEP SELF-EXAM GUIDE */}
      {activeTab === 'exam' && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
              Step {step.step} of {SELF_EXAM_STEPS.length}
            </span>
            <div className="flex gap-1">
              {SELF_EXAM_STEPS.map((s, idx) => (
                <span
                  key={s.step}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentStepIndex ? 'w-5 bg-rose-500' : 'bg-stone-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-100/70">
            <h3 className="font-serif text-base font-bold text-stone-800">
              {step.title}
            </h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              {step.description}
            </p>

            <div className="mt-3 p-2.5 bg-white rounded-xl border border-rose-100 text-[11px] text-rose-900 font-medium">
              💡 <strong>What to notice:</strong> {step.tips}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl text-stone-500 hover:bg-stone-100 disabled:opacity-40"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>

            {currentStepIndex < SELF_EXAM_STEPS.length - 1 ? (
              <button
                onClick={() => setCurrentStepIndex((prev) => Math.min(SELF_EXAM_STEPS.length - 1, prev + 1))}
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-sm"
              >
                Next Step <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleCompleteExam}
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" /> Mark Complete
              </button>
            )}
          </div>

          {examCompletedToday && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 text-center font-medium animate-fade-in">
              🎉 Self-exam recorded for this month! We will nudge you gently again in 30 days.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: GUIDELINES BY AGE */}
      {activeTab === 'guidelines' && (
        <div className="space-y-3">
          {SCREENING_GUIDES.map((g) => (
            <div
              key={g.ageRange}
              className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  {g.ageRange}
                </span>
                <span className="text-[11px] font-semibold text-stone-500">
                  {g.frequency}
                </span>
              </div>
              <h3 className="font-serif font-bold text-stone-800 text-sm">
                {g.title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {g.recommendation}
              </p>
              <div className="p-2.5 bg-stone-50 rounded-xl text-[11px] text-stone-600 border border-stone-100">
                <strong>Special note:</strong> {g.specialConsideration}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: GENTLE SYMPTOM CHECKLIST */}
      {activeTab === 'symptoms' && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100 space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-serif font-bold text-stone-800 text-base">
              Gentle Symptom Checklist
            </h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Check anything you have observed recently. This is not a diagnosis — it is simply a tool to help you articulate what you notice before visiting your doctor.
            </p>
          </div>

          <div className="space-y-2.5">
            {BREAST_SYMPTOMS_CHECKLIST.map((item) => {
              const isChecked = selectedSymptoms.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleSymptom(item.id)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    isChecked
                      ? 'bg-rose-50 border-rose-300 ring-1 ring-rose-300'
                      : 'bg-stone-50/80 border-stone-200/70 hover:bg-stone-100'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center flex-shrink-0 transition-colors ${
                      isChecked
                        ? 'bg-rose-500 text-white'
                        : 'border border-stone-300 bg-white'
                    }`}
                  >
                    {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-stone-800 block">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      {item.detail}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Prompt if high concern symptoms selected */}
          {hasHighConcernSymptom && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 font-bold text-xs text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>We Strongly Recommend Booking a Clinical Screening</span>
              </div>
              <p className="text-xs leading-relaxed text-amber-800">
                You've highlighted changes that deserve direct clinical evaluation by a physician or radiologist.
                <strong> Remember: 8 out of 10 breast lumps are benign (non-cancerous)</strong>, but scheduling a mammogram or ultrasound promptly gives you peace of mind and clarity.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onNavigate('chat')}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs"
                >
                  Ask SheDoctor What Questions to Bring
                </button>
              </div>
            </div>
          )}

          <div className="text-[11px] text-stone-400 italic text-center pt-2">
            Aura is an educational companion and does not replace medical screening.
          </div>
        </div>
      )}

      {/* TAB 4: RISK FACTORS & EDUCATIONAL LIBRARY */}
      {activeTab === 'library' && (
        <div className="space-y-3">
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100 space-y-2">
            <h3 className="font-serif font-bold text-stone-800 text-sm">
              Understanding Genetic & Family Factors
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              About 5% to 10% of breast cancer cases are hereditary, caused by gene mutations like <strong>BRCA1</strong> and <strong>BRCA2</strong>. If your mother, sister, daughter, or multiple relatives have had breast or ovarian cancer, genetic counseling can illuminate your options.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100 space-y-2">
            <h3 className="font-serif font-bold text-stone-800 text-sm">
              Dense Breast Tissue Explained
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Nearly half of women have dense breast tissue, which means more glandular and fibrous tissue than fatty tissue. Because both dense tissue and tumors appear white on standard mammograms, doctors often recommend 3D mammograms (tomosynthesis) or ultrasound.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100 space-y-2">
            <h3 className="font-serif font-bold text-stone-800 text-sm">
              Protective Lifestyle Factors
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Regular physical activity, mindful moderation of alcohol, maintaining balanced blood sugar, and staying consistent with routine clinical checkups all contribute meaningfully to long-term cellular health.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
