import React from 'react';
import { ShieldCheck, LogIn, LogOut, Phone, Award } from 'lucide-react';
import { AdminUser } from '../types';

interface HeaderProps {
  adminUser: AdminUser | null;
  onOpenAdminLogin: () => void;
  onLogoutAdmin: () => void;
  onOpenAdminDashboard: () => void;
  activeView: 'form' | 'admin';
  setActiveView: (view: 'form' | 'admin') => void;
  lang: 'gu' | 'en';
  setLang: (lang: 'gu' | 'en') => void;
}

export const Header: React.FC<HeaderProps> = ({
  adminUser,
  onOpenAdminLogin,
  onLogoutAdmin,
  onOpenAdminDashboard,
  activeView,
  setActiveView,
  lang,
  setLang,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-red-700 flex items-center justify-center text-white shadow-xs font-bold text-lg select-none shrink-0 border border-amber-400/40">
            <span>ૐ</span>
          </div>
          <button
            onClick={() => setActiveView('form')}
            className="text-left font-bold tracking-tight text-stone-900 hover:text-amber-800 transition-colors"
          >
            <span className="block text-base sm:text-lg font-festive leading-tight">
              શ્રી ઉમિયા સોશિયલ એક્ટિવિટી ગ્રુપ
            </span>
            <span className="block text-xs text-amber-800/80 font-medium">
              દશેરા મહોત્સવ - ૨૦૨૬ · નાશિક
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-700">
          <button
            onClick={() => setActiveView('form')}
            className={`transition-colors hover:text-amber-800 ${
              activeView === 'form' ? 'text-amber-800 font-semibold' : ''
            }`}
          >
            {lang === 'gu' ? 'રજીસ્ટ્રેશન ફોર્મ' : 'Registration Form'}
          </button>
          
          <a
            href="#rules"
            className="hover:text-amber-800 transition-colors"
            onClick={(e) => {
              if (activeView === 'admin') setActiveView('form');
            }}
          >
            {lang === 'gu' ? 'મહત્વની નોંધ' : 'Rules & Guidelines'}
          </a>

          <a
            href="#helpline"
            className="hover:text-amber-800 transition-colors"
            onClick={(e) => {
              if (activeView === 'admin') setActiveView('form');
            }}
          >
            {lang === 'gu' ? 'સંપર્ક હેલ્પલાઇન' : 'Helpline'}
          </a>

          {adminUser && (
            <button
              onClick={() => setActiveView('admin')}
              className={`flex items-center gap-1.5 transition-colors ${
                activeView === 'admin'
                  ? 'text-amber-800 font-bold border-b-2 border-amber-600 pb-0.5'
                  : 'text-stone-700 hover:text-amber-800'
              }`}
            >
              <Award className="w-4 h-4 text-amber-700" />
              <span>{lang === 'gu' ? 'સમિતિ ડેશબોર્ડ' : 'Admin Portal'}</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Language Switcher */}
          <div className="flex items-center rounded-lg bg-stone-100 p-0.5 border border-stone-200 text-xs font-semibold">
            <button
              onClick={() => setLang('gu')}
              className={`px-2 py-1 rounded-md transition-all ${
                lang === 'gu'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ગુજરાતી
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded-md transition-all ${
                lang === 'en'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              EN
            </button>
          </div>

          {/* Admin Authentication Button */}
          {adminUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAdminDashboard}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors whitespace-nowrap"
                title={`${adminUser.name} (${adminUser.role})`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="hidden sm:inline">{adminUser.name.split(' ')[0]}</span>
                <span className="text-[10px] bg-amber-200/80 px-1.5 py-0.5 rounded text-amber-900">
                  Admin Active
                </span>
              </button>

              <button
                onClick={onLogoutAdmin}
                className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout Admin"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-700 to-red-700 hover:from-amber-800 hover:to-red-800 rounded-lg shadow-xs hover:shadow transition-all whitespace-nowrap active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{lang === 'gu' ? 'એડમિન લૉગિન' : 'Admin Login'}</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
