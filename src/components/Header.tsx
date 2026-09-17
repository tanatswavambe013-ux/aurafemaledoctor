import React from 'react';
import { Heart, Sparkles, Shield, User, Crown } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ user, activeScreen, onNavigate }) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F5]/90 backdrop-blur-md border-b border-rose-100/70 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-400 to-rose-300 flex items-center justify-center text-white shadow-sm shadow-rose-200 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-white/30 stroke-white stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-xl font-bold tracking-tight text-stone-800">
                Aura
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded-full border border-rose-200/60">
                Companion
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium">
              Hello, {user.name}
            </p>
          </div>
        </button>

        {/* Right actions: Subscription badge & Profile */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('subscription')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full transition-all border ${
              user.subscription.status === 'active'
                ? 'bg-amber-50/80 text-amber-800 border-amber-200 hover:bg-amber-100'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}
            title="Manage Subscription"
          >
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>{user.subscription.status === 'active' ? '$1/mo' : 'Join $1'}</span>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              activeScreen === 'settings'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-stone-100/90 text-stone-600 hover:bg-stone-200'
            }`}
            title="Profile & Settings"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
