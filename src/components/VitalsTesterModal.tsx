import React, { useState, useEffect } from 'react';
import {
  X,
  HeartPulse,
  Thermometer,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Info,
  Check,
  Flame,
} from 'lucide-react';
import { UserProfile, VitalRecord } from '../types';
import {
  evaluateBloodPressure,
  evaluateTemperature,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
} from '../utils/healthCalculators';

interface VitalsTesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSaveVital: (vital: VitalRecord) => void;
  initialMode?: 'bp' | 'temp';
}

export const VitalsTesterModal: React.FC<VitalsTesterModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveVital,
  initialMode = 'bp',
}) => {
  const [activeTester, setActiveTester] = useState<'bp' | 'temp'>(initialMode);

  // Sync initialMode when opened
  useEffect(() => {
    if (isOpen) {
      setActiveTester(initialMode);
    }
  }, [isOpen, initialMode]);

  // Blood Pressure Tester State
  const [bpStep, setBpStep] = useState<'prep' | 'testing' | 'result'>('prep');
  const [bpProgress, setBpProgress] = useState<number>(0);
  const [liveCuffPressure, setLiveCuffPressure] = useState<number>(0);
  const [systolicResult, setSystolicResult] = useState<number>(118);
  const [diastolicResult, setDiastolicResult] = useState<number>(78);
  const [pulseResult, setPulseResult] = useState<number>(72);
  const [bpManualOverride, setBpManualOverride] = useState<boolean>(false);

  // Temperature Tester State
  const [tempStep, setTempStep] = useState<'prep' | 'testing' | 'result'>('prep');
  const [tempMethod, setTempMethod] = useState<'forehead' | 'oral' | 'axillary'>('forehead');
  const [tempProgress, setTempProgress] = useState<number>(0);
  const [tempCelsiusResult, setTempCelsiusResult] = useState<number>(36.6);
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>(user.temperatureUnit || 'C');

  // Cancer detection for high-priority oncology fever warnings
  const isCancerPatient =
    user.conditions.some((c) => c.toLowerCase().includes('cancer')) ||
    Boolean(user.cancerSpecifics?.hasCancerHistory);

  if (!isOpen) return null;

  // Run Blood Pressure Test Simulation
  const startBPTest = () => {
    setBpStep('testing');
    setBpProgress(0);
    setLiveCuffPressure(60);

    // Realistic inflation & deflation sequence
    const interval = setInterval(() => {
      setBpProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setBpStep('result');
          return 100;
        }

        const next = prev + 2;
        // Inflaton up to 165 then deflate
        if (next < 40) {
          setLiveCuffPressure(60 + Math.round((next / 40) * 105));
        } else {
          // Deflating
          const deflationRatio = (next - 40) / 60;
          setLiveCuffPressure(Math.round(165 - deflationRatio * 95));
        }

        return next;
      });
    }, 80);
  };

  // Run Temperature Scan Simulation
  const startTempTest = () => {
    setTempStep('testing');
    setTempProgress(0);

    const interval = setInterval(() => {
      setTempProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Standard healthy body temp with subtle natural variation
          const baseTemps = [36.5, 36.6, 36.7, 36.8, 36.4, 36.9];
          const chosen = baseTemps[Math.floor(Math.random() * baseTemps.length)];
          setTempCelsiusResult(chosen);
          setTempStep('result');
          return 100;
        }
        return prev + 5;
      });
    }, 60);
  };

  const handleSaveBP = () => {
    const alertInfo = evaluateBloodPressure(systolicResult, diastolicResult);
    const now = new Date();
    const record: VitalRecord = {
      id: 'vital_bp_' + Date.now(),
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      systolic: systolicResult,
      diastolic: diastolicResult,
      pulse: pulseResult,
      notes: `Tester recorded: ${systolicResult}/${diastolicResult} mmHg, ${pulseResult} bpm`,
      alert: alertInfo,
    };

    onSaveVital(record);
    onClose();
  };

  const handleSaveTemp = () => {
    const alertInfo = evaluateTemperature(tempCelsiusResult, isCancerPatient);
    const now = new Date();
    const displayVal =
      tempUnit === 'F'
        ? `${celsiusToFahrenheit(tempCelsiusResult)}°F`
        : `${tempCelsiusResult}°C`;

    const record: VitalRecord = {
      id: 'vital_temp_' + Date.now(),
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      temperature: tempCelsiusResult,
      temperatureMethod: tempMethod,
      notes: `Temperature check (${tempMethod}): ${displayVal}`,
      alert: alertInfo,
    };

    onSaveVital(record);
    onClose();
  };

  // BP evaluation result
  const bpAlert = evaluateBloodPressure(systolicResult, diastolicResult);
  const tempAlert = evaluateTemperature(tempCelsiusResult, isCancerPatient);

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-[#FAF7F5] w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-rose-100/80 bg-white/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              {activeTester === 'bp' ? (
                <HeartPulse className="w-4 h-4" />
              ) : (
                <Thermometer className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-800 text-sm sm:text-base">
                {activeTester === 'bp'
                  ? 'Blood Pressure Tester & Monitor'
                  : 'Body Temperature & Fever Tester'}
              </h3>
              <p className="text-[11px] text-stone-500">
                Gentle clinical guidance for women & condition care
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

        {/* Tester Mode Selector */}
        <div className="px-4 pt-3 bg-white/50">
          <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-2xl">
            <button
              onClick={() => {
                setActiveTester('bp');
                setBpStep('prep');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTester === 'bp'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <HeartPulse className="w-4 h-4 text-rose-500" />
              <span>Blood Pressure</span>
            </button>

            <button
              onClick={() => {
                setActiveTester('temp');
                setTempStep('prep');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTester === 'temp'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Thermometer className="w-4 h-4 text-rose-500" />
              <span>Temperature</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* ================= BLOOD PRESSURE TESTER ================= */}
          {activeTester === 'bp' && (
            <div className="space-y-4">
              {/* Step 1: Guided Pre-check Posture */}
              {bpStep === 'prep' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-rose-800 font-semibold text-xs uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-rose-600" />
                      <span>Comfortable Posture Checklist</span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      For accurate readings without false elevation, take 2 quiet breaths before testing:
                    </p>
                    <ul className="text-xs text-stone-700 space-y-1.5 pl-1 pt-1">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Sit comfortably with back supported and feet flat on floor.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Rest your arm on a table so your elbow is at heart level.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Refrain from speaking or looking at stressful notifications during the test.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Manual entry toggle if user already measured with home cuff */}
                  <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-700">
                        Have a home cuff reading ready to enter?
                      </span>
                      <button
                        type="button"
                        onClick={() => setBpManualOverride(!bpManualOverride)}
                        className="text-xs text-rose-600 font-medium underline"
                      >
                        {bpManualOverride ? 'Use guided simulation' : 'Enter manual numbers'}
                      </button>
                    </div>

                    {bpManualOverride && (
                      <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-stone-100">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase">
                            Systolic
                          </label>
                          <input
                            type="number"
                            value={systolicResult}
                            onChange={(e) => setSystolicResult(Number(e.target.value) || 120)}
                            className="w-full px-2.5 py-2 rounded-xl border border-stone-200 text-stone-800 text-sm font-bold text-center"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase">
                            Diastolic
                          </label>
                          <input
                            type="number"
                            value={diastolicResult}
                            onChange={(e) => setDiastolicResult(Number(e.target.value) || 80)}
                            className="w-full px-2.5 py-2 rounded-xl border border-stone-200 text-stone-800 text-sm font-bold text-center"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase">
                            Pulse
                          </label>
                          <input
                            type="number"
                            value={pulseResult}
                            onChange={(e) => setPulseResult(Number(e.target.value) || 72)}
                            className="w-full px-2.5 py-2 rounded-xl border border-stone-200 text-stone-800 text-sm font-bold text-center"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (bpManualOverride) {
                        setBpStep('result');
                      } else {
                        startBPTest();
                      }
                    }}
                    className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{bpManualOverride ? 'Analyze My Reading' : 'Start Guided BP Test'}</span>
                  </button>
                </div>
              )}

              {/* Step 2: Testing Animation */}
              {bpStep === 'testing' && (
                <div className="text-center py-6 space-y-5 animate-fade-in">
                  <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                    {/* Pulsing circular rings */}
                    <div className="absolute inset-0 rounded-full bg-rose-200/40 animate-ping opacity-75" />
                    <div className="absolute inset-2 rounded-full bg-rose-100/60" />
                    <div className="relative z-10 flex flex-col items-center">
                      <HeartPulse className="w-8 h-8 text-rose-600 animate-bounce" />
                      <span className="font-serif text-2xl font-bold text-stone-800 mt-1">
                        {liveCuffPressure}
                      </span>
                      <span className="text-[10px] text-stone-500 uppercase tracking-wider">
                        mmHg
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-stone-800 text-base">
                      Measuring Pulse & Arterial Pressure...
                    </h4>
                    <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1 leading-relaxed">
                      Stay quiet and breathe gently. Cuff is sensing your systolic and diastolic rhythm.
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden max-w-xs mx-auto">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all duration-150"
                      style={{ width: `${bpProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Clinical Result Card */}
              {bpStep === 'result' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-white rounded-3xl p-5 border border-stone-100 shadow-sm text-center">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-stone-500 block">
                      Blood Pressure Test Result
                    </span>
                    <div className="flex items-baseline justify-center gap-1.5 mt-1">
                      <span className="font-serif text-4xl font-bold text-stone-800">
                        {systolicResult}/{diastolicResult}
                      </span>
                      <span className="text-xs text-stone-500 font-medium">mmHg</span>
                    </div>

                    <div className="flex items-center justify-center gap-4 mt-2 text-xs text-stone-600">
                      <span className="flex items-center gap-1">
                        <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                        Pulse: <strong className="text-stone-800">{pulseResult} bpm</strong>
                      </span>
                    </div>

                    {/* Status badge */}
                    <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold">
                      {systolicResult < 120 && diastolicResult < 80 ? (
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full">
                          ✓ Optimal & Desirable Baseline
                        </span>
                      ) : systolicResult <= 129 && diastolicResult < 80 ? (
                        <span className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full">
                          ⚠️ Elevated (Pre-hypertension)
                        </span>
                      ) : (
                        <span className="bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1 rounded-full">
                          ⚠️ High Range (Review with Doctor)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Condition Specific Guidance */}
                  {bpAlert && (
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        {bpAlert.title}
                      </p>
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        {bpAlert.message}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => setBpStep('prep')}
                      className="py-3 px-4 rounded-2xl border border-stone-200 text-stone-700 font-semibold text-xs hover:bg-stone-50 flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retest</span>
                    </button>

                    <button
                      onClick={handleSaveBP}
                      className="py-3 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save to My Vitals</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TEMPERATURE TESTER ================= */}
          {activeTester === 'temp' && (
            <div className="space-y-4">
              {/* Step 1: Prep & Method Selection */}
              {tempStep === 'prep' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-stone-700">
                      Select Measurement Mode:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'forehead', label: 'Forehead' },
                        { id: 'oral', label: 'Oral' },
                        { id: 'axillary', label: 'Underarm' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setTempMethod(m.id as any)}
                          className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                            tempMethod === m.id
                              ? 'bg-rose-50 border-rose-400 text-rose-800 font-bold'
                              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Temperature Unit selection */}
                  <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-stone-100">
                    <span className="text-xs font-semibold text-stone-700">Display Unit:</span>
                    <div className="flex gap-1 bg-stone-100 p-1 rounded-xl">
                      <button
                        onClick={() => setTempUnit('C')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          tempUnit === 'C' ? 'bg-white text-rose-700 shadow-xs' : 'text-stone-500'
                        }`}
                      >
                        °C
                      </button>
                      <button
                        onClick={() => setTempUnit('F')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          tempUnit === 'F' ? 'bg-white text-rose-700 shadow-xs' : 'text-stone-500'
                        }`}
                      >
                        °F
                      </button>
                    </div>
                  </div>

                  {/* Oncology Awareness Notice if patient has cancer */}
                  {isCancerPatient && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
                      <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Oncology Fever Watch Active:</span>
                        <span className="text-[11px] text-rose-800 leading-relaxed">
                          For women managing or recovering from cancer treatment, any reading ≥38.0°C (100.4°F) must be evaluated promptly to guard against neutropenic infection.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Slider to adjust or manual input */}
                  <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-700">Current Reading Adjustment:</span>
                      <span className="font-serif font-bold text-stone-800 text-sm">
                        {tempUnit === 'F'
                          ? `${celsiusToFahrenheit(tempCelsiusResult)}°F`
                          : `${tempCelsiusResult.toFixed(1)}°C`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="35.0"
                      max="40.5"
                      step="0.1"
                      value={tempCelsiusResult}
                      onChange={(e) => setTempCelsiusResult(parseFloat(e.target.value))}
                      className="w-full accent-rose-500"
                    />
                    <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                      <span>35.0°C (95°F)</span>
                      <span>Normal (36.6°C / 98°F)</span>
                      <span>Fever (38.5°C+ / 101°F)</span>
                    </div>
                  </div>

                  <button
                    onClick={startTempTest}
                    className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Start Temperature Scan</span>
                  </button>
                </div>
              )}

              {/* Step 2: Testing Animation */}
              {tempStep === 'testing' && (
                <div className="text-center py-6 space-y-5 animate-fade-in">
                  <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-rose-100/60 animate-pulse" />
                    <div className="relative z-10 flex flex-col items-center">
                      <Thermometer className="w-8 h-8 text-rose-600 animate-bounce" />
                      <span className="font-serif text-xl font-bold text-stone-800 mt-1">
                        Scanning...
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-stone-800 text-base">
                      Checking Thermal Sensor ({tempMethod})...
                    </h4>
                    <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1 leading-relaxed">
                      Please hold sensor steady until tone confirms steady reading.
                    </p>
                  </div>

                  <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden max-w-xs mx-auto">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all duration-150"
                      style={{ width: `${tempProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Result */}
              {tempStep === 'result' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-white rounded-3xl p-5 border border-stone-100 shadow-sm text-center">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-stone-500 block">
                      Body Temperature Result ({tempMethod})
                    </span>
                    <div className="flex items-baseline justify-center gap-1 mt-1">
                      <span className="font-serif text-4xl font-bold text-stone-800">
                        {tempUnit === 'F'
                          ? celsiusToFahrenheit(tempCelsiusResult)
                          : tempCelsiusResult.toFixed(1)}
                      </span>
                      <span className="text-lg text-stone-500 font-serif">°{tempUnit}</span>
                    </div>

                    <span className="text-xs text-stone-500 block mt-0.5">
                      Equivalent:{' '}
                      {tempUnit === 'F'
                        ? `${tempCelsiusResult.toFixed(1)}°C`
                        : `${celsiusToFahrenheit(tempCelsiusResult)}°F`}
                    </span>

                    {/* Status Badge */}
                    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold">
                      {tempCelsiusResult >= 38.0 ? (
                        <span className="bg-rose-100 text-rose-800 border border-rose-200 px-3 py-1 rounded-full flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-rose-600" />
                          Fever Detected ({tempCelsiusResult.toFixed(1)}°C)
                        </span>
                      ) : tempCelsiusResult >= 37.3 ? (
                        <span className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full">
                          Low-Grade Warmth
                        </span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full">
                          ✓ Normal Body Temperature
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Oncology or General Alert Card */}
                  {tempAlert && (
                    <div
                      className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                        tempAlert.level === 'urgent'
                          ? 'bg-rose-50 border-rose-300 text-rose-950 font-medium'
                          : 'bg-amber-50 border-amber-200 text-amber-900'
                      }`}
                    >
                      <p className="font-bold flex items-center gap-1.5">
                        <AlertTriangle
                          className={`w-4 h-4 ${
                            tempAlert.level === 'urgent' ? 'text-rose-600' : 'text-amber-600'
                          }`}
                        />
                        {tempAlert.title}
                      </p>
                      <p className="text-[11px] leading-relaxed opacity-95">
                        {tempAlert.message}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => setTempStep('prep')}
                      className="py-3 px-4 rounded-2xl border border-stone-200 text-stone-700 font-semibold text-xs hover:bg-stone-50 flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retest</span>
                    </button>

                    <button
                      onClick={handleSaveTemp}
                      className="py-3 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save to My Vitals</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
