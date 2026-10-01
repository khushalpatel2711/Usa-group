import React from 'react';
import {
  X,
  CheckCircle2,
  Printer,
  ShieldCheck,
  Calendar,
  Clock,
  Phone,
  Music,
  Share2,
  FileCheck,
  Users,
} from 'lucide-react';
import { RegistrationEntry } from '../types';
import { formatFileSize } from '../utils/crypto';

interface SuccessReceiptModalProps {
  entry: RegistrationEntry | null;
  onClose: () => void;
  lang: 'gu' | 'en';
}

export const SuccessReceiptModal: React.FC<SuccessReceiptModalProps> = ({
  entry,
  onClose,
  lang,
}) => {
  if (!entry) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs">
      <div
        className="relative max-w-xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Festive Header */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-red-800 text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 no-print"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-full bg-white/20 border border-white/30 flex items-center justify-center mx-auto mb-2 shadow-xs">
            <CheckCircle2 className="w-7 h-7 text-amber-200" />
          </div>

          <div className="text-xs uppercase tracking-widest text-amber-200 font-bold">
            સફળ રજીસ્ટ્રેશન પહોંચ · OFFICIAL SUBMISSION RECEIPT
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-festive mt-1">
            શ્રી ઉમિયા સોશિયલ એક્ટિવિટી ગ્રુપ
          </h3>
          <p className="text-xs text-amber-200/90 font-medium">
            દશેરા સાંસ્કૃતિક કાર્યક્રમ વર્ષ ૨૦૨૬ · નંદિની વિભાગ, નાશિક
          </p>
        </div>

        {/* Receipt Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Entry Number Badge */}
          <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                એન્ટ્રી નંબર (Entry No.):
              </span>
              <span className="text-xl sm:text-2xl font-mono font-black text-amber-950">
                {entry.entryNumber}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-stone-500 block">સબમિશન તારીખ:</span>
              <span className="text-xs font-mono font-bold text-stone-800">
                {new Date(entry.submittedAt).toLocaleDateString('gu-IN')} {new Date(entry.submittedAt).toLocaleTimeString('gu-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Performance Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-stone-500 block text-[11px]">કાર્યક્રમ પ્રકાર (Category):</span>
              <span className="font-bold text-stone-900">
                {entry.category === 'raas_garba'
                  ? 'રાસ ગરબા'
                  : entry.category === 'dance'
                  ? 'ડાન્સ (ગ્રુપ)'
                  : entry.category === 'natak'
                  ? 'નાટક'
                  : `અન્ય (${entry.customCategory || ''})`}
              </span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-stone-500 block text-[11px]">સમયગાળો (Duration):</span>
              <span className="font-bold text-stone-900 font-mono">
                {entry.durationMinutes} મિનિટ {entry.durationSeconds} સેકન્ડ ({entry.formattedDuration})
              </span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 sm:col-span-2">
              <span className="text-stone-500 block text-[11px]">કાર્યક્રમનું નામ / ગીતના બોલ:</span>
              <span className="font-bold text-amber-950 text-sm sm:text-base">
                {entry.performanceTitle}
              </span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-stone-500 block text-[11px]">તૈયાર કરાવનાર (Coordinator):</span>
              <span className="font-bold text-stone-900">{entry.coordinatorName}</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-stone-500 block text-[11px]">મોબાઈલ નંબર (Phone):</span>
              <span className="font-bold font-mono text-stone-900">{entry.coordinatorPhone}</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 sm:col-span-2">
              <span className="text-stone-500 block text-[11px]">
                કાર્યક્રમ શરૂ થાય તે પહેલાં માહિતી (Pre-Intro):
              </span>
              <span className="font-bold text-stone-900">
                {entry.preIntroRequired ? 'હા (YES)' : 'ના (NO)'}
              </span>
              {entry.preIntroRequired && entry.preIntroDetails && (
                <p className="text-xs text-stone-700 bg-white p-2 rounded-lg border border-stone-200 mt-1 italic font-medium">
                  "{entry.preIntroDetails}"
                </p>
              )}
            </div>
          </div>

          {/* Registered Participants Table */}
          {entry.manualParticipants && entry.manualParticipants.length > 0 && (
            <div className="p-3.5 bg-amber-50/70 border border-amber-300 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-amber-950">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-800" />
                  <span>ભાગ લેનાર સભ્યોની યાદી (Participants List):</span>
                </span>
                <span className="text-[11px] bg-amber-200/80 px-2.5 py-0.5 rounded-full font-mono font-bold text-amber-950">
                  {entry.manualParticipants.length} સભ્યો
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                {entry.manualParticipants.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-amber-200 text-stone-800"
                  >
                    <span className="font-semibold truncate">
                      {i + 1}. {p.name}
                    </span>
                    {p.age && (
                      <span className="text-[11px] text-stone-500 font-mono shrink-0 ml-2">
                        {p.age} વર્ષ
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Encrypted Files Status Card */}
          <div className="p-3.5 bg-stone-100 rounded-2xl border border-stone-200 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-stone-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>સુરક્ષિત રીતે એન્ક્રિપ્ટ થયેલી ફાઇલો:</span>
            </div>

            <div className="space-y-1.5 font-mono text-[11px] text-stone-600">
              {entry.songFile ? (
                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-stone-200">
                  <span className="truncate max-w-[220px]">
                    🎵 {entry.songFile.originalName} ({formatFileSize(entry.songFile.size)})
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {entry.songFile.qualityBadge && (
                      <span className="text-[10px] text-amber-900 font-bold bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                        💎 HQ
                      </span>
                    )}
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      AES-256 ✓
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-stone-200 font-sans">
                  <span className="text-stone-700 text-xs">
                    🎵 ગીત: ઓનલાઇન અપલોડ કરેલ નથી (પેન ડ્રાઇવમાં આપવાનું રહેશે)
                  </span>
                  <span className="text-[10px] text-amber-800 font-semibold shrink-0 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    NO (પેન ડ્રાઇવ)
                  </span>
                </div>
              )}

              {entry.participantsPhotoFile && (
                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-stone-200">
                  <span className="truncate max-w-[240px]">
                    📄 {entry.participantsPhotoFile.originalName} ({formatFileSize(entry.participantsPhotoFile.size)})
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold shrink-0">
                    Verified ✓
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Next Steps for Participant */}
          <div className="p-3.5 bg-amber-50/90 border border-amber-300 rounded-2xl space-y-1 text-xs text-stone-800">
            <div className="font-bold text-amber-950 flex items-center gap-1.5">
              <span>📌 હવે આગળ શું કરવું?</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-stone-700 leading-relaxed">
              <li>સાંસ્કૃતિક સમિતિ તમારી સ્ક્રિપ્ટ અને ગીતની ચકાસણી કરશે.</li>
              <li>રિહર્સલની તારીખ અને સમય તમારા મોબાઈલ નંબર પર WhatsApp/SMS થી મોકલવામાં આવશે.</li>
              {entry.ledScreenRequired && (
                <li className="font-semibold text-amber-900">
                  તમે LED સ્ક્રીન વિડિયો માંગ્યો હોવાથી તે વિડિયો પેન ડ્રાઇવમાં રીહર્સલના દિવસે જમા કરાવવાનો રહેશે.
                </li>
              )}
            </ul>
          </div>

          {/* Helpline reminders */}
          <div className="text-[11px] text-stone-500 text-center pt-1">
            કોઈપણ પૂછપરછ માટે સંપર્ક કરો: જીગ્નેશ પોકાર (9890191916) · કેતન દિવાણી (8888858257) · ગૌરવ ભાવાણી (9021223266)
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-200 no-print">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>પહોંચ પ્રિન્ટ કરો (Print)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-xl transition-colors"
            >
              પૂર્ણ (Done)
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
