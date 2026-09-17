import React, { useState } from 'react';
import {
  User,
  Shield,
  Trash2,
  Download,
  Plus,
  X,
  Check,
  Crown,
  Heart,
  FileText,
  Lock,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { UserProfile } from '../types';
import { COMMON_CONDITIONS } from '../data/defaultData';
import { exportAllUserData, deleteAllUserData } from '../utils/storage';

interface SettingsScreenProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onNavigate: (screen: string) => void;
  onResetApp: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  user,
  onUpdateUser,
  onNavigate,
  onResetApp,
}) => {
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age);
  const [height, setHeight] = useState(user.height);
  const [heightUnit, setHeightUnit] = useState(user.heightUnit);
  const [weightUnit, setWeightUnit] = useState(user.weightUnit);
  const [conditions, setConditions] = useState<string[]>(user.conditions || []);
  const [customCondition, setCustomCondition] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggleCondition = (cond: string) => {
    setConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  };

  const addCustomCondition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCondition.trim()) return;
    if (!conditions.includes(customCondition.trim())) {
      setConditions((prev) => [...prev, customCondition.trim()]);
    }
    setCustomCondition('');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name: name.trim() || 'Maya',
      age: Number(age) || 30,
      height: Number(height) || 165,
      heightUnit,
      weightUnit,
      conditions,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleExportData = () => {
    const jsonStr = exportAllUserData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aura-health-records-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleConfirmDelete = () => {
    deleteAllUserData();
    setShowDeleteModal(false);
    onResetApp();
  };

  return (
    <div className="space-y-5 pb-24 animate-fade-in max-w-md mx-auto">
      {/* Header */}
      <div>
        <h2 className="font-serif text-xl font-bold text-stone-800">
          Profile & Health Settings
        </h2>
        <p className="text-xs text-stone-500">
          Update your medical profile, manage subscription, and protect your privacy.
        </p>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Health profile updated successfully! SheDoctor will adjust its guidance.</span>
        </div>
      )}

      {/* Basic Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100 space-y-4">
        <h3 className="font-serif font-bold text-stone-800 text-sm">
          Basic Details
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Height</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
                <select
                  value={heightUnit}
                  onChange={(e) => setHeightUnit(e.target.value as any)}
                  className="px-2 py-2 rounded-xl border border-stone-200 text-stone-700 bg-stone-50"
                >
                  <option value="cm">cm</option>
                  <option value="in">in</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Preferred Weight Unit</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setWeightUnit('kg')}
                className={`py-2 rounded-xl border font-semibold transition-all ${
                  weightUnit === 'kg'
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-stone-50 text-stone-700 border-stone-200'
                }`}
              >
                Kilograms (kg)
              </button>
              <button
                type="button"
                onClick={() => setWeightUnit('lbs')}
                className={`py-2 rounded-xl border font-semibold transition-all ${
                  weightUnit === 'lbs'
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-stone-50 text-stone-700 border-stone-200'
                }`}
              >
                Pounds (lbs)
              </button>
            </div>
          </div>
        </div>

        {/* Registered Medical Conditions Section */}
        <div className="pt-3 border-t border-stone-100">
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="font-bold text-xs text-stone-800">
              Registered Medical Conditions
            </h4>
            <span className="text-[10px] text-rose-600 font-medium">Personalizes SheDoctor</span>
          </div>
          <p className="text-[11px] text-stone-500 mb-2.5 leading-relaxed">
            Select any conditions you manage. SheDoctor uses these to provide condition-specific lifestyle education, gentle tips, and appointment prep questions.
          </p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {COMMON_CONDITIONS.map((cond) => {
              const isSelected = conditions.includes(cond);
              return (
                <button
                  key={cond}
                  type="button"
                  onClick={() => toggleCondition(cond)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    isSelected
                      ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {cond}
                </button>
              );
            })}
          </div>

          {/* Custom condition input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add another condition (e.g. Migraine, Celiac)..."
              value={customCondition}
              onChange={(e) => setCustomCondition(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 text-xs bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            <button
              type="button"
              onClick={addCustomCondition}
              className="px-3 py-1.5 bg-stone-800 text-white font-semibold text-xs rounded-xl hover:bg-stone-900"
            >
              Add
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl text-xs shadow-sm transition-all"
        >
          Save Profile Updates
        </button>
      </form>

      {/* Subscription Card Shortcut */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-stone-800 text-sm">
              Aura Care Membership ($1/mo)
            </h4>
            <p className="text-xs text-stone-500">
              {user.subscription.status === 'active'
                ? `Active via ${user.subscription.paymentMethod.toUpperCase()}`
                : 'Priced for everyone worldwide'}
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('subscription')}
          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl text-xs transition-colors"
        >
          Manage
        </button>
      </div>

      {/* Privacy & Data Ownership Section */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100 space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-600" />
          <h3 className="font-serif font-bold text-stone-800 text-sm">
            Privacy & Data Sovereignty
          </h3>
        </div>

        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-xs text-emerald-900 leading-relaxed space-y-1">
          <p className="font-semibold">Your Health Data Is Sacred.</p>
          <p className="text-[11px] text-emerald-800">
            • All sensitive health data (vitals, cycle dates, conditions) is encrypted at rest and in transit.<br />
            • <strong>Your health data is NEVER sold, rented, or monetized</strong> to advertisers or third parties.<br />
            • You maintain full right to export or delete your health record at any time.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleExportData}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-stone-50 hover:bg-stone-100 text-stone-700 font-semibold rounded-xl text-xs border border-stone-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Data (JSON)</span>
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-xl text-xs border border-red-200 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete All Data</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-red-100 space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="font-serif font-bold text-center text-stone-800 text-base">
              Delete Account & Health Data?
            </h3>

            <p className="text-xs text-stone-600 text-center leading-relaxed">
              This action is permanent and immediate. All your logged vitals, cycle logs, reminders, and profile details will be completely wiped from this device.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs shadow-sm transition-all"
              >
                Yes, Wipe Everything
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
