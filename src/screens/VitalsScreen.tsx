import React, { useState } from 'react';
import {
  Activity,
  Plus,
  Scale,
  HeartPulse,
  TrendingUp,
  AlertTriangle,
  Info,
  Calendar,
  Trash2,
  CheckCircle,
  Thermometer,
  Flame,
  Play,
  ShieldAlert,
  Camera,
  Droplet,
  Heart,
  HelpCircle,
} from 'lucide-react';
import { VitalRecord, UserProfile } from '../types';
import {
  evaluateBloodPressure,
  evaluateTemperature,
  evaluateBloodGlucose,
  celsiusToFahrenheit,
} from '../utils/healthCalculators';

interface VitalsScreenProps {
  vitals: VitalRecord[];
  user: UserProfile;
  onAddVital: (vital: VitalRecord) => void;
  onDeleteVital: (id: string) => void;
  onOpenQuickLog: () => void;
  onOpenTester?: (mode: 'bp' | 'temp') => void;
  onOpenPulseScanner?: () => void;
  onOpenGlucoseModal?: () => void;
}

export const VitalsScreen: React.FC<VitalsScreenProps> = ({
  vitals,
  user,
  onAddVital,
  onDeleteVital,
  onOpenQuickLog,
  onOpenTester,
  onOpenPulseScanner,
  onOpenGlucoseModal,
}) => {
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [activeTab, setActiveTab] = useState<'bp' | 'temp' | 'glucose' | 'weight'>('bp');
  const [showSensorExplainer, setShowSensorExplainer] = useState(false);

  // Filter vitals based on range
  const sortedVitals = [...vitals].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Take last 7 for weekly or last 14-30 for monthly
  const displayedVitals =
    viewMode === 'weekly' ? sortedVitals.slice(-7) : sortedVitals.slice(-14);

  // Calculate statistics
  const bpReadings = displayedVitals.filter((v) => v.systolic && v.diastolic);
  const avgSystolic = bpReadings.length
    ? Math.round(bpReadings.reduce((sum, v) => sum + (v.systolic || 0), 0) / bpReadings.length)
    : null;
  const avgDiastolic = bpReadings.length
    ? Math.round(bpReadings.reduce((sum, v) => sum + (v.diastolic || 0), 0) / bpReadings.length)
    : null;

  const weightReadings = displayedVitals.filter((v) => v.weight);
  const avgWeight = weightReadings.length
    ? (weightReadings.reduce((sum, v) => sum + (v.weight || 0), 0) / weightReadings.length).toFixed(1)
    : null;

  const tempReadings = displayedVitals.filter((v) => v.temperature !== undefined);
  const avgTemp = tempReadings.length
    ? (tempReadings.reduce((sum, v) => sum + (v.temperature || 0), 0) / tempReadings.length).toFixed(1)
    : null;

  const glucoseReadings = displayedVitals.filter((v) => v.bloodGlucose !== undefined);
  const avgGlucose = glucoseReadings.length
    ? Math.round(glucoseReadings.reduce((sum, v) => sum + (v.bloodGlucose || 0), 0) / glucoseReadings.length)
    : null;

  // SVG Chart Dimensions
  const chartWidth = 320;
  const chartHeight = 160;
  const padding = 28;

  // Render BP SVG Chart
  const renderBPChart = () => {
    if (bpReadings.length < 2) {
      return (
        <div className="h-40 flex flex-col items-center justify-center text-center p-4 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
          <HeartPulse className="w-8 h-8 text-rose-300 mb-1" />
          <p className="text-xs text-stone-600 font-medium">Log at least 2 readings to see BP trends</p>
          <button
            onClick={onOpenQuickLog}
            className="mt-2 text-xs font-semibold text-rose-600 underline"
          >
            Log reading now
          </button>
        </div>
      );
    }

    const minSys = 90;
    const maxSys = 170;
    const getY = (val: number) => {
      const clamped = Math.max(minSys, Math.min(maxSys, val));
      const ratio = (clamped - minSys) / (maxSys - minSys);
      return chartHeight - padding - ratio * (chartHeight - 2 * padding);
    };

    const getX = (idx: number) => {
      return padding + (idx / (bpReadings.length - 1)) * (chartWidth - 2 * padding);
    };

    const systolicPoints = bpReadings.map((v, i) => `${getX(i)},${getY(v.systolic || 120)}`).join(' ');
    const diastolicPoints = bpReadings.map((v, i) => `${getX(i)},${getY(v.diastolic || 80)}`).join(' ');

    const normalBandTop = getY(120);
    const normalBandBottom = getY(80);

    return (
      <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold text-rose-600">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Systolic
            </span>
            <span className="flex items-center gap-1 font-semibold text-amber-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Diastolic
            </span>
          </div>
          <span className="text-[10px] text-stone-400">Green = Desirable Range (&lt;120/80)</span>
        </div>

        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          {/* Healthy zone shading */}
          <rect
            x={padding}
            y={normalBandTop}
            width={chartWidth - 2 * padding}
            height={normalBandBottom - normalBandTop}
            fill="#ECFDF5"
            opacity="0.7"
            rx="4"
          />

          {/* Guidelines */}
          <line
            x1={padding}
            y1={normalBandTop}
            x2={chartWidth - padding}
            y2={normalBandTop}
            stroke="#10B981"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
          <text
            x={chartWidth - padding + 4}
            y={normalBandTop + 3}
            fontSize="8"
            fill="#10B981"
            fontWeight="bold"
          >
            120
          </text>

          <line
            x1={padding}
            y1={normalBandBottom}
            x2={chartWidth - padding}
            y2={normalBandBottom}
            stroke="#10B981"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
          <text
            x={chartWidth - padding + 4}
            y={normalBandBottom + 3}
            fontSize="8"
            fill="#10B981"
            fontWeight="bold"
          >
            80
          </text>

          {/* Systolic Polyline */}
          <polyline
            fill="none"
            stroke="#F43F5E"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={systolicPoints}
          />

          {/* Diastolic Polyline */}
          <polyline
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={diastolicPoints}
          />

          {/* Dots */}
          {bpReadings.map((v, i) => (
            <g key={v.id}>
              <circle
                cx={getX(i)}
                cy={getY(v.systolic || 120)}
                r="4"
                fill="#FFF"
                stroke="#F43F5E"
                strokeWidth="2"
              />
              <circle
                cx={getX(i)}
                cy={getY(v.diastolic || 80)}
                r="4"
                fill="#FFF"
                stroke="#F59E0B"
                strokeWidth="2"
              />
              <text
                x={getX(i)}
                y={chartHeight - 8}
                fontSize="8"
                fill="#78716C"
                textAnchor="middle"
              >
                {v.date.slice(5)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  // Render Weight SVG Chart
  const renderWeightChart = () => {
    if (weightReadings.length < 2) {
      return (
        <div className="h-40 flex flex-col items-center justify-center text-center p-4 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
          <Scale className="w-8 h-8 text-rose-300 mb-1" />
          <p className="text-xs text-stone-600 font-medium">Log at least 2 weight readings to see trends</p>
          <button
            onClick={onOpenQuickLog}
            className="mt-2 text-xs font-semibold text-rose-600 underline"
          >
            Log reading now
          </button>
        </div>
      );
    }

    const weights = weightReadings.map((v) => v.weight || 60);
    const minW = Math.min(...weights) - 1.5;
    const maxW = Math.max(...weights) + 1.5;

    const getY = (val: number) => {
      const ratio = (val - minW) / (maxW - minW || 1);
      return chartHeight - padding - ratio * (chartHeight - 2 * padding);
    };

    const getX = (idx: number) => {
      return padding + (idx / (weightReadings.length - 1)) * (chartWidth - 2 * padding);
    };

    const points = weightReadings.map((v, i) => `${getX(i)},${getY(v.weight || 60)}`).join(' ');

    return (
      <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-rose-600 flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Weight ({user.weightUnit})
          </span>
          <span className="text-[10px] text-stone-400">Steady baseline trend</span>
        </div>

        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          {/* Baseline grid */}
          <line
            x1={padding}
            y1={chartHeight / 2}
            x2={chartWidth - padding}
            y2={chartHeight / 2}
            stroke="#E7E5E4"
            strokeDasharray="3 3"
            strokeWidth="1"
          />

          {/* Polyline */}
          <polyline
            fill="none"
            stroke="#E11D48"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Dots */}
          {weightReadings.map((v, i) => (
            <g key={v.id}>
              <circle
                cx={getX(i)}
                cy={getY(v.weight || 60)}
                r="4.5"
                fill="#FFF"
                stroke="#E11D48"
                strokeWidth="2"
              />
              <text
                x={getX(i)}
                y={getY(v.weight || 60) - 8}
                fontSize="9"
                fontWeight="bold"
                fill="#44403C"
                textAnchor="middle"
              >
                {v.weight}
              </text>
              <text
                x={getX(i)}
                y={chartHeight - 8}
                fontSize="8"
                fill="#78716C"
                textAnchor="middle"
              >
                {v.date.slice(5)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  // Render Temperature SVG Chart
  const renderTempChart = () => {
    if (tempReadings.length < 2) {
      return (
        <div className="h-40 flex flex-col items-center justify-center text-center p-4 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
          <Thermometer className="w-8 h-8 text-rose-300 mb-1" />
          <p className="text-xs text-stone-600 font-medium">Log at least 2 temperature checks to see trends</p>
          <button
            onClick={() => onOpenTester ? onOpenTester('temp') : onOpenQuickLog()}
            className="mt-2 text-xs text-rose-600 font-semibold underline"
          >
            Launch Temperature Tester
          </button>
        </div>
      );
    }

    const minTemp = 35.5;
    const maxTemp = 39.0;
    const getY = (t: number) =>
      chartHeight - padding - ((t - minTemp) / (maxTemp - minTemp)) * (chartHeight - 2 * padding);
    const getX = (index: number) =>
      padding + (index / (tempReadings.length - 1)) * (chartWidth - 2 * padding);

    const tempPoints = tempReadings
      .map((v, i) => `${getX(i)},${getY(v.temperature || 36.6)}`)
      .join(' ');

    return (
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-stone-100 overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-semibold text-stone-700">
              Body Temperature Range (Normal: 36.1 - 37.2°C)
            </span>
          </div>
          <span className="text-[10px] text-stone-400 font-mono">°C</span>
        </div>

        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-40">
          {/* Reference Line for Normal 37.0°C */}
          <line
            x1={padding}
            y1={getY(37.0)}
            x2={chartWidth - padding}
            y2={getY(37.0)}
            stroke="#FEE2E2"
            strokeDasharray="4 4"
            strokeWidth="1.5"
          />
          <text
            x={chartWidth - padding}
            y={getY(37.0) - 4}
            fontSize="8"
            fill="#F43F5E"
            textAnchor="end"
          >
            37.0°C baseline
          </text>

          {/* Fever line 38.0°C */}
          <line
            x1={padding}
            y1={getY(38.0)}
            x2={chartWidth - padding}
            y2={getY(38.0)}
            stroke="#FDA4AF"
            strokeDasharray="2 2"
            strokeWidth="1.5"
          />
          <text
            x={chartWidth - padding}
            y={getY(38.0) - 4}
            fontSize="8"
            fill="#E11D48"
            textAnchor="end"
          >
            38.0°C fever alert
          </text>

          {/* Temp Polyline */}
          <polyline
            fill="none"
            stroke="#E11D48"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={tempPoints}
          />

          {/* Points */}
          {tempReadings.map((v, i) => {
            const isFever = (v.temperature || 0) >= 38.0;
            return (
              <g key={v.id}>
                <circle
                  cx={getX(i)}
                  cy={getY(v.temperature || 36.6)}
                  r={isFever ? '5' : '4'}
                  fill={isFever ? '#E11D48' : '#BE123C'}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                <text
                  x={getX(i)}
                  y={getY(v.temperature || 36.6) - 8}
                  fontSize="9"
                  fontWeight="bold"
                  fill="#44403C"
                  textAnchor="middle"
                >
                  {v.temperature?.toFixed(1)}°
                </text>
                <text
                  x={getX(i)}
                  y={chartHeight - 8}
                  fontSize="8"
                  fill="#78716C"
                  textAnchor="middle"
                >
                  {v.date.slice(5)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  // Render Blood Sugar (Glucose) SVG Chart
  const renderGlucoseChart = () => {
    if (glucoseReadings.length < 2) {
      return (
        <div className="h-40 flex flex-col items-center justify-center text-center p-4 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
          <Droplet className="w-8 h-8 text-amber-400 mb-1" />
          <p className="text-xs text-stone-600 font-medium">Log at least 2 blood sugar checks to see glucose curves</p>
          <button
            onClick={() => onOpenGlucoseModal ? onOpenGlucoseModal() : onOpenQuickLog()}
            className="mt-2 text-xs text-amber-600 font-semibold underline"
          >
            Log Blood Sugar (Glucometer / CGM)
          </button>
        </div>
      );
    }

    const minG = 50;
    const maxG = 220;
    const getY = (val: number) => {
      const clamped = Math.max(minG, Math.min(maxG, val));
      const ratio = (clamped - minG) / (maxG - minG);
      return chartHeight - padding - ratio * (chartHeight - 2 * padding);
    };

    const getX = (idx: number) => {
      return padding + (idx / (glucoseReadings.length - 1)) * (chartWidth - 2 * padding);
    };

    const glucosePoints = glucoseReadings
      .map((v, i) => `${getX(i)},${getY(v.bloodGlucose || 100)}`)
      .join(' ');

    const normalFastingTop = getY(100);
    const normalFastingBottom = getY(70);

    return (
      <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-600 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Blood Sugar (mg/dL)
            </span>
            <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
              Target: 70–125
            </span>
          </div>
          <span className="text-[10px] text-stone-400">Capillary test strips / CGM</span>
        </div>

        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          {/* Normal Target Range Band */}
          <rect
            x={padding}
            y={normalFastingTop}
            width={chartWidth - 2 * padding}
            height={Math.max(4, normalFastingBottom - normalFastingTop)}
            fill="#F59E0B"
            fillOpacity="0.08"
          />

          {/* Normal Fasting Threshold Line 100 */}
          <line
            x1={padding}
            y1={normalFastingTop}
            x2={chartWidth - padding}
            y2={normalFastingTop}
            stroke="#FDE68A"
            strokeDasharray="2 2"
            strokeWidth="1"
          />

          {/* Low Threshold Line 70 */}
          <line
            x1={padding}
            y1={normalFastingBottom}
            x2={chartWidth - padding}
            y2={normalFastingBottom}
            stroke="#FCA5A5"
            strokeDasharray="2 2"
            strokeWidth="1"
          />
          <text
            x={chartWidth - padding}
            y={normalFastingBottom + 8}
            fontSize="7"
            fill="#EF4444"
            textAnchor="end"
          >
            70 low mark
          </text>

          {/* Polyline */}
          <polyline
            fill="none"
            stroke="#D97706"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={glucosePoints}
          />

          {/* Dots */}
          {glucoseReadings.map((v, i) => {
            const val = v.bloodGlucose || 100;
            const isLow = val < 70;
            const isHigh = val >= 180;
            const dotColor = isLow ? '#EF4444' : isHigh ? '#F59E0B' : '#10B981';

            return (
              <g key={v.id}>
                <circle
                  cx={getX(i)}
                  cy={getY(val)}
                  r="4.5"
                  fill={dotColor}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                <text
                  x={getX(i)}
                  y={getY(val) - 8}
                  fontSize="9"
                  fontWeight="bold"
                  fill="#44403C"
                  textAnchor="middle"
                >
                  {val}
                </text>
                <text
                  x={getX(i)}
                  y={chartHeight - 8}
                  fontSize="8"
                  fill="#78716C"
                  textAnchor="middle"
                >
                  {v.date.slice(5)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-5 pb-24 animate-fade-in">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold text-stone-800">
            Vitals & Health Baseline
          </h2>
          <p className="text-xs text-stone-500">
            Track blood pressure, temperature, and weight with gentle clinical care.
          </p>
        </div>
        <button
          onClick={onOpenQuickLog}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Entry</span>
        </button>
      </div>

      {/* Interactive Clinical & Camera Testers Hub */}
      <div className="bg-gradient-to-br from-stone-900 via-rose-950 to-stone-900 rounded-3xl p-5 text-white shadow-md space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-300 block">
                Guided Clinical Testers & Scanners
              </span>
              <h3 className="font-serif font-bold text-sm text-white">
                Vitals Testers & Optical Pulse Detection
              </h3>
            </div>
          </div>
          <span className="text-[10px] bg-rose-500/30 text-rose-200 px-2 py-0.5 rounded-full border border-rose-400/30 font-medium">
            Interactive
          </span>
        </div>

        <p className="text-xs text-rose-200/90 leading-relaxed">
          Select a clinical tool below: measure your pulse using the optical camera scanner, simulate guided blood pressure and temperature checks, or record blood sugar levels.
        </p>

        {/* 4 Action Cards */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {/* Camera Optical Pulse */}
          <button
            onClick={() => onOpenPulseScanner && onOpenPulseScanner()}
            className="p-3 bg-rose-600/90 hover:bg-rose-500 border border-rose-400/40 rounded-2xl text-left flex flex-col justify-between transition-all group shadow-sm"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="p-1.5 rounded-xl bg-white/20 text-white">
                <Camera className="w-4 h-4" />
              </div>
              <span className="text-[9px] bg-rose-900/60 text-rose-200 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
                Optical PPG
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Camera Pulse Scan</span>
              <span className="text-[10px] text-rose-200 block mt-0.5">Hold finger gently on rear lens</span>
            </div>
          </button>

          {/* Test Blood Pressure */}
          <button
            onClick={() => onOpenTester && onOpenTester('bp')}
            className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-left flex flex-col justify-between transition-all"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="p-1.5 rounded-xl bg-white/10 text-rose-300">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span className="text-[9px] bg-white/10 text-stone-300 px-1.5 py-0.5 rounded-md font-medium">
                Cuff Guide
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Test Blood Pressure</span>
              <span className="text-[10px] text-rose-200/80 block mt-0.5">Guided calm inflations</span>
            </div>
          </button>

          {/* Test Temperature */}
          <button
            onClick={() => onOpenTester && onOpenTester('temp')}
            className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-left flex flex-col justify-between transition-all"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="p-1.5 rounded-xl bg-white/10 text-rose-300">
                <Thermometer className="w-4 h-4" />
              </div>
              <span className="text-[9px] bg-white/10 text-stone-300 px-1.5 py-0.5 rounded-md font-medium">
                Fever Watch
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Test Temperature</span>
              <span className="text-[10px] text-rose-200/80 block mt-0.5">Oral & forehead check</span>
            </div>
          </button>

          {/* Log Blood Sugar */}
          <button
            onClick={() => onOpenGlucoseModal && onOpenGlucoseModal()}
            className="p-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 rounded-2xl text-left flex flex-col justify-between transition-all"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="p-1.5 rounded-xl bg-amber-400/20 text-amber-300">
                <Droplet className="w-4 h-4 fill-amber-300" />
              </div>
              <span className="text-[9px] bg-amber-900/60 text-amber-200 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
                CGM / Strips
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-amber-100 block">Log Blood Sugar</span>
              <span className="text-[10px] text-amber-200/80 block mt-0.5">Fasting & meal targets</span>
            </div>
          </button>
        </div>

        {/* Sensor Education Toggle */}
        <div className="pt-1 border-t border-white/10">
          <button
            type="button"
            onClick={() => setShowSensorExplainer((prev) => !prev)}
            className="w-full flex items-center justify-between text-[11px] text-rose-200 hover:text-white transition-colors py-1"
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-rose-300" />
              <span>Why can camera scan heart rate, but not sugar or temperature?</span>
            </span>
            <span className="text-xs text-rose-300 font-bold">
              {showSensorExplainer ? 'Hide' : 'Learn'}
            </span>
          </button>

          {showSensorExplainer && (
            <div className="mt-2.5 p-3 rounded-2xl bg-stone-900/80 border border-rose-400/20 text-xs text-stone-300 space-y-2 leading-relaxed animate-fade-in">
              <p>
                <strong className="text-rose-200">Optical Pulse Detection (PPG):</strong> Your phone’s camera and flashlight illuminate capillary beds beneath the skin. With each heartbeat, blood volume fluctuates, altering light absorption. Our optical algorithm samples these micro-variations to compute real-time beats per minute.
              </p>
              <p>
                <strong className="text-amber-200">Blood Sugar & Temperature:</strong> Blood glucose requires an electrochemical test strip or continuous glucose monitor (CGM) interstitial sensor. Temperature requires a calibrated thermistor or infrared sensor. Smartphone optical lenses cannot detect molecular glucose or thermal infrared radiation. We provide validated manual entry with hypoglycemia guidance for accuracy.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Metric Selector & Period Range Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        {/* Metric buttons */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('bp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'bp'
                ? 'bg-white text-stone-800 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Blood Pressure
          </button>
          <button
            onClick={() => setActiveTab('temp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'temp'
                ? 'bg-white text-stone-800 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Temperature
          </button>
          <button
            onClick={() => setActiveTab('glucose')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'glucose'
                ? 'bg-white text-stone-800 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Blood Sugar
          </button>
          <button
            onClick={() => setActiveTab('weight')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'weight'
                ? 'bg-white text-stone-800 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Weight
          </button>
        </div>

        {/* View mode */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl self-end sm:self-auto">
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
              viewMode === 'weekly'
                ? 'bg-white text-stone-800 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
              viewMode === 'monthly'
                ? 'bg-white text-stone-800 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white p-3 rounded-2xl border border-stone-100 shadow-sm">
          <span className="text-[10px] font-semibold uppercase text-stone-400 block truncate">
            Avg BP ({viewMode})
          </span>
          <span className="text-base font-bold text-stone-800 mt-0.5 block truncate">
            {avgSystolic && avgDiastolic ? `${avgSystolic}/${avgDiastolic}` : '—'}
            <span className="text-[10px] font-normal text-stone-500 ml-1">mmHg</span>
          </span>
          <span className="text-[10px] text-emerald-600 font-medium block truncate">
            {avgSystolic && avgSystolic < 120 ? '✓ Optimal' : 'Normal range'}
          </span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-stone-100 shadow-sm">
          <span className="text-[10px] font-semibold uppercase text-stone-400 block truncate">
            Avg Temp ({viewMode})
          </span>
          <span className="text-base font-bold text-stone-800 mt-0.5 block truncate">
            {avgTemp ? `${avgTemp}°C` : '—'}
          </span>
          <span className="text-[10px] text-stone-500 font-medium block truncate">
            {avgTemp ? (Number(avgTemp) >= 38 ? 'Fever watch' : '✓ Normal temp') : 'No logs yet'}
          </span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-stone-100 shadow-sm">
          <span className="text-[10px] font-semibold uppercase text-stone-400 block truncate">
            Avg Sugar ({viewMode})
          </span>
          <span className="text-base font-bold text-stone-800 mt-0.5 block truncate">
            {avgGlucose ? `${avgGlucose}` : '—'}
            <span className="text-[10px] font-normal text-stone-500 ml-1">mg/dL</span>
          </span>
          <span className="text-[10px] text-stone-500 font-medium block truncate">
            {avgGlucose ? (avgGlucose < 70 ? 'Low range' : avgGlucose <= 125 ? '✓ Target' : 'Elevated') : 'No logs yet'}
          </span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-stone-100 shadow-sm">
          <span className="text-[10px] font-semibold uppercase text-stone-400 block truncate">
            Avg Weight ({viewMode})
          </span>
          <span className="text-base font-bold text-stone-800 mt-0.5 block truncate">
            {avgWeight || '—'}
            <span className="text-[10px] font-normal text-stone-500 ml-1">{user.weightUnit}</span>
          </span>
          <span className="text-[10px] text-stone-500 font-medium block truncate">
            Cycle variance
          </span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
          {activeTab === 'bp'
            ? 'Blood Pressure Trajectory'
            : activeTab === 'temp'
            ? 'Temperature & Fever Trajectory'
            : activeTab === 'glucose'
            ? 'Blood Sugar (Glucose) Trajectory'
            : 'Weight Trajectory'}
        </h3>
        {activeTab === 'bp'
          ? renderBPChart()
          : activeTab === 'temp'
          ? renderTempChart()
          : activeTab === 'glucose'
          ? renderGlucoseChart()
          : renderWeightChart()}
      </div>

      {/* Recent History Table / Cards */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100">
        <h3 className="font-serif font-bold text-stone-800 text-sm mb-3">
          Detailed Vitals Log ({vitals.length} records)
        </h3>

        <div className="space-y-2.5">
          {[...vitals]
            .reverse()
            .slice(0, 8)
            .map((v) => (
              <div
                key={v.id}
                className="p-3 rounded-2xl bg-stone-50/80 border border-stone-200/60 flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-800">
                      {v.date}
                    </span>
                    <span className="text-[10px] text-stone-400">{v.time}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-600">
                    {v.systolic && v.diastolic && (
                      <span>
                        BP: <strong className="text-stone-800">{v.systolic}/{v.diastolic}</strong> mmHg
                      </span>
                    )}
                    {v.temperature !== undefined && (
                      <span className="flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-rose-500" />
                        Temp: <strong className="text-stone-800">{v.temperature.toFixed(1)}°C</strong>
                        <span className="text-[10px] text-stone-400">({v.temperatureMethod || 'oral'})</span>
                      </span>
                    )}
                    {v.bloodGlucose !== undefined && (
                      <span className="flex items-center gap-1">
                        <Droplet className="w-3 h-3 text-amber-500 fill-amber-400" />
                        Sugar: <strong className="text-stone-800">{v.bloodGlucose} {v.bloodGlucoseUnit || 'mg/dL'}</strong>
                        {v.bloodGlucoseContext && (
                          <span className="text-[10px] text-stone-400">({v.bloodGlucoseContext.replace('_', ' ')})</span>
                        )}
                      </span>
                    )}
                    {v.weight && (
                      <span>
                        Weight: <strong className="text-stone-800">{v.weight}</strong> {user.weightUnit}
                      </span>
                    )}
                    {v.pulse && (
                      <span className="text-stone-500 flex items-center gap-1">
                        <Heart className="w-3 h-3 text-rose-400" />
                        Pulse: {v.pulse} bpm
                        {v.pulseMethod === 'camera_optical' && (
                          <span className="text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-medium">
                            camera PPG
                          </span>
                        )}
                      </span>
                    )}
                  </div>

                  {v.notes && (
                    <p className="text-[11px] text-stone-500 italic mt-0.5">
                      "{v.notes}"
                    </p>
                  )}

                  {v.alert && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-700 font-medium">
                      <AlertTriangle className="w-3 h-3 text-amber-500" />
                      <span>{v.alert.title}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onDeleteVital(v.id)}
                  className="p-2 text-stone-400 hover:text-rose-600 transition-colors"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
