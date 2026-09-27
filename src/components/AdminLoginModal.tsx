import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Smartphone,
} from 'lucide-react';
import { AdminUser } from '../types';
import { COMMITTEE_ACCOUNTS } from '../utils/storage';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (admin: AdminUser) => void;
  lang: 'gu' | 'en';
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  lang,
}) => {
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Password, Step 2: 2FA OTP
  const [selectedEmail, setSelectedEmail] = useState(COMMITTEE_ACCOUNTS[0].email);
  const [password, setPassword] = useState('umiya2026');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [simulatedLiveOtp, setSimulatedLiveOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Generate a random 6-digit OTP when entering step 2
  const generateNewOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedLiveOtp(code);
    setCountdown(60);
    setErrorMsg(null);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const currentAccount =
    COMMITTEE_ACCOUNTS.find((a) => a.email === selectedEmail) || COMMITTEE_ACCOUNTS[0];

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!password.trim()) {
      setErrorMsg('પાસવર્ડ દાખલ કરવો જરૂરી છે.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      generateNewOtp();
      setStep(2);
    }, 400);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otpCode];
    newOtp[index] = val.slice(-1);
    setOtpCode(newOtp);

    // Auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-box-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-box-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleFillDemoOtp = () => {
    if (simulatedLiveOtp) {
      setOtpCode(simulatedLiveOtp.split(''));
    }
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpCode.join('');
    if (entered.length < 6) {
      setErrorMsg('કૃપા કરીને પૂરો ૬ આંકડાનો ઓટીપી (OTP) દાખલ કરો.');
      return;
    }

    if (entered !== simulatedLiveOtp) {
      setErrorMsg('અમાન્ય ઓટીપી કોડ. કૃપા કરીને સ્ક્રીન પર દર્શાવેલ 2FA કોડ ચકાસો.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(currentAccount);
      onClose();
      // Reset state for next time
      setStep(1);
      setOtpCode(['', '', '', '', '', '']);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
      <div
        className="relative max-w-md w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-amber-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-amber-800 via-amber-900 to-stone-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-600/60 border border-amber-400/40 text-amber-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg font-festive leading-tight">
                {lang === 'gu' ? 'સાંસ્કૃતિક સમિતિ સુરક્ષિત લૉગિન' : 'Cultural Committee Secure Login'}
              </h3>
              <p className="text-[11px] text-amber-200/90 font-medium">
                Dual-Factor Authentication (2FA) Enforced
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-amber-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress indicator steps */}
        <div className="px-6 pt-4 pb-2 flex items-center justify-between border-b border-stone-100 text-xs font-semibold">
          <div
            className={`flex items-center gap-1.5 ${
              step >= 1 ? 'text-amber-800 font-bold' : 'text-stone-400'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step >= 1 ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-600'
              }`}
            >
              1
            </span>
            <span>પ્રમાણીકરણ (Credentials)</span>
          </div>
          <span className="text-stone-300">———</span>
          <div
            className={`flex items-center gap-1.5 ${
              step === 2 ? 'text-amber-800 font-bold' : 'text-stone-400'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 2 ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-600'
              }`}
            >
              2
            </span>
            <span>2FA OTP ચકાસણી</span>
          </div>
        </div>

        {/* Error message banner */}
        {errorMsg && (
          <div className="mx-6 mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Admin account & password */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                સમિતિ સભ્ય પસંદ કરો (Select Committee Officer):
              </label>
              <div className="space-y-2">
                {COMMITTEE_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => setSelectedEmail(acc.email)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      selectedEmail === acc.email
                        ? 'border-amber-600 bg-amber-50/70 shadow-xs'
                        : 'border-stone-200 hover:border-amber-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-stone-900">{acc.name}</div>
                      <div className="text-[11px] text-stone-500">
                        {acc.role} · {acc.email}
                      </div>
                    </div>
                    {selectedEmail === acc.email && (
                      <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                એડમિન પાસવર્ડ (Password):
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="દા.ત. umiya2026"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 font-medium"
                  required
                />
              </div>
              <p className="text-[10px] text-stone-400 mt-1">
                ડિફોલ્ટ પાસવર્ડ: <span className="font-mono text-stone-700">umiya2026</span>
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-700 to-red-700 hover:from-amber-800 hover:to-red-800 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>આગળ વધો (Step 2: 2FA)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Dual Factor OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerify2FA} className="p-6 space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2">
                <Smartphone className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-stone-900">
                ડ્યુઅલ-ફેક્ટર સુરક્ષા કોડ (2FA Verification)
              </h4>
              <p className="text-xs text-stone-600">
                સમિતિ સભ્ય <strong className="text-stone-800">{currentAccount.name}</strong> ({currentAccount.phone}) ના રજીસ્ટર્ડ નંબર પર વેરિફિકેશન કોડ જનરેટ થયો છે.
              </p>
            </div>

            {/* Live Simulated 2FA Code Display with Quick Autofill */}
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-center space-y-1">
              <div className="text-[11px] text-amber-900 font-semibold">
                🛡️ તમારી સુરક્ષા માટે સક્રિય 2FA કોડ:
              </div>
              <div className="text-2xl font-mono font-extrabold tracking-widest text-amber-950">
                {simulatedLiveOtp}
              </div>
              <button
                type="button"
                onClick={handleFillDemoOtp}
                className="text-xs text-amber-800 hover:underline font-semibold"
              >
                આ કોડ આપોઆપ ભરો (Autofill Code)
              </button>
            </div>

            {/* 6 Digit Inputs */}
            <div>
              <label className="block text-xs font-bold text-stone-700 text-center mb-2">
                ૬ આંકડાનો કોડ અહીં લખો:
              </label>
              <div className="flex justify-center gap-2">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-box-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-10 h-12 text-center text-xl font-bold font-mono rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 bg-stone-50"
                  />
                ))}
              </div>
            </div>

            {/* Resend & Back controls */}
            <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="hover:text-stone-800 underline"
              >
                ← ખાતું બદલો
              </button>

              <button
                type="button"
                onClick={generateNewOtp}
                disabled={countdown > 0}
                className="text-amber-800 hover:underline disabled:text-stone-400 font-semibold"
              >
                {countdown > 0 ? `નવો કોડ (${countdown}s)` : 'નવો OTP મોકલો'}
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-700 to-amber-700 hover:from-emerald-800 hover:to-amber-800 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>2FA પ્રમાણિત કરો & ડેશબોર્ડ ખોલો</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
