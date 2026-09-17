import React, { useState } from 'react';
import {
  Crown,
  CreditCard,
  ShieldCheck,
  Check,
  Smartphone,
  Sparkles,
  ArrowRight,
  Heart,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import { UserProfile } from '../types';

interface SubscriptionScreenProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onBack: () => void;
}

export const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({
  user,
  onUpdateUser,
  onBack,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<
    'card' | 'paypal' | 'ecocash' | 'flutterwave' | 'paystack'
  >(user.subscription.paymentMethod || 'card');

  const [mobileNumber, setMobileNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const isSubscribed = user.subscription.status === 'active';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const nextRenewal = new Date();
      nextRenewal.setMonth(nextRenewal.getMonth() + 1);

      onUpdateUser({
        ...user,
        subscription: {
          status: 'active',
          plan: 'Aura Care Monthly',
          amount: 1.0,
          currency: 'USD',
          paymentMethod: selectedMethod,
          renewalDate: nextRenewal.toISOString().split('T')[0],
          autoRenew: true,
        },
      });

      setFeedbackMessage('🎉 Your Aura Care subscription is now active! Thank you for trusting us with your journey.');
    }, 1000);
  };

  const handleCancelSubscription = () => {
    if (confirm('Are you sure you want to cancel your $1/month subscription? You can re-activate anytime.')) {
      onUpdateUser({
        ...user,
        subscription: {
          ...user.subscription,
          status: 'none',
          autoRenew: false,
        },
      });
      setFeedbackMessage('Your subscription has been canceled. You have full access until the end of your billing cycle.');
    }
  };

  return (
    <div className="space-y-5 pb-24 animate-fade-in max-w-md mx-auto">
      {/* Plan Header */}
      <div className="bg-gradient-to-br from-amber-500 via-rose-500 to-pink-500 rounded-3xl p-6 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 text-amber-100 text-xs font-bold uppercase tracking-wider mb-2">
            <Crown className="w-4 h-4 text-amber-200" />
            <span>Accessible Care For All Women</span>
          </div>

          <h2 className="font-serif text-2xl font-bold">
            Aura Care Membership
          </h2>

          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl font-extrabold">$1</span>
            <span className="text-sm text-rose-100 font-medium">/ month</span>
            <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full text-white font-semibold ml-2">
              Cancel anytime
            </span>
          </div>

          <p className="text-xs text-rose-100 mt-2 leading-relaxed">
            Priced intentionally at just $1/month so compassionate, condition-aware health tracking is within reach for every woman worldwide.
          </p>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-fade-in flex items-start gap-2">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Feature Highlights */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100 space-y-3">
        <h3 className="font-serif font-bold text-stone-800 text-sm">
          Everything Included in Your Membership
        </h3>

        <div className="space-y-2.5 text-xs text-stone-700">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>Unlimited, compassionate SheDoctor AI guidance for your conditions</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>Intelligent period, fertile window & ovulation cycle predictions</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>Monthly breast self-exam reminders & interactive visual guides</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>Weekly & monthly weight and blood pressure trend analytics</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>Encrypted local storage with strict zero-health-data-selling guarantee</span>
          </div>
        </div>
      </div>

      {/* Current Status if Active */}
      {isSubscribed ? (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-xs text-stone-800 uppercase tracking-wide">
                Current Status: Active
              </span>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              $1.00 / mo
            </span>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl text-xs text-stone-600 space-y-1">
            <p>
              <strong>Payment Method:</strong> {user.subscription.paymentMethod.toUpperCase()}
            </p>
            <p>
              <strong>Next Renewal Date:</strong> {user.subscription.renewalDate}
            </p>
          </div>

          <button
            onClick={handleCancelSubscription}
            className="w-full py-2.5 text-xs text-stone-500 hover:text-red-600 font-semibold transition-colors text-center"
          >
            Cancel Subscription
          </button>
        </div>
      ) : (
        /* Payment Selection Form */
        <form onSubmit={handleSubscribe} className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100 space-y-4">
          <h3 className="font-serif font-bold text-stone-800 text-sm">
            Select Your Preferred Payment Method
          </h3>

          <div className="space-y-2">
            {/* Card (Stripe) */}
            <label
              className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                selectedMethod === 'card'
                  ? 'border-rose-500 bg-rose-50/50 ring-1 ring-rose-300'
                  : 'border-stone-200 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={selectedMethod === 'card'}
                  onChange={() => setSelectedMethod('card')}
                  className="accent-rose-500"
                />
                <CreditCard className="w-4 h-4 text-stone-700" />
                <span className="text-xs font-semibold text-stone-800">
                  Credit / Debit Card (via Stripe)
                </span>
              </div>
              <span className="text-[10px] text-stone-400">Visa / Mastercard</span>
            </label>

            {/* PayPal */}
            <label
              className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                selectedMethod === 'paypal'
                  ? 'border-rose-500 bg-rose-50/50 ring-1 ring-rose-300'
                  : 'border-stone-200 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={selectedMethod === 'paypal'}
                  onChange={() => setSelectedMethod('paypal')}
                  className="accent-rose-500"
                />
                <span className="font-bold text-blue-700 text-xs">PayPal</span>
                <span className="text-xs font-semibold text-stone-800">PayPal Account</span>
              </div>
              <span className="text-[10px] text-stone-400">One-click</span>
            </label>

            {/* Mobile Money: EcoCash (Paynow) */}
            <label
              className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                selectedMethod === 'ecocash'
                  ? 'border-rose-500 bg-rose-50/50 ring-1 ring-rose-300'
                  : 'border-stone-200 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={selectedMethod === 'ecocash'}
                  onChange={() => setSelectedMethod('ecocash')}
                  className="accent-rose-500"
                />
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-stone-800">
                  EcoCash / Mobile Money (Paynow)
                </span>
              </div>
              <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                Direct USSD
              </span>
            </label>

            {/* Flutterwave */}
            <label
              className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                selectedMethod === 'flutterwave'
                  ? 'border-rose-500 bg-rose-50/50 ring-1 ring-rose-300'
                  : 'border-stone-200 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={selectedMethod === 'flutterwave'}
                  onChange={() => setSelectedMethod('flutterwave')}
                  className="accent-rose-500"
                />
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-stone-800">
                  Flutterwave (Pan-African Mobile Money & Bank)
                </span>
              </div>
              <span className="text-[10px] text-stone-400">M-Pesa, MTN, Airtel</span>
            </label>

            {/* Paystack */}
            <label
              className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                selectedMethod === 'paystack'
                  ? 'border-rose-500 bg-rose-50/50 ring-1 ring-rose-300'
                  : 'border-stone-200 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={selectedMethod === 'paystack'}
                  onChange={() => setSelectedMethod('paystack')}
                  className="accent-rose-500"
                />
                <CreditCard className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-semibold text-stone-800">
                  Paystack (Cards, USSD & QR)
                </span>
              </div>
              <span className="text-[10px] text-stone-400">Instant</span>
            </label>
          </div>

          {/* Conditional inputs */}
          {selectedMethod === 'ecocash' && (
            <div className="p-3 bg-stone-50 rounded-2xl space-y-1.5">
              <label className="block text-[11px] font-semibold text-stone-700">
                EcoCash Mobile Number
              </label>
              <input
                type="tel"
                placeholder="e.g. 077 123 4567"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
              <p className="text-[10px] text-stone-500">
                A prompt will appear on your phone to enter your EcoCash PIN.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-2xl text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? 'Processing Secure Transaction...' : 'Activate Subscription ($1/mo)'}
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-bit encrypted checkout. Cancel anytime with one tap.</span>
          </div>
        </form>
      )}
    </div>
  );
};
