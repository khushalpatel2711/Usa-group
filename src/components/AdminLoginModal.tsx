import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  RefreshCw,
  LogIn,
} from 'lucide-react';
import { AdminUser } from '../types';
import { COMMITTEE_ACCOUNTS } from '../utils/storage';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (admin: AdminUser) => void;
  lang: 'gu' | 'en';
}

const REQUIRED_ADMIN_PASSWORD = 'usa.mediateams';

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  lang,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!password.trim()) {
      setErrorMsg('કૃપા કરીને એડમિન પાસવર્ડ દાખલ કરો.');
      return;
    }

    if (password.trim() !== REQUIRED_ADMIN_PASSWORD) {
      setErrorMsg('ખોટો પાસવર્ડ! કૃપા કરીને સાચો એડમિન પાસવર્ડ દાખલ કરો.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Log in as Committee Admin
      const adminUser: AdminUser = {
        id: 'admin_active',
        email: 'admin@umiya.org',
        name: 'સાંસ્કૃતિક સમિતિ (Admin)',
        role: 'Cultural Committee Member',
        phone: '8888858257',
        avatarInitials: 'UA',
      };
      onLoginSuccess(adminUser);
      onClose();
      setPassword('');
      setErrorMsg(null);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs">
      <div
        className="relative max-w-md w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-amber-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-800 via-amber-900 to-stone-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-600/60 border border-amber-400/40 text-amber-200">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg font-festive leading-tight">
                {lang === 'gu' ? 'સાંસ્કૃતિક સમિતિ એડમિન લૉગિન' : 'Committee Admin Login'}
              </h3>
              <p className="text-[11px] text-amber-200/90 font-medium">
                શ્રી ઉમિયા સોશિયલ એક્ટિવિટી ગ્રુપ · નાશિક
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

        {/* Error message */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              એડમિન પાસવર્ડ દાખલ કરો (Admin Password):
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-2.5 text-sm rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 font-medium tracking-wide bg-stone-50 focus:bg-white"
                autoFocus
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-700 to-red-700 hover:from-amber-800 hover:to-red-800 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>લૉગિન કરો (Login as Admin)</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-stone-400 text-center pt-1">
            ફક્ત અધિકૃત સમિતિ એડમિન માટે.
          </p>
        </form>
      </div>
    </div>
  );
};
