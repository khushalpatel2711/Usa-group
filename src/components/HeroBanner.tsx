import React from 'react';
import { Calendar, MapPin, Sparkles, Shield, Lock } from 'lucide-react';

interface HeroBannerProps {
  lang: 'gu' | 'en';
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ lang }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-amber-900 via-amber-950 to-stone-950 text-white pt-8 pb-12 px-4 sm:px-6 shadow-md border-b-4 border-amber-500">
      
      {/* Decorative Traditional Toran & Rangoli Patterns (SVG) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex justify-around">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mandala-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="30" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="40" cy="40" r="18" fill="none" stroke="#f59e0b" strokeWidth="1" />
              <path d="M 40 10 L 40 70 M 10 40 L 70 40" stroke="#f59e0b" strokeWidth="0.8" />
              <polygon points="40,20 48,32 60,40 48,48 40,60 32,48 20,40 32,32" fill="none" stroke="#fbbf24" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mandala-pattern)" />
        </svg>
      </div>

      {/* Decorative Golden Toran Border along top */}
      <div className="absolute top-0 left-0 right-0 h-3 flex justify-between overflow-hidden opacity-90">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="w-8 h-3 bg-gradient-to-b from-amber-400 to-amber-600 rounded-b-full shrink-0 mx-0.5 shadow-xs" />
        ))}
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Divine Invocation & Group Title */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold mb-4 tracking-wide shadow-xs">
          <span>॥ શ્રી ઉમિયા માતાજી જયતે ॥</span>
          <span>·</span>
          <span>દશેરા પર્વ ૨૦૨૬</span>
        </div>

        {/* Organizer Title */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-amber-100 font-festive text-balance mb-2">
          શ્રી ઉમિયા સોશિયલ એક્ટિવિટી ગ્રુપ - નંદિની વિભાગ , નાશિક
        </h2>
        <p className="text-amber-200/90 text-sm sm:text-base font-medium mb-6">
          Shree Umiya Social Activity Group - Nandini Vibhag, Nashik
        </p>

        {/* Main Event Title */}
        <div className="py-3 px-6 sm:px-10 rounded-2xl bg-gradient-to-r from-amber-800/70 via-red-900/80 to-amber-800/70 border border-amber-400/50 backdrop-blur-xs max-w-3xl mx-auto shadow-inner mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-festive leading-tight">
            દશેરા સાંસ્કૃતિક કાર્યક્રમ - 2026
          </h1>
          <p className="text-amber-300 text-xs sm:text-sm md:text-base font-semibold mt-1">
            આયોજિત દશેરા સાંસ્કૃતિક કાર્યક્રમ વર્ષ ૨૦૨૬ નો સત્તાવાર રજીસ્ટ્રેશન ફોર્મ
          </p>
        </div>

        {/* Event Quick Trust & Event Info Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-stone-300">
          <div className="flex items-center gap-1.5 bg-stone-900/70 px-3 py-1.5 rounded-xl border border-amber-500/30 shadow-2xs">
            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
            <span>દશેરા મહોત્સવ ઓક્ટોબર ૨૦૨૬</span>
          </div>

          <div className="flex items-center gap-1.5 bg-stone-900/70 px-3 py-1.5 rounded-xl border border-amber-500/30 shadow-2xs">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span>નંદિની વિભાગ, નાશિક</span>
          </div>

          <div className="flex items-center gap-1.5 bg-stone-900/70 px-3 py-1.5 rounded-xl border border-amber-500/30 shadow-2xs">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>256-Bit AES એન્ક્રિપ્ટેડ</span>
          </div>
        </div>

      </div>

    </div>
  );
};
