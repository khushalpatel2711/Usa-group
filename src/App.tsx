import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { NoticeBoard } from './components/NoticeBoard';
import { RegistrationForm } from './components/RegistrationForm';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { SuccessReceiptModal } from './components/SuccessReceiptModal';
import { AdminUser, RegistrationEntry } from './types';
import { getAdminSession, setAdminSession, getStoredEntries } from './utils/storage';
import { ShieldCheck, Heart, Sparkles, MapPin, Calendar, Lock, Clock, AlertTriangle } from 'lucide-react';

const AUTO_LOGOUT_SECONDS = 60; // 1 minute auto-logout

export default function App() {
  const [lang, setLang] = useState<'gu' | 'en'>('gu');
  const [activeView, setActiveView] = useState<'form' | 'admin'>('form');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [latestSubmittedEntry, setLatestSubmittedEntry] = useState<RegistrationEntry | null>(null);
  const [entries, setEntries] = useState<RegistrationEntry[]>([]);
  
  // 1-minute auto-logout states
  const [autoLogoutSecondsLeft, setAutoLogoutSecondsLeft] = useState<number>(AUTO_LOGOUT_SECONDS);
  const [showAutoLogoutModal, setShowAutoLogoutModal] = useState<boolean>(false);

  // Load existing session and entries on mount
  useEffect(() => {
    const session = getAdminSession();
    if (session) {
      setAdminUser(session);
    }
    // Wipe previous demo entries so application has 0 entries
    const hasCleared = localStorage.getItem('dussehra_2026_demo_cleared');
    if (!hasCleared) {
      localStorage.setItem('dussehra_2026_registrations', JSON.stringify([]));
      localStorage.setItem('dussehra_2026_demo_cleared', 'true');
    }
    setEntries(getStoredEntries());
  }, []);

  // 1-Minute Auto-logout timer with activity monitoring
  useEffect(() => {
    if (!adminUser) {
      setAutoLogoutSecondsLeft(AUTO_LOGOUT_SECONDS);
      return;
    }

    let lastActivityTime = Date.now();

    const resetTimer = () => {
      lastActivityTime = Date.now();
      setAutoLogoutSecondsLeft(AUTO_LOGOUT_SECONDS);
    };

    const intervalId = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastActivityTime) / 1000);
      const remaining = Math.max(0, AUTO_LOGOUT_SECONDS - elapsed);
      setAutoLogoutSecondsLeft(remaining);

      if (remaining <= 0) {
        window.clearInterval(intervalId);
        setAdminUser(null);
        setAdminSession(null);
        setActiveView('form');
        setShowAutoLogoutModal(true);
      }
    }, 1000);

    // Throttle user activity to avoid performance overhead
    let throttleTimeout: number | null = null;
    const handleUserActivity = () => {
      if (!throttleTimeout) {
        resetTimer();
        throttleTimeout = window.setTimeout(() => {
          throttleTimeout = null;
        }, 500);
      }
    };

    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach((ev) => window.addEventListener(ev, handleUserActivity, { passive: true }));

    return () => {
      window.clearInterval(intervalId);
      if (throttleTimeout) window.clearTimeout(throttleTimeout);
      activityEvents.forEach((ev) => window.removeEventListener(ev, handleUserActivity));
    };
  }, [adminUser]);

  const handleResetAutoLogout = () => {
    setAutoLogoutSecondsLeft(AUTO_LOGOUT_SECONDS);
  };

  const handleLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    setAdminSession(user);
    setActiveView('admin');
    setShowAutoLogoutModal(false);
    setAutoLogoutSecondsLeft(AUTO_LOGOUT_SECONDS);
  };

  const handleLogoutAdmin = () => {
    setAdminUser(null);
    setAdminSession(null);
    setActiveView('form');
    setAutoLogoutSecondsLeft(AUTO_LOGOUT_SECONDS);
  };

  const handleSubmissionSuccess = (entry: RegistrationEntry) => {
    setLatestSubmittedEntry(entry);
    setEntries(getStoredEntries());
  };

  const handleRefreshEntries = () => {
    setEntries(getStoredEntries());
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9] text-stone-900">
      
      {/* Sticky Navigation Top Bar */}
      <Header
        adminUser={adminUser}
        onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
        onLogoutAdmin={handleLogoutAdmin}
        onOpenAdminDashboard={() => setActiveView('admin')}
        activeView={activeView}
        setActiveView={setActiveView}
        lang={lang}
        setLang={setLang}
        autoLogoutSecondsLeft={adminUser ? autoLogoutSecondsLeft : undefined}
      />

      {/* Main Viewport Router */}
      {activeView === 'form' ? (
        <main className="flex-1">
          {/* Festive Hero Banner */}
          <HeroBanner lang={lang} />

          {/* Official Rules & Guidelines + Contact Helpline */}
          <NoticeBoard lang={lang} />

          {/* The Registration Form */}
          <RegistrationForm
            onSubmissionSuccess={handleSubmissionSuccess}
            lang={lang}
          />
        </main>
      ) : (
        <main className="flex-1">
          {adminUser ? (
            <AdminDashboard
              adminUser={adminUser}
              entries={entries}
              onRefreshEntries={handleRefreshEntries}
              lang={lang}
              autoLogoutSecondsLeft={autoLogoutSecondsLeft}
              onResetAutoLogout={handleResetAutoLogout}
            />
          ) : (
            <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-stone-200 text-center shadow-lg">
              <Lock className="w-12 h-12 text-amber-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-stone-900 font-festive">
                પ્રવેશ પ્રતિબંધિત (Restricted)
              </h3>
              <p className="text-xs text-stone-600 mt-1 mb-5">
                સમિતિ ડેશબોર્ડ જોવા માટે ડ્યુઅલ-ફેક્ટર ઓથેન્ટિકેશન સાથે લૉગિન કરવું આવશ્યક છે.
              </p>
              <button
                onClick={() => setIsAdminLoginModalOpen(true)}
                className="w-full py-2.5 px-4 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                એડમિન લૉગિન ખોલો (Open Login)
              </button>
            </div>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-400 py-10 px-4 sm:px-6 border-t-2 border-amber-600 text-xs no-print">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          <div className="space-y-1">
            <div className="text-amber-300 font-bold text-sm font-festive">
              શ્રી ઉમિયા સોશિયલ એક્ટિવિટી ગ્રુપ - નંદિની વિભાગ , નાશિક
            </div>
            <p className="text-stone-400 text-xs">
              દશેરા સાંસ્કૃતિક કાર્યક્રમ વર્ષ ૨૦૨૬ · સત્તાવાર રજીસ્ટ્રેશન પોર્ટલ
            </p>
            <div className="text-[11px] text-stone-500 font-mono pt-1">
              End-to-End Encrypted via 256-Bit AES-GCM · 2FA Authentication
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-stone-400">
            <a
              href="#rules"
              onClick={() => setActiveView('form')}
              className="hover:text-amber-300 transition-colors"
            >
              કાર્યક્રમ નિયમો
            </a>
            <span>·</span>
            <a
              href="#helpline"
              onClick={() => setActiveView('form')}
              className="hover:text-amber-300 transition-colors"
            >
              સહાય હેલ્પલાઈન
            </a>
            <span>·</span>
            <button
              onClick={() => {
                if (adminUser) setActiveView('admin');
                else setIsAdminLoginModalOpen(true);
              }}
              className="hover:text-amber-300 transition-colors font-semibold text-amber-400"
            >
              સમિતિ પ્રવેશ
            </button>
          </div>

        </div>

        <div className="max-w-5xl mx-auto mt-6 pt-6 border-t border-stone-800/80 text-center text-[11px] text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 શ્રી ઉમિયા સોશિયલ એક્ટિવિટી ગ્રુપ - નંદિની વિભાગ, નાશિક. સર્વાધિકાર સુરક્ષિત.</span>
          <span className="flex items-center gap-1 text-stone-400">
            <span>સંપર્ક હેલ્પલાઈન: 9890191916 · 8888858257 · 9021223266 · 7744064106</span>
          </span>
        </div>
      </footer>

      {/* Admin Login Modal (Dual-Factor Authentication) */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        lang={lang}
      />

      {/* Success Registration Receipt Modal */}
      <SuccessReceiptModal
        entry={latestSubmittedEntry}
        onClose={() => setLatestSubmittedEntry(null)}
        lang={lang}
      />

      {/* Auto Logout Notification Modal (1 Minute Inactivity) */}
      {showAutoLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-amber-500 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center shadow-xs">
              <Clock className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-stone-900 font-festive">
                એડમિન પેનલ ઓટો-લૉગઆઉટ
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                સુરક્ષાના નિયમ અનુસાર <strong>૧ મિનિટ (૬૦ સેકન્ડ)</strong> નિષ્ક્રિય રહેવાથી એડમિન સેશન આપોઆપ લૉગઆઉટ થઈ ગયું છે.
              </p>
              <p className="text-[11px] text-stone-400 mt-1">
                ફરીથી સંચાલન કરવા માટે કૃપા કરીને પાસવર્ડ દાખલ કરીને લૉગિન કરો.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
              <button
                type="button"
                onClick={() => {
                  setShowAutoLogoutModal(false);
                  setIsAdminLoginModalOpen(true);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-700 to-red-700 hover:from-amber-800 hover:to-red-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>ફરીથી લૉગિન કરો (Login Again)</span>
              </button>
              <button
                type="button"
                onClick={() => setShowAutoLogoutModal(false)}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl transition-colors"
              >
                બંધ કરો
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
