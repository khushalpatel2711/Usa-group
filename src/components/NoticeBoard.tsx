import React from 'react';
import { AlertCircle, Phone, Mail, CheckCircle2, MessageSquare } from 'lucide-react';

interface NoticeBoardProps {
  lang: 'gu' | 'en';
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({ lang }) => {
  const contacts = [
    { name: 'JIGNESH POKAR', guName: 'જીગ્નેશ પોકાર', phone: '9890191916' },
    { name: 'KETAN DIWANI', guName: 'કેતન દીવાની', phone: '8888858257' },
    { name: 'GAURAV BHAWANI', guName: 'ગૌરવ ભવાની', phone: '9021223266' },
    { name: 'KHUSHAL PAJWANI', guName: 'ખુશાલ પજવાણી', phone: '7744064106' },
  ];

  return (
    <div id="rules" className="max-w-3xl mx-auto px-4 my-8">
      
      {/* Official Guidelines Card */}
      <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-5 sm:p-7 shadow-xs">
        
        {/* Notice Header */}
        <div className="flex items-start gap-3 border-b border-amber-200/80 pb-4 mb-4">
          <div className="p-2 rounded-xl bg-amber-600 text-white shrink-0 shadow-xs">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-amber-950 font-festive">
              {lang === 'gu' ? 'મહત્વની નોંધ અને નિયમાવલી' : 'Important Notice & Rules'}
            </h2>
            <p className="text-xs sm:text-sm text-amber-900/90 mt-0.5 font-medium">
              કાર્યક્રમ માં ભાગ લેનાર નીચેના મુદ્દા ને ધ્યાન માં રાખે અને ફોર્મ ભરી ને સબમિટ કરે.
            </p>
          </div>
        </div>

        {/* The 3 Official Points */}
        <div className="space-y-4 text-stone-800 text-sm sm:text-[15px] leading-relaxed">
          
          <div className="flex items-start gap-3 bg-white/80 p-3.5 rounded-xl border border-amber-200/70">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs shrink-0 mt-0.5">
              ૧
            </span>
            <div className="font-medium text-stone-900">
              <span className="font-semibold text-amber-950">એક વ્યક્તિ એકજ કાર્યક્રમ માં ભાગ લઈ શકશે.</span>
              <p className="text-xs text-stone-600 mt-0.5">
                (One person can participate in only one performance across the entire event.)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white/80 p-3.5 rounded-xl border border-amber-200/70">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs shrink-0 mt-0.5">
              ૨
            </span>
            <div className="font-medium text-stone-900">
              <span className="font-semibold text-amber-950">
                નાટક હશે તો તેની મર્યાદા વિષય અનુસાર સાંસ્કૃતિક સમિતિ પાસે થી પાસ કરવાની રહેશે.
              </span>
              <span className="block text-red-700 font-bold text-xs sm:text-sm mt-0.5">
                ( સોલો ડાન્સ લેવામાં આવશે નહીં )
              </span>
              <p className="text-xs text-stone-600 mt-0.5">
                (Drama scripts must be pre-approved by the committee. Solo dance is strictly not permitted.)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white/80 p-3.5 rounded-xl border border-amber-200/70">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs shrink-0 mt-0.5">
              ૩
            </span>
            <div className="font-medium text-stone-900">
              <span className="font-semibold text-amber-950">
                તમારા કાર્યક્રમ સમાજની મર્યાદા જળવાય એવા જ હોવા જોઈયે.
              </span>
              <p className="text-xs sm:text-sm text-stone-700 mt-1">
                તો આપ સૌને વિનંતી છે કે તમારા કાર્યક્રમો ની રિહર્સલ સાંસ્કૃતિક સમિતિ ને બતાવી દેવી. જેથી પાછળ થી કોઈ પ્રકાર ના પ્રશ્નો કે વિવાદ ઉભા ના થાય.
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                (All performances must adhere to community decorum. Prior rehearsals with the committee are mandatory.)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white/80 p-3.5 rounded-xl border border-amber-200/70">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs shrink-0 mt-0.5">
              ૪
            </span>
            <div className="font-medium text-stone-900">
              <span className="font-semibold text-amber-950">
                એક મોબાઈલ નંબર અને નામ પરથી માત્ર ૧ જ એન્ટ્રી માન્ય ગણાશે.
              </span>
              <p className="text-xs sm:text-sm text-stone-700 mt-1">
                જો સાંસ્કૃતિક સમિતિ / એડમિન દ્વારા તમારી અગાઉની એન્ટ્રી <strong>નામંજૂર (Reject)</strong> કરવામાં આવશે, તો જ તમે તે મોબાઈલ નંબર અને નામ પરથી નવી એન્ટ્રી ભરી શકશો.
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                (Only a single entry per mobile number & name is allowed. A new submission is permitted only if the previous entry is rejected by the committee.)
              </p>
            </div>
          </div>

        </div>

        {/* Contact Helpline Section */}
        <div id="helpline" className="mt-6 pt-5 border-t border-amber-200/90">
          <div className="flex items-center gap-2 mb-3">
            <Phone className="w-4 h-4 text-amber-800" />
            <h3 className="text-xs sm:text-sm font-bold tracking-wide uppercase text-amber-900">
              FOR ANY HELP CONTACT (સહાય માટે સંપર્ક કરો)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {contacts.map((contact) => (
              <div
                key={contact.phone}
                className="bg-white/90 border border-amber-300/80 rounded-xl p-3 flex flex-col justify-between hover:border-amber-500 transition-colors shadow-2xs"
              >
                <div>
                  <div className="font-bold text-stone-900 text-xs sm:text-sm">{contact.guName}</div>
                  <div className="text-[11px] text-stone-500">{contact.name}</div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-100">
                  <a
                    href={`tel:${contact.phone}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 hover:text-amber-700"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{contact.phone}</span>
                  </a>
                  <a
                    href={`https://wa.me/91${contact.phone}?text=${encodeURIComponent(
                      'જય ઉમિયાજી, દશેરા સાંસ્કૃતિક કાર્યક્રમ ૨૦૨૬ ફોર્મ બાબતે પૂછપરછ છે.'
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                    title="WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Help footer notice */}
          <div className="mt-3 flex items-center justify-between flex-wrap gap-2 text-xs text-stone-600 bg-white/70 px-3 py-2 rounded-xl border border-amber-200">
            <span className="font-medium text-amber-900">
              શ્રી ઉમિયા સોશિયલ એક્ટિવિટી ગ્રુપ · નંદિની વિભાગ, નાશિક
            </span>
            <span className="text-[11px] text-stone-500">
              કોઈપણ મુશ્કેલી હોય તો ઉપર આપેલા કોઈપણ નંબર પર સીધો સંપર્ક કરવો.
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
