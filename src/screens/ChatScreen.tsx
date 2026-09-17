import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  MessageSquareHeart,
  AlertOctagon,
  Sparkles,
  ShieldCheck,
  Phone,
  RefreshCw,
  User,
  Heart,
} from 'lucide-react';
import { UserProfile, ChatMessage } from '../types';

interface ChatScreenProps {
  user: UserProfile;
  currentMood: string;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  user,
  currentMood,
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Hello ${user.name || 'lovely'}. I'm SheDoctor, your personal Aura health companion. 

I'm here in your corner every day — especially as you manage ${
        user.conditions.length > 0 ? user.conditions.join(', ') : 'your daily well-being'
      }. Whether you want to talk through how your body is feeling, understand everyday comfort tips, or prepare questions for your doctor, I am listening with open arms.

What is on your heart or mind right now?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emergencyAlert, setEmergencyAlert] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
      if (onClearInitialPrompt) {
        onClearInitialPrompt();
      }
    }
  }, [initialPrompt]);

  const suggestedPrompts = [
    `How can I prepare questions for my next doctor's appointment?`,
    user.conditions.includes('Breast Cancer Survivor / In-treatment')
      ? 'Gentle ways to manage fatigue and emotional changes during treatment'
      : 'What everyday habits support gentle hormonal balance?',
    `I feel slightly anxious about my health numbers today`,
    `How does my cycle phase affect my energy levels?`,
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    // Check emergency heuristics client-side first
    const redFlagWords = [
      'chest pain',
      'shortness of breath',
      'cannot breathe',
      "can't breathe",
      'severe bleeding',
      'unconscious',
      'killing myself',
      'suicide',
      'stroke',
      'heart attack',
      'coughing blood',
    ];
    const isEmergency = redFlagWords.some((w) => text.toLowerCase().includes(w));

    if (isEmergency) {
      setEmergencyAlert(
        'URGENT MEDICAL NOTICE: The symptoms you described may be a life-threatening medical emergency. Please contact emergency services (911 / 999 / 112) or head to the nearest emergency department right away.'
      );
    } else {
      setEmergencyAlert(null);
    }

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-5).map((m) => ({ role: m.role, text: m.text })),
          userProfile: user,
          currentMood,
        }),
      });

      if (!response.ok) {
        throw new Error('Chat service unavailable');
      }

      const data = await response.json();

      if (data.isRedFlag) {
        setEmergencyAlert(
          'EMERGENCY WARNING: Please seek immediate clinical emergency assistance before continuing.'
        );
      }

      const botMsg: ChatMessage = {
        id: 'msg_bot_' + Date.now(),
        role: 'assistant',
        text: data.reply || 'I am here with you. Please tell me more.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRedFlag: data.isRedFlag,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: 'msg_err_' + Date.now(),
        role: 'assistant',
        text: `I'm right here with you. While my live connection had a momentary pause, please remember: your body is worthy of gentle care, and whenever you have persistent questions, your physician and care team are your best partners.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] pb-18 animate-fade-in max-w-md mx-auto">
      {/* Disclaimer header banner */}
      <div className="bg-stone-100/90 border-b border-stone-200/80 px-4 py-2 text-[10px] text-stone-600 flex items-center justify-between">
        <span className="leading-tight">
          <strong>Medical Disclaimer:</strong> Aura provides general health information and support. It is not a substitute for professional diagnosis or treatment.
        </span>
        <ShieldCheck className="w-4 h-4 text-rose-500 flex-shrink-0 ml-2" />
      </div>

      {/* Emergency Alert Prompt if triggered */}
      {emergencyAlert && (
        <div className="m-3 p-3.5 rounded-2xl bg-red-50 border-2 border-red-300 text-red-900 shadow-md animate-bounce-short">
          <div className="flex items-center gap-2 font-bold text-xs">
            <AlertOctagon className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>Emergency Action Recommended</span>
          </div>
          <p className="text-xs mt-1 text-red-800 leading-relaxed font-medium">
            {emergencyAlert}
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <a
              href="tel:911"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" /> Call Emergency (911)
            </a>
            <button
              onClick={() => setEmergencyAlert(null)}
              className="text-xs text-red-700 hover:underline px-2"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5">
        {/* Profile Context badge */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-[11px] font-medium border border-rose-200/70">
            <Sparkles className="w-3 h-3" />
            <span>
              Tailored for {user.name} • Conditions:{' '}
              {user.conditions.length > 0 ? user.conditions.join(', ') : 'General Wellness'}
            </span>
          </div>
        </div>

        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              {!isUser ? (
                <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Heart className="w-4 h-4 fill-white/20" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-3xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-rose-500 text-white rounded-tr-none shadow-sm'
                    : 'bg-white text-stone-800 rounded-tl-none border border-stone-100 shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line space-y-1.5">
                  {msg.text}
                </div>
                <span
                  className={`text-[9px] block text-right mt-1.5 ${
                    isUser ? 'text-rose-100' : 'text-stone-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-stone-500 text-xs pl-10">
            <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse delay-100" />
            <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse delay-200" />
            <span className="italic text-[11px]">SheDoctor is thinking gently...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts carousel */}
      <div className="px-4 py-2 overflow-x-auto flex gap-2 no-scrollbar bg-[#FAF7F5]">
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            className="flex-shrink-0 text-[11px] bg-white hover:bg-rose-50 text-stone-700 border border-stone-200 px-3 py-1.5 rounded-full shadow-2xs transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="p-3 bg-white border-t border-stone-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask SheDoctor about symptoms, care tips, or peace of mind..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-full border border-stone-200 bg-stone-50 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="w-10 h-10 rounded-full bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white flex items-center justify-center shadow-sm transition-all flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
