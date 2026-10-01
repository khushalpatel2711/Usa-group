import React from 'react';
import {
  Phone,
  MessageCircle,
  HelpCircle,
  Calendar,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { FormStatusConfig } from '../types';

interface FormOfflineHelpPageProps {
  formStatus: FormStatusConfig;
  onOpenAdminLogin?: () => void;
  lang: 'gu' | 'en';
}

export const FormOfflineHelpPage: React.FC<FormOfflineHelpPageProps> = ({
  formStatus,
  onOpenAdminLogin,
  lang,
}) => {
  const coordinators = [
    {
      nameGu: 'જીગ્નેશ પોકાર',
      nameEn: 'Jignesh Pokar',
      roleGu: 'સાંસ્કૃતિક સમિતિ',
      phone: '9890191916',
      cleanPhone: '9890191916',
      waMessage: encodeURIComponent('નમસ્તે જીગ્નેશભાઈ, દશેરા ૨૦૨૬ સાંસ્કૃતિક કાર્યક્રમ ફોર્મ અંગે સહાય જોઈએ છે.'),
    },
    {
      nameGu: 'કેતન દિવાણી',
      nameEn: 'Ketan Diwani',
      roleGu: 'સાંસ્કૃતિક સમિતિ',
      phone: '8888858257',
      cleanPhone: '8888858257',
      waMessage: encodeURIComponent('નમસ્તે કેતનભાઈ, દશેરા ૨૦૨૬ સાંસ્કૃતિક કાર્યક્રમ ફોર્મ અંગે સહાય જોઈએ છે.'),
    },
    {
      nameGu: 'ગૌરવ ભાવાણી',
      nameEn: 'Gaurav Bhawani',
      roleGu: 'સાંસ્કૃતિક સમિતિ',
      phone: '9021223266',
      cleanPhone: '9021223266',
      waMessage: encodeURIComponent('નમસ્તે ગૌરવભાઈ, દશેરા ૨૦૨૬ સાંસ્કૃતિક કાર્યક્રમ ફોર્મ અંગે સહાય જોઈએ છે.'),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      
      {/* Offline Alert Hero Card */}
      <div className="bg-gradient-to-br from-amber-950 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-10 border border-amber-500/30 shadow-2xl relative overflow-hidden text-center space-y-5">
        
        {/* Decorative backdrop glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-amber-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs sm:text-sm font-bold uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span>ઓનલાઇન ફોર્મ હાલમાં ઓફલાઇન છે (Form Offline)</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold font-festive text-amber-200 tracking-wide">
            દશેરા સાંસ્કૃતિક મહા મહોત્સવ ૨૦૨૬
          </h2>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-medium">
            {formStatus.offlineMessageGu ||
              'દશેરા ૨૦૨૬ સાંસ્કૃતિક કાર્યક્રમ માટેનું ઓનલાઇન રજીસ્ટ્રેશન ફોર્મ હાલમાં સમિતિ દ્વારા બંધ (Offline) કરવામાં આવ્યું છે.'}
          </p>

          <div className="pt-2 flex items-center justify-center gap-4 text-xs text-amber-300/80">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>વિજયાદશમી પર્વ: ૨૦ ઓક્ટોબર ૨૦૨૬</span>
            </span>
          </div>

        </div>
      </div>

      {/* Prominent Help Section - "FOR ANY HELP CONTACT" */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-lg space-y-8">
        
        <div className="text-center space-y-2 border-b border-stone-100 pb-6">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
            <HelpCircle className="w-4 h-4 text-amber-700" />
            <span>મહત્વપૂર્ણ હેલ્પલાઇન & માર્ગદર્શન</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-wider font-festive">
            FOR ANY HELP CONTACT
          </h3>
          <p className="text-sm font-bold text-amber-800">
            (કોઈપણ સહાય, વિશેષ મંજૂરી અથવા પૂછપરછ માટે સંપર્ક કરો)
          </p>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
            જો તમે તમારા મંડળનું રજીસ્ટ્રેશન કરાવવા માંગતા હોવ અથવા કાર્યક્રમ સંબંધી કોઈ માહિતી જોઈતી હોય, તો નીચે આપેલા સાંસ્કૃતિક સમિતિના હોદ્દેદારોનો સીધો સંપર્ક કરી શકો છો:
          </p>
        </div>

        {/* Committee Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {coordinators.map((c, idx) => (
            <div
              key={idx}
              className="bg-stone-50/80 hover:bg-amber-50/60 rounded-2xl p-5 border border-stone-200 hover:border-amber-300 transition-all duration-200 shadow-2xs hover:shadow-md flex flex-col justify-between space-y-4"
            >
              <div className="space-y-1 text-center">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg mb-2 shadow-2xs">
                  {c.nameGu.charAt(0)}
                </div>
                <h4 className="font-extrabold text-base sm:text-lg text-stone-900">
                  {c.nameGu}
                </h4>
                <p className="text-xs text-stone-500 font-medium">
                  {c.nameEn}
                </p>
                <span className="inline-block text-[11px] font-bold text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
                  {c.roleGu}
                </span>
              </div>

              {/* Call and WhatsApp Buttons */}
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <a
                  href={`tel:${c.cleanPhone}`}
                  className="w-full py-2.5 px-3 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call: {c.phone}</span>
                </a>

                <a
                  href={`https://wa.me/91${c.cleanPhone}?text=${c.waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Security / Admin hint */}
        <div className="pt-2 text-center border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>શ્રી ઉમિયા સોશિયલ એક્ટિવિટી ગ્રુપ · સત્તાવાર સાંસ્કૃતિક પોર્ટલ · નાશિક</span>
          </div>

          {onOpenAdminLogin && (
            <button
              onClick={onOpenAdminLogin}
              className="text-stone-500 hover:text-amber-800 font-bold underline cursor-pointer flex items-center gap-1 text-xs"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>સમિતિ એડમિન લોગીન (Admin Access)</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
