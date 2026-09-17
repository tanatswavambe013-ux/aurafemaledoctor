/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { QuickLogModal } from './components/QuickLogModal';
import { CameraPulseScanner } from './components/CameraPulseScanner';
import { BloodGlucoseModal } from './components/BloodGlucoseModal';
import { VitalsTesterModal } from './components/VitalsTesterModal';
import { LatePeriodGuideModal } from './components/LatePeriodGuideModal';
import { HomeScreen } from './screens/HomeScreen';
import { VitalsScreen } from './screens/VitalsScreen';
import { CycleScreen } from './screens/CycleScreen';
import { AwarenessScreen } from './screens/AwarenessScreen';
import { ChatScreen } from './screens/ChatScreen';
import { RemindersScreen } from './screens/RemindersScreen';
import { SubscriptionScreen } from './screens/SubscriptionScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { UserProfile, VitalRecord, CycleRecord, ReminderItem } from './types';
import { calculateCyclePredictions } from './utils/healthCalculators';
import {
  loadUserProfile,
  saveUserProfile,
  loadVitals,
  saveVitals,
  loadCycles,
  saveCycles,
  loadReminders,
  saveReminders,
  getTodayMood,
  setTodayMood,
} from './utils/storage';

export default function App() {
  const [user, setUser] = useState<UserProfile>(() => loadUserProfile());
  const [vitals, setVitals] = useState<VitalRecord[]>(() => loadVitals());
  const [cycles, setCycles] = useState<CycleRecord[]>(() => loadCycles());
  const [reminders, setReminders] = useState<ReminderItem[]>(() => loadReminders());
  const [currentMood, setCurrentMoodState] = useState<string>(() => getTodayMood());

  const [activeScreen, setActiveScreen] = useState<string>('home');
  const [isQuickLogOpen, setIsQuickLogOpen] = useState<boolean>(false);
  const [isPulseScannerOpen, setIsPulseScannerOpen] = useState<boolean>(false);
  const [isGlucoseModalOpen, setIsGlucoseModalOpen] = useState<boolean>(false);
  const [isTesterModalOpen, setIsTesterModalOpen] = useState<boolean>(false);
  const [isLatePeriodGuideOpen, setIsLatePeriodGuideOpen] = useState<boolean>(false);
  const [testerInitialMode, setTesterInitialMode] = useState<'bp' | 'temp'>('bp');
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string>('');
  const [isOnboarding, setIsOnboarding] = useState<boolean>(() => !user.isRegistered);

  const cyclePredictions = calculateCyclePredictions(cycles, user.cycleLength, user.periodDuration);

  // Sync state to storage
  useEffect(() => {
    saveUserProfile(user);
  }, [user]);

  useEffect(() => {
    saveVitals(vitals);
  }, [vitals]);

  useEffect(() => {
    saveCycles(cycles);
  }, [cycles]);

  useEffect(() => {
    saveReminders(reminders);
  }, [reminders]);

  const handleMoodSelect = (m: string) => {
    setCurrentMoodState(m);
    setTodayMood(m);
  };

  const handleSaveVital = (newVital: VitalRecord) => {
    setVitals((prev) => [...prev, newVital]);
  };

  const handleDeleteVital = (id: string) => {
    setVitals((prev) => prev.filter((v) => v.id !== id));
  };

  const handleSaveCycle = (newCycle: CycleRecord) => {
    setCycles((prev) => [...prev, newCycle]);
  };

  const handleDeleteCycle = (id: string) => {
    setCycles((prev) => prev.filter((c) => c.id !== id));
  };

  const handleToggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleAddReminder = (newReminder: ReminderItem) => {
    setReminders((prev) => [...prev, newReminder]);
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateUser = (updated: UserProfile) => {
    setUser(updated);
  };

  const handleResetApp = () => {
    const freshUser = loadUserProfile();
    setUser(freshUser);
    setVitals(loadVitals());
    setCycles(loadCycles());
    setReminders(loadReminders());
    setIsOnboarding(true);
    setActiveScreen('home');
  };

  const handleOnboardingComplete = (newUser: UserProfile) => {
    setUser(newUser);
    saveUserProfile(newUser);
    setIsOnboarding(false);
    setActiveScreen('home');
  };

  if (isOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  const enabledRemindersCount = reminders.filter((r) => r.enabled).length;

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-stone-800 flex flex-col antialiased selection:bg-rose-100 selection:text-rose-900">
      {/* Header */}
      <Header
        user={user}
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
      />

      {/* Main Content Area framed for mobile-first experience */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-3 pb-20">
        {activeScreen === 'home' && (
          <HomeScreen
            user={user}
            vitals={vitals}
            cycles={cycles}
            reminders={reminders}
            currentMood={currentMood}
            onSelectMood={handleMoodSelect}
            onOpenQuickLog={() => setIsQuickLogOpen(true)}
            onNavigate={setActiveScreen}
            onToggleReminder={handleToggleReminder}
            onUpdateUser={handleUpdateUser}
            onAddReminder={handleAddReminder}
            onOpenPulseScanner={() => setIsPulseScannerOpen(true)}
            onOpenGlucoseModal={() => setIsGlucoseModalOpen(true)}
            onOpenTester={(mode) => {
              setTesterInitialMode(mode);
              setIsTesterModalOpen(true);
            }}
            onOpenLatePeriodGuide={() => setIsLatePeriodGuideOpen(true)}
          />
        )}

        {activeScreen === 'vitals' && (
          <VitalsScreen
            vitals={vitals}
            user={user}
            onAddVital={handleSaveVital}
            onDeleteVital={handleDeleteVital}
            onOpenQuickLog={() => setIsQuickLogOpen(true)}
            onOpenTester={(mode) => {
              setTesterInitialMode(mode);
              setIsTesterModalOpen(true);
            }}
            onOpenPulseScanner={() => setIsPulseScannerOpen(true)}
            onOpenGlucoseModal={() => setIsGlucoseModalOpen(true)}
          />
        )}

        {activeScreen === 'cycle' && (
          <CycleScreen
            cycles={cycles}
            user={user}
            onSaveCycle={handleSaveCycle}
            onDeleteCycle={handleDeleteCycle}
            onOpenQuickLog={() => setIsQuickLogOpen(true)}
            onOpenLatePeriodGuide={() => setIsLatePeriodGuideOpen(true)}
          />
        )}

        {activeScreen === 'awareness' && (
          <AwarenessScreen
            user={user}
            onUpdateUser={handleUpdateUser}
            onNavigate={setActiveScreen}
          />
        )}

        {activeScreen === 'chat' && (
          <ChatScreen
            user={user}
            currentMood={currentMood}
            initialPrompt={chatInitialPrompt}
            onClearInitialPrompt={() => setChatInitialPrompt('')}
          />
        )}

        {activeScreen === 'reminders' && (
          <RemindersScreen
            reminders={reminders}
            onToggleReminder={handleToggleReminder}
            onAddReminder={handleAddReminder}
            onDeleteReminder={handleDeleteReminder}
          />
        )}

        {activeScreen === 'subscription' && (
          <SubscriptionScreen
            user={user}
            onUpdateUser={handleUpdateUser}
            onBack={() => setActiveScreen('home')}
          />
        )}

        {activeScreen === 'settings' && (
          <SettingsScreen
            user={user}
            onUpdateUser={handleUpdateUser}
            onNavigate={setActiveScreen}
            onResetApp={handleResetApp}
          />
        )}
      </main>

      {/* Quick Log Modal */}
      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        user={user}
        onSaveVital={handleSaveVital}
        onSaveCycle={handleSaveCycle}
      />

      {/* Optical Camera PPG Pulse Scanner */}
      <CameraPulseScanner
        isOpen={isPulseScannerOpen}
        onClose={() => setIsPulseScannerOpen(false)}
        onSavePulse={(partialVital) => {
          handleSaveVital({
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            ...partialVital,
          });
          setIsPulseScannerOpen(false);
        }}
      />

      {/* Clinical Blood Sugar / Glucose Logger */}
      <BloodGlucoseModal
        isOpen={isGlucoseModalOpen}
        onClose={() => setIsGlucoseModalOpen(false)}
        user={user}
        onSaveGlucose={(partialVital) => {
          handleSaveVital({
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            ...partialVital,
          });
          setIsGlucoseModalOpen(false);
        }}
      />

      {/* Guided Blood Pressure & Temperature Tester */}
      <VitalsTesterModal
        isOpen={isTesterModalOpen}
        onClose={() => setIsTesterModalOpen(false)}
        user={user}
        onSaveVital={handleSaveVital}
        initialMode={testerInitialMode}
      />

      {/* Late Period Encouragement & Step-by-Step Guide Modal */}
      <LatePeriodGuideModal
        isOpen={isLatePeriodGuideOpen}
        onClose={() => setIsLatePeriodGuideOpen(false)}
        user={user}
        cycles={cycles}
        daysLateDetected={cyclePredictions.daysLate || 0}
        onOpenChatWithPrompt={(prompt) => {
          setChatInitialPrompt(prompt);
          setActiveScreen('chat');
        }}
      />

      {/* Persistent Bottom Navigation */}
      <BottomNav
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
        pendingRemindersCount={enabledRemindersCount}
      />
    </div>
  );
}
