import React, { useState } from 'react';
import {
  X,
  User,
  LogIn,
  UserPlus,
  ShieldCheck,
  Sparkles,
  Heart,
  Ribbon,
  AlertCircle,
  Check,
  Activity,
  Droplets,
  Lock,
  Mail,
  HelpCircle,
} from 'lucide-react';
import { UserProfile } from '../types';
import { COMMON_CONDITIONS, REASONS_FOR_USE_OPTIONS } from '../data/defaultData';

interface AccountAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export const AccountAuthModal: React.FC<AccountAuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'problems_reasons' | 'account_auth'>('problems_reasons');

  // Intake / Problems & Reasons State
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || '');
  const [selectedReasons, setSelectedReasons] = useState<string[]>(
    user.reasonsForUse || [
      'Hormonal Health & PCOS / Endo Comfort',
      'Blood Pressure & Temperature Testing',
      'Daily Water & Prayer / Spiritual Reminders',
    ]
  );
  const [primaryConcerns, setPrimaryConcerns] = useState(
    user.primaryConcernsOrProblems ||
      'Tracking daily health, hormonal rhythms, staying hydrated and keeping blood pressure balanced.'
  );
  const [selectedConditions, setSelectedConditions] = useState<string[]>(user.conditions || []);
  const [customCondition, setCustomCondition] = useState('');

  // Cancer specifics if applicable
  const hasCancerCondition = selectedConditions.some((c) =>
    c.toLowerCase().includes('cancer')
  );
  const [cancerType, setCancerType] = useState(
    user.cancerSpecifics?.cancerType || 'Breast Cancer'
  );
  const [cancerPhase, setCancerPhase] = useState<any>(
    user.cancerSpecifics?.phase || 'in_chemo_radiation'
  );
  const [oncologistName, setOncologistName] = useState(
    user.cancerSpecifics?.oncologistName || ''
  );

  // Login / Switch Account State
  const [authMode, setAuthMode] = useState<'register' | 'login'>('login');
  const [loginEmail, setLoginEmail] = useState(user.email || 'maya@sisterhood.org');
  const [loginPin, setLoginPin] = useState('1234');
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleReason = (label: string) => {
    setSelectedReasons((prev) =>
      prev.includes(label) ? prev.filter((r) => r !== label) : [...prev, label]
    );
  };

  const toggleCondition = (cond: string) => {
    setSelectedConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  };

  const handleAddCustomCondition = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCondition.trim() && !selectedConditions.includes(customCondition.trim())) {
      setSelectedConditions((prev) => [...prev, customCondition.trim()]);
      setCustomCondition('');
    }
  };

  const handleSaveReasonsAndProblems = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name: name.trim() || user.name,
      email: email.trim() || user.email,
      reasonsForUse: selectedReasons,
      primaryConcernsOrProblems: primaryConcerns.trim(),
      conditions: selectedConditions,
      cancerSpecifics: hasCancerCondition
        ? {
            hasCancerHistory: true,
            cancerType,
            phase: cancerPhase,
            oncologistName: oncologistName.trim() || undefined,
          }
        : undefined,
    };

    onUpdateUser(updated);
    setAuthSuccessMsg('Your health focus & reasons were saved to your Aura profile!');
    setTimeout(() => {
      setAuthSuccessMsg(null);
      onClose();
    }, 1200);
  };

  // Demo Switch Profiles for instant testing
  const handleQuickSwitchProfile = (profileName: string) => {
    if (profileName === 'Elena (Cancer Care)') {
      const elena: UserProfile = {
        ...user,
        name: 'Elena',
        email: 'elena@cancerjourney.org',
        age: 44,
        conditions: ['Breast Cancer (In-Treatment / Chemo)', 'Anxiety / Depression / PTSD'],
        reasonsForUse: [
          'Cancer Care & Oncology Support',
          'Blood Pressure & Temperature Testing',
          'Daily Water & Prayer / Spiritual Reminders',
          'Breast Cancer Awareness & Self-Exams',
        ],
        primaryConcernsOrProblems:
          'Undergoing chemotherapy cycle 3, monitoring for neutropenic fever, managing fatigue and arm stiffness, and seeking daily prayer comfort.',
        cancerSpecifics: {
          hasCancerHistory: true,
          cancerType: 'Invasive Ductal Breast Cancer (Stage 2)',
          phase: 'in_chemo_radiation',
          chemoCycle: 'Cycle 3 of 6',
          oncologistName: 'Dr. Rebecca Vance',
        },
      };
      onUpdateUser(elena);
      onClose();
    } else if (profileName === 'Maya (PCOS & Vitals)') {
      const maya: UserProfile = {
        ...user,
        name: 'Maya',
        email: 'maya@sisterhood.org',
        age: 32,
        conditions: ['PCOS (Polycystic Ovary Syndrome)', 'Hypertension (High Blood Pressure)'],
        reasonsForUse: [
          'Hormonal Health & PCOS / Endo Comfort',
          'Period, Ovulation & Cycle Tracking',
          'Blood Pressure & Temperature Testing',
          'Daily Water & Prayer / Spiritual Reminders',
        ],
        primaryConcernsOrProblems:
          'Balancing androgen hormones, soothing painful cramps, checking blood pressure spikes and staying hydrated.',
        cancerSpecifics: undefined,
      };
      onUpdateUser(maya);
      onClose();
    } else if (profileName === 'Sarah (Trying to Conceive)') {
      const sarah: UserProfile = {
        ...user,
        name: 'Sarah',
        email: 'sarah@familyjourney.net',
        age: 29,
        conditions: ['Fertility / Trying to Conceive'],
        reasonsForUse: [
          'Fertility & Preparing for Pregnancy',
          'Period, Ovulation & Cycle Tracking',
          'Blood Pressure & Temperature Testing',
          'Daily Water & Prayer / Spiritual Reminders',
        ],
        primaryConcernsOrProblems:
          'Tracking basal body temperature shift around ovulation and praying for a healthy conception.',
        cancerSpecifics: undefined,
      };
      onUpdateUser(sarah);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-[#FAF7F5] w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-rose-100/80 bg-white/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-800 text-sm sm:text-base">
                Profile & Health Intentions
              </h3>
              <p className="text-[11px] text-stone-500">
                Register, login & state why you want to use Aura
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 pt-3 bg-white/60">
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 rounded-2xl">
            <button
              onClick={() => setActiveTab('problems_reasons')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'problems_reasons'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Problems & Reasons</span>
            </button>

            <button
              onClick={() => setActiveTab('account_auth')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'account_auth'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-rose-500" />
              <span>Register / Login</span>
            </button>
          </div>
        </div>

        {/* Notification Banner if Saved */}
        {authSuccessMsg && (
          <div className="mx-4 mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{authSuccessMsg}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* ================= TAB 1: PROBLEMS & REASONS FOR USE ================= */}
          {activeTab === 'problems_reasons' && (
            <form onSubmit={handleSaveReasonsAndProblems} className="space-y-4">
              {/* Introduction Card */}
              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs text-stone-700 space-y-1">
                <span className="font-semibold text-rose-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                  Why Every Woman's Situation is Unique:
                </span>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Stating your challenges lets SheDoctor AI, daily alarms, and health trackers mold themselves to your exact reality — whether you're navigating cancer, balancing hormones, or seeking spiritual serenity.
                </p>
              </div>

              {/* Free-text State Your Problems / Reason */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  State Your Problems or Why You Want to Use Aura:
                </label>
                <textarea
                  rows={3}
                  value={primaryConcerns}
                  onChange={(e) => setPrimaryConcerns(e.target.value)}
                  placeholder="e.g. Recently diagnosed with breast cancer and need chemo tracking; having painful periods and want water/prayer reminders..."
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 text-xs sm:text-sm text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
                <span className="text-[10px] text-stone-400 block">
                  SheDoctor AI and your daily dashboard will refer to this context.
                </span>
              </div>

              {/* Multi-select Reasons */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700">
                  Select Your Main Focus Areas:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {REASONS_FOR_USE_OPTIONS.map((opt) => {
                    const isSelected = selectedReasons.includes(opt.label);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleReason(opt.label)}
                        className={`p-2.5 rounded-2xl border text-left text-xs font-medium transition-all flex items-center gap-2 ${
                          isSelected
                            ? 'bg-rose-50 border-rose-400 text-rose-900 font-semibold shadow-xs'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <span className="text-base">{opt.emoji}</span>
                        <span className="flex-1 truncate">{opt.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-rose-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Medical Conditions Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700">
                  Registered Medical Conditions:
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-stone-50 rounded-2xl border border-stone-200/80">
                  {COMMON_CONDITIONS.map((cond) => {
                    const isSelected = selectedConditions.includes(cond);
                    return (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => toggleCondition(cond)}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-medium border transition-all ${
                          isSelected
                            ? 'bg-rose-500 text-white border-rose-500'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {cond}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Condition Add */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add any other condition..."
                    value={customCondition}
                    onChange={(e) => setCustomCondition(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomCondition}
                    className="px-3 py-1.5 bg-stone-800 text-white rounded-xl text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Specialized Cancer Module Settings if Cancer is Selected */}
              {hasCancerCondition && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-100/90 to-pink-50 border border-rose-300/80 space-y-3">
                  <div className="flex items-center gap-1.5 text-rose-900 font-bold text-xs">
                    <Ribbon className="w-4 h-4 text-rose-600" />
                    <span>Personalized Cancer Care Details</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 uppercase">
                        Cancer Type
                      </label>
                      <input
                        type="text"
                        value={cancerType}
                        onChange={(e) => setCancerType(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-rose-200 bg-white text-stone-800 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 uppercase">
                        Current Phase
                      </label>
                      <select
                        value={cancerPhase}
                        onChange={(e) => setCancerPhase(e.target.value as any)}
                        className="w-full px-2 py-1.5 rounded-xl border border-rose-200 bg-white text-stone-800 text-xs font-medium"
                      >
                        <option value="in_chemo_radiation">Active Chemo / Radiation</option>
                        <option value="post_surgery">Post-Surgical Healing</option>
                        <option value="hormone_therapy">Hormone / Maintenance Therapy</option>
                        <option value="remission_survivor">Remission & Survivorship</option>
                        <option value="newly_diagnosed">Newly Diagnosed / Exploring Care</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase">
                      Primary Oncologist or Care Center (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Rebecca Vance, Memorial Oncology"
                      value={oncologistName}
                      onChange={(e) => setOncologistName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-rose-200 bg-white text-stone-800 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Save Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Save My Focus & Challenges</span>
              </button>
            </form>
          )}

          {/* ================= TAB 2: REGISTER / LOGIN ================= */}
          {activeTab === 'account_auth' && (
            <div className="space-y-4">
              <div className="flex bg-stone-100 p-1 rounded-2xl">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                    authMode === 'login' ? 'bg-white text-stone-800 shadow-xs' : 'text-stone-500'
                  }`}
                >
                  Log In
                </button>
                <button
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                    authMode === 'register' ? 'bg-white text-stone-800 shadow-xs' : 'text-stone-500'
                  }`}
                >
                  Register New
                </button>
              </div>

              {/* Account Form */}
              <div className="bg-white p-4 rounded-3xl border border-stone-100 shadow-sm space-y-3">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Name or Nickname
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Maya"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    4-Digit Security PIN (Protects Your Cycle & Cancer Data)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      maxLength={4}
                      value={loginPin}
                      onChange={(e) => setLoginPin(e.target.value)}
                      placeholder="••••"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-rose-300"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const updatedUser: UserProfile = {
                      ...user,
                      name: name || 'Maya',
                      email: loginEmail,
                      isRegistered: true,
                    };
                    onUpdateUser(updatedUser);
                    setAuthSuccessMsg(
                      authMode === 'register'
                        ? 'Account created and secured on your device!'
                        : 'Welcome back! Signed in to your private health profile.'
                    );
                    setTimeout(() => {
                      setAuthSuccessMsg(null);
                      onClose();
                    }, 1200);
                  }}
                  className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-2xl text-xs shadow-sm transition-all"
                >
                  {authMode === 'register' ? 'Complete Registration' : 'Log In Securely'}
                </button>
              </div>

              {/* Quick Persona Switcher for demonstration */}
              <div className="p-3 bg-stone-100/70 rounded-2xl border border-stone-200/80 space-y-2">
                <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                  Quick Switch Test Profiles:
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickSwitchProfile('Elena (Cancer Care)')}
                    className="p-2 bg-white rounded-xl text-xs text-left font-medium border border-rose-200 hover:border-rose-400 flex items-center justify-between"
                  >
                    <span>🎗️ Elena (Breast Cancer In-Treatment)</span>
                    <span className="text-[10px] text-rose-600 font-semibold">Load</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickSwitchProfile('Maya (PCOS & Vitals)')}
                    className="p-2 bg-white rounded-xl text-xs text-left font-medium border border-stone-200 hover:border-stone-400 flex items-center justify-between"
                  >
                    <span>🌿 Maya (PCOS & Blood Pressure)</span>
                    <span className="text-[10px] text-stone-600 font-semibold">Load</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickSwitchProfile('Sarah (Trying to Conceive)')}
                    className="p-2 bg-white rounded-xl text-xs text-left font-medium border border-stone-200 hover:border-stone-400 flex items-center justify-between"
                  >
                    <span>👶 Sarah (Fertility & Ovulation Tracking)</span>
                    <span className="text-[10px] text-stone-600 font-semibold">Load</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
