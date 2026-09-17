import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Sparkles,
  Calendar,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  HelpCircle,
  MessageSquareHeart,
  Wind,
  ShieldCheck,
  Clock,
  Droplets,
  Activity,
} from 'lucide-react';
import { UserProfile, CycleRecord } from '../types';

interface LatePeriodGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  cycles: CycleRecord[];
  daysLateDetected?: number;
  onOpenChatWithPrompt?: (prompt: string) => void;
}

export const LatePeriodGuideModal: React.FC<LatePeriodGuideModalProps> = ({
  isOpen,
  onClose,
  user,
  cycles,
  daysLateDetected = 0,
  onOpenChatWithPrompt,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [daysLate, setDaysLate] = useState<number>(daysLateDetected > 0 ? daysLateDetected : 3);
  const [userContext, setUserContext] = useState<
    'ttc_hopeful' | 'unplanned_scare' | 'not_pregnant' | 'medical_treatment'
  >('unplanned_scare');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [breathPhase, setBreathPhase] = useState<'Inhale peace' | 'Hold gently' | 'Exhale tension'>('Inhale peace');
  const [breathSeconds, setBreathSeconds] = useState<number>(4);

  // Sync days late if detected changes
  useEffect(() => {
    if (daysLateDetected > 0) {
      setDaysLate(daysLateDetected);
    }
  }, [daysLateDetected]);

  // Breathing loop for grounding in Step 1
  useEffect(() => {
    if (!isOpen || currentStep !== 1) return;
    const interval = setInterval(() => {
      setBreathPhase((prev) => {
        if (prev === 'Inhale peace') return 'Hold gently';
        if (prev === 'Hold gently') return 'Exhale tension';
        return 'Inhale peace';
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const symptomOptions = [
    {
      id: 'cramping_no_flow',
      label: 'Mild cramps with no period yet',
      desc: 'Very common: uterus preparing for flow OR early implantation/progesterone shifts.',
    },
    {
      id: 'tender_breasts',
      label: 'Tender, heavy, or sore breasts',
      desc: 'Driven by high luteal progesterone, present in both PMS and early conception.',
    },
    {
      id: 'light_spotting',
      label: 'Light pink or brownish spotting',
      desc: 'Can be early flow starting, cervical sensitivity, or implantation spotting.',
    },
    {
      id: 'high_stress',
      label: 'Significant stress, worry, or poor sleep',
      desc: 'Elevated cortisol is the #1 culprit delaying the hypothalamic-pituitary trigger for ovulation.',
    },
    {
      id: 'recent_illness',
      label: 'Recent sickness, cold, fever, or travel',
      desc: 'The body intelligently delays cycle release when recovering energy or crossing timezones.',
    },
    {
      id: 'fatigue_nausea',
      label: 'Unusual fatigue, dizziness, or mild nausea',
      desc: 'Hormonal peaks or prolonged luteal phase fatigue.',
    },
  ];

  const handleStartSheDoctorChat = () => {
    const contextLabels = {
      ttc_hopeful: 'I am trying to conceive / hoping for pregnancy',
      unplanned_scare: 'I am feeling anxious about a potential unplanned pregnancy',
      not_pregnant: 'Pregnancy is not possible (not active / protected), but my period is late',
      medical_treatment: 'I have health conditions or medications that might affect my cycle',
    };

    const symptomsList = selectedSymptoms.length > 0 ? selectedSymptoms.join(', ') : 'no specific symptoms';
    const prompt = `My period is currently approximately ${daysLate} days late. My situation: "${contextLabels[userContext]}". Some bodily signs I'm experiencing: ${symptomsList}. Please give me gentle, compassionate reassurance, explain what might be going on in my body, and walk me through the best next steps.`;

    onClose();
    if (onOpenChatWithPrompt) {
      onOpenChatWithPrompt(prompt);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF7F5] w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 pt-5 pb-3 border-b border-stone-200/60 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-rose-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-serif font-bold text-stone-900 text-base sm:text-lg">
                  Late Period Companion
                </h2>
                <span className="text-[10px] bg-rose-50 text-rose-700 font-semibold px-2 py-0.5 rounded-full border border-rose-200">
                  Step {currentStep} of 5
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Calm guidance, encouraging words, and step-by-step care.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 h-1">
          <div
            className="bg-rose-500 h-1 transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>

        {/* Modal Body with smooth scrolling */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-stone-800">
          {/* STEP 1: GROUNDING & DAYS LATE */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Encouraging Opening Banner */}
              <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200/80 text-rose-950 space-y-2">
                <div className="flex items-center gap-2 text-rose-700 font-semibold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  <span>First: Take a Slow, Gentle Breath</span>
                </div>
                <p className="text-sm font-serif italic leading-relaxed text-stone-800">
                  "Our bodies are living ecosystems, not mechanical clocks. A late period is
                  extraordinarily common and happens to almost every woman. You are safe, and we are
                  walking through this together with tenderness and clarity."
                </p>
              </div>

              {/* Soothing Breathing Circle */}
              <div className="bg-white p-5 rounded-3xl border border-stone-100 shadow-xs flex flex-col items-center text-center">
                <div className="relative w-24 h-24 mb-3 flex items-center justify-center">
                  <div
                    className={`absolute inset-0 rounded-full bg-rose-200/50 transition-transform duration-1000 ${
                      breathPhase === 'Inhale peace'
                        ? 'scale-110 opacity-80'
                        : breathPhase === 'Hold gently'
                        ? 'scale-100 opacity-90'
                        : 'scale-90 opacity-40'
                    }`}
                  />
                  <div className="relative z-10 w-16 h-16 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md">
                    <Wind className="w-7 h-7" />
                  </div>
                </div>
                <span className="font-serif font-bold text-stone-800 text-base mb-1">
                  {breathPhase}
                </span>
                <p className="text-xs text-stone-500 max-w-xs">
                  Slowing your breath tells your nervous system and hormonal glands that you are safe.
                </p>
              </div>

              {/* How many days late selector */}
              <div className="bg-white p-4 rounded-3xl border border-stone-100 shadow-xs space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                  How many days past your expected period are you?
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 3, 5, 7, 10, 14, 21, 30].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setDaysLate(num)}
                      className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all ${
                        daysLate === num
                          ? 'bg-rose-500 text-white shadow-xs'
                          : 'bg-stone-50 text-stone-700 hover:bg-rose-50 border border-stone-200/70'
                      }`}
                    >
                      {num} {num === 1 ? 'day' : 'days'}
                    </button>
                  ))}
                </div>

                <div className="p-3 bg-stone-50 rounded-2xl text-xs text-stone-600">
                  {daysLate <= 3 && (
                    <p>
                      ✨ <strong>1–3 days:</strong> Extremely common natural variation. Ovulation was
                      likely delayed by just 24–48 hours due to subtle everyday stress or sleep shifts.
                    </p>
                  )}
                  {daysLate > 3 && daysLate <= 7 && (
                    <p>
                      🌿 <strong>4–7 days:</strong> Moderate delay. Home pregnancy tests become highly
                      accurate during this window if conception is possible.
                    </p>
                  )}
                  {daysLate > 7 && daysLate <= 14 && (
                    <p>
                      🌸 <strong>1–2 weeks:</strong> Significant delay. A home test will be definitive, or
                      stress/hormonal shifts may have skipped ovulation this cycle.
                    </p>
                  )}
                  {daysLate > 14 && (
                    <p>
                      🩺 <strong>2+ weeks:</strong> Anovulatory cycle or hormonal pause. We’ll guide you
                      on testing and when to have your doctor review your thyroid, PCOS, or vitals.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: USER SITUATION & CONTEXT */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-base">
                  What is your situation right now?
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Select your current mindset so we can personalize our guidance with the right care.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    id: 'unplanned_scare',
                    icon: '🌿',
                    title: 'I am anxious about an unplanned pregnancy',
                    desc: 'You feel worried, panicked, or overwhelmed. We provide calming facts and exact testing timing.',
                  },
                  {
                    id: 'ttc_hopeful',
                    icon: '🌸',
                    title: 'I am hoping for pregnancy / Trying to conceive (TTC)',
                    desc: 'You are excited or praying for positive news. We explain hCG timing and early signs.',
                  },
                  {
                    id: 'not_pregnant',
                    icon: '🕊️',
                    title: 'Pregnancy is impossible (Not active / Protected)',
                    desc: 'You just want to know why your body is late (stress, diet, workouts, thyroid, illness).',
                  },
                  {
                    id: 'medical_treatment',
                    icon: '🩺',
                    title: 'Undergoing medical treatment / PCOS / Cancer care',
                    desc: 'Chemo, radiation, tamoxifen, hormonal therapies, or endocrine shifts affecting cycles.',
                  },
                ].map((item) => {
                  const isSelected = userContext === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setUserContext(item.id as any)}
                      className={`w-full p-4 rounded-3xl text-left border transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-300/30'
                          : 'bg-white border-stone-100 hover:border-stone-200'
                      }`}
                    >
                      <span className="text-2xl mt-0.5">{item.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-stone-900">{item.title}</h4>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-rose-600 flex-shrink-0" />}
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Tailored Context Reassurance Box */}
              <div className="p-4 rounded-2xl bg-white border border-rose-100 shadow-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  <span>Compassionate Note for You:</span>
                </div>
                {userContext === 'unplanned_scare' && (
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Anxiety about a late period actually floods your body with adrenaline and cortisol,
                    which ironically delays your period even further! Remember that late periods are very
                    frequently caused purely by stress. Take one step at a time; taking a reliable test in
                    the morning will give you immediate clarity.
                  </p>
                )}
                {userContext === 'ttc_hopeful' && (
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Sending you warm love and hope. A missed period is the most famous early sign! Use
                    first-morning urine with a sensitive early-detection test. If you see a faint line,
                    test again in 48 hours as pregnancy hCG doubles every two days.
                  </p>
                )}
                {userContext === 'not_pregnant' && (
                  <p className="text-xs text-stone-600 leading-relaxed">
                    When pregnancy is ruled out, late periods are almost always temporary "anovulatory"
                    or delayed cycles. Travel, shifts in circadian rhythm, recent mild viral infections,
                    calorie restriction, or intense workouts temporarily pause ovulation. Your rhythm will
                    return.
                  </p>
                )}
                {userContext === 'medical_treatment' && (
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Chemotherapy, pelvic radiation, hormone blockers (like tamoxifen or aromatase
                    inhibitors), or thyroid medication directly modulate ovarian follicular release. It is
                    completely expected for your cycle to pause or vary. Always mention cycle changes to
                    your oncology or primary care nurse.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: SYMPTOM & PHYSICAL CHECKLIST */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-base">
                  What is your body feeling right now?
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Check any sensations you notice. PMS and early pregnancy share identical signs because
                  both are powered by progesterone.
                </p>
              </div>

              <div className="space-y-2">
                {symptomOptions.map((sym) => {
                  const isChecked = selectedSymptoms.includes(sym.id);
                  return (
                    <button
                      key={sym.id}
                      type="button"
                      onClick={() => toggleSymptom(sym.id)}
                      className={`w-full p-3.5 rounded-2xl text-left border transition-all flex items-start gap-3 ${
                        isChecked
                          ? 'bg-rose-50/80 border-rose-300'
                          : 'bg-white border-stone-100 hover:border-stone-200'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center transition-colors flex-shrink-0 ${
                          isChecked
                            ? 'bg-rose-500 border-rose-500 text-white'
                            : 'border-stone-300 bg-stone-50'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-stone-800 block">
                          {sym.label}
                        </span>
                        <span className="text-[11px] text-stone-500 mt-0.5 block leading-relaxed">
                          {sym.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Progesterone Biological Fact */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-amber-950 text-xs space-y-1">
                <span className="font-semibold text-amber-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Why do you feel cramping with no blood?
                </span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Progesterone relaxes smooth muscles and uterine tissue. Right before a delayed period,
                  the uterus may gently contract in preparation, mimicking PMS or implantation. Don't
                  interpret cramping as proof of either until your period arrives or a test is taken.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: STEP-BY-STEP ACTION PLAN */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-base">
                  Your Step-by-Step Action Plan
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Clear, calm, actionable steps for today and the days ahead.
                </p>
              </div>

              <div className="space-y-3">
                {/* Step 1: Testing Guide */}
                <div className="bg-white p-4 rounded-3xl border border-stone-100 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-xs">
                    <Clock className="w-4 h-4" />
                    <span>1. When & How to Take a Pregnancy Test</span>
                  </div>
                  <ul className="text-xs text-stone-600 space-y-1.5 pl-4 list-disc leading-relaxed">
                    <li>
                      <strong>Timing:</strong> If you are 1+ days late, modern urine tests are over 99%
                      accurate.
                    </li>
                    <li>
                      <strong>Best sample:</strong> Use your <em>first morning urine</em>, when hCG hormone
                      is most concentrated.
                    </li>
                    <li>
                      <strong>If negative:</strong> If your period still hasn't arrived in 3–5 days,
                      repeat the test. Conception may have occurred later in your cycle.
                    </li>
                  </ul>
                </div>

                {/* Step 2: Soothe Body & Reduce Cortisol */}
                <div className="bg-white p-4 rounded-3xl border border-stone-100 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-xs">
                    <Droplets className="w-4 h-4" />
                    <span>2. Soothe Your Body Today</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-100">
                      <span className="font-bold text-stone-800 block">Warmth & Heat</span>
                      <span className="text-[11px] text-stone-500">
                        A warm water bottle or bath relaxes pelvic contractions.
                      </span>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-100">
                      <span className="font-bold text-stone-800 block">Hydration & Herbs</span>
                      <span className="text-[11px] text-stone-500">
                        Chamomile, ginger, and plenty of warm water.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 3: Safety & Red Flags */}
                <div className="bg-rose-50/60 p-4 rounded-3xl border border-rose-200/70 space-y-2">
                  <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>When to Seek Immediate Medical Evaluation</span>
                  </div>
                  <p className="text-[11px] text-rose-900 leading-relaxed">
                    While a late period is almost always harmless, reach out to urgent care or an emergency
                    clinic if you experience:
                  </p>
                  <ul className="text-[11px] text-rose-800 pl-4 list-disc space-y-1">
                    <li>Severe, sharp, or stabbing one-sided lower pelvic pain</li>
                    <li>Dizziness, fainting, lightheadedness, or pale clammy skin</li>
                    <li>Shoulder-tip pain (a recognized sign of internal pelvic irritation)</li>
                    <li>Unusually heavy vaginal bleeding soaking more than 2 pads per hour</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: COMPANION SUMMARY & SHEDOCTOR HANDOFF */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-center py-3">
                <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-3">
                  <Heart className="w-7 h-7 fill-rose-300" />
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-lg">
                  You Have Done Wonderfully Today
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                  You have checked in with your body, understood your timing, and learned the clear steps
                  ahead.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-white p-4 rounded-3xl border border-stone-100 shadow-xs space-y-2.5 text-xs">
                <span className="font-bold text-stone-700 uppercase tracking-wider text-[10px] block">
                  Your Late Period Snapshot
                </span>
                <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                  <span className="text-stone-500">Days Past Expected:</span>
                  <span className="font-bold text-stone-800">{daysLate} days</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                  <span className="text-stone-500">Current Context:</span>
                  <span className="font-bold text-stone-800 capitalize">
                    {userContext.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-stone-500">Reported Sensations:</span>
                  <span className="font-bold text-stone-800 text-right max-w-[200px] truncate">
                    {selectedSymptoms.length > 0 ? `${selectedSymptoms.length} signs noted` : 'None'}
                  </span>
                </div>
              </div>

              {/* SheDoctor AI One-Click Consultation */}
              <div className="p-4 rounded-3xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquareHeart className="w-5 h-5 text-rose-200" />
                  <h4 className="font-serif font-bold text-sm">
                    Talk With SheDoctor AI Now
                  </h4>
                </div>
                <p className="text-xs text-rose-100 leading-relaxed">
                  Have an open, private, caring conversation with SheDoctor. She will listen to your
                  concerns, provide personalized reassurance, and answer any questions you have about
                  your cycle.
                </p>
                <button
                  type="button"
                  onClick={handleStartSheDoctorChat}
                  className="w-full py-2.5 bg-white text-rose-700 hover:bg-rose-50 font-bold rounded-2xl text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <MessageSquareHeart className="w-4 h-4" />
                  <span>Start Caring Conversation with SheDoctor</span>
                </button>
              </div>

              {/* Reset / Reminder Tip */}
              <p className="text-center text-[11px] text-stone-400">
                Remember: if you test negative and have no period for 3 consecutive months, schedule a
                gentle review with your gynecologist.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-white border-t border-stone-200/60 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s - 1)}
              className="px-4 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s + 1)}
              className="px-5 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold transition-colors shadow-sm"
            >
              Done & Return Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
