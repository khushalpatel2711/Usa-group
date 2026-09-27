import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Music,
  Users,
  AlertCircle,
  ShieldCheck,
  Send,
  Plus,
  Trash2,
  User,
  Phone,
  FileCheck2,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import {
  ProgramCategory,
  Participant,
  UploadedFileMeta,
  RegistrationEntry,
} from '../types';
import { FileUploadWithProgress } from './FileUploadWithProgress';
import { saveEntry } from '../utils/storage';

interface RegistrationFormProps {
  onSubmissionSuccess: (entry: RegistrationEntry) => void;
  lang: 'gu' | 'en';
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmissionSuccess,
  lang,
}) => {
  // Form inputs
  const [category, setCategory] = useState<ProgramCategory | ''>('');
  const [customCategory, setCustomCategory] = useState('');
  const [performanceTitle, setPerformanceTitle] = useState('');
  
  // Time duration
  const [durationMinutes, setDurationMinutes] = useState<number | ''>(5);
  const [durationSeconds, setDurationSeconds] = useState<number | ''>(0);

  // Files
  const [participantsPhoto, setParticipantsPhoto] = useState<UploadedFileMeta | undefined>(undefined);
  const [songFile, setSongFile] = useState<UploadedFileMeta | undefined>(undefined);

  // Optional direct participant table
  const [manualParticipants, setManualParticipants] = useState<Participant[]>([
    { name: '', age: '' },
  ]);
  const [showManualParticipantTable, setShowManualParticipantTable] = useState(false);

  // Coordinator
  const [coordinatorName, setCoordinatorName] = useState('');
  const [coordinatorPhone, setCoordinatorPhone] = useState('');

  // Questions
  const [preIntroRequired, setPreIntroRequired] = useState<'YES' | 'NO' | ''>('');
  const [preIntroDetails, setPreIntroDetails] = useState('');
  const [ledScreenRequired, setLedScreenRequired] = useState<'YES' | 'NO' | ''>('');

  // Dual-factor confirmation
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Participant list row handlers
  const handleAddParticipantRow = () => {
    setManualParticipants([...manualParticipants, { name: '', age: '' }]);
  };

  const handleRemoveParticipantRow = (index: number) => {
    if (manualParticipants.length > 1) {
      setManualParticipants(manualParticipants.filter((_, i) => i !== index));
    }
  };

  const handleParticipantChange = (index: number, field: 'name' | 'age', value: string) => {
    const updated = [...manualParticipants];
    updated[index][field] = value;
    setManualParticipants(updated);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!category) {
      newErrors.category = 'કૃપા કરીને કાર્યક્રમ પ્રકાર પસંદ કરો.';
    }

    if (category === 'other' && !customCategory.trim()) {
      newErrors.customCategory = 'અન્ય કાર્યક્રમની વિગત લખો.';
    }

    if (!performanceTitle.trim()) {
      newErrors.performanceTitle = 'કાર્યક્રમ નું નામ અથવા ગીત ના બોલ લખવા જરૂરી છે.';
    }

    const mins = Number(durationMinutes) || 0;
    const secs = Number(durationSeconds) || 0;
    if (mins === 0 && secs === 0) {
      newErrors.duration = 'કાર્યક્રમ નો સમય (મિનિટ/સેકન્ડ) લખવો જરૂરી છે.';
    }

    if (!participantsPhoto) {
      newErrors.participantsPhoto =
        'સ્પર્ધકોના નામ અને ઉંમર કાગળ પર લખી તેનો ફોટો અપલોડ કરવો ફરજિયાત છે.';
    }

    if (!coordinatorName.trim()) {
      newErrors.coordinatorName = 'કાર્યક્રમ તૈયાર કરાવનાર નું નામ લખો.';
    }

    if (!coordinatorPhone.trim() || coordinatorPhone.replace(/\D/g, '').length < 10) {
      newErrors.coordinatorPhone = 'માન્ય ૧૦ આંકડાનો મોબાઈલ નંબર લખો.';
    }

    if (!preIntroRequired) {
      newErrors.preIntro = 'કૃપા કરીને YES અથવા NO પસંદ કરો.';
    }

    if (!ledScreenRequired) {
      newErrors.ledScreen = 'કૃપા કરીને YES અથવા NO પસંદ કરો.';
    }

    if (!songFile) {
      newErrors.songFile = 'કાર્યક્રમનું ગીત (ઓડિયો અથવા વિડિયો ફાઇલ) અપલોડ કરવી ફરજિયાત છે.';
    }

    if (!termsAgreed) {
      newErrors.terms = 'નિયમો અને સમાજની મર્યાદા પાળવાની સહમતી જરૂરી છે.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Scroll to first error
      const firstKey = Object.keys(newErrors)[0];
      const element = document.getElementById(`field-${firstKey}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const mins = Number(durationMinutes) || 0;
    const secs = Number(durationSeconds) || 0;
    const formattedDuration = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const entryNumber = `DUS-2026-${randomSuffix}`;

    const validManualParticipants = manualParticipants.filter(
      (p) => p.name.trim() !== ''
    );

    const newEntry: RegistrationEntry = {
      id: `entry_${Date.now()}`,
      entryNumber,
      submittedAt: new Date().toISOString(),
      category: category as ProgramCategory,
      customCategory: category === 'other' ? customCategory : undefined,
      performanceTitle: performanceTitle.trim(),
      durationMinutes: mins,
      durationSeconds: secs,
      formattedDuration,
      participantsPhotoFile: participantsPhoto,
      manualParticipants: validManualParticipants.length > 0 ? validManualParticipants : undefined,
      coordinatorName: coordinatorName.trim(),
      coordinatorPhone: coordinatorPhone.trim(),
      preIntroRequired: preIntroRequired === 'YES',
      preIntroDetails: preIntroRequired === 'YES' ? preIntroDetails.trim() : undefined,
      ledScreenRequired: ledScreenRequired === 'YES',
      songFile: songFile!,
      status: 'pending',
    };

    setTimeout(() => {
      saveEntry(newEntry);
      setIsSubmitting(false);
      onSubmissionSuccess(newEntry);
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pb-16">
      
      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden"
      >
        
        {/* Form Top Header Banner */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-red-800 text-white p-6 sm:p-8">
          <div className="text-xs uppercase tracking-wider text-amber-200 font-bold mb-1">
            સત્તાવાર એન્ટ્રી ફોર્મ · OFFICIAL ENTRY FORM
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-festive">
            દશેરા સાંસ્કૃતિક કાર્યક્રમ - 2026 રજીસ્ટ્રેશન
          </h2>
          <p className="text-amber-100/90 text-xs sm:text-sm mt-1">
            શ્રી ઉમિયા સોશિયલ એક્ટિવિટી ગ્રુપ - નંદિની વિભાગ , નાશિક
          </p>
        </div>

        {/* Required Fields Notice Bar */}
        <div className="px-6 py-3.5 bg-stone-50 border-b border-stone-200/80 flex items-center justify-between text-xs text-stone-600">
          <span className="font-medium text-stone-700">કાર્યક્રમની વિગતો ભરીને નીચે સબમિટ કરો</span>
          <span className="text-red-700 font-semibold text-xs">* Indicates required question</span>
        </div>

        {/* Form Fields Section */}
        <div className="p-5 sm:p-8 space-y-8">
          
          {/* 1. કાર્યક્રમ (Program Type) */}
          <div id="field-category" className="space-y-3 border-b border-stone-100 pb-6">
            <div>
              <label className="block text-sm sm:text-base font-bold text-stone-900">
                કાર્યક્રમ <span className="text-red-600">*</span>
              </label>
              <p className="text-xs text-stone-500 mt-0.5">
                તમે કયા પ્રકારના સાંસ્કૃતિક કાર્યક્રમમાં ભાગ લેવા માંગો છો તે પસંદ કરો.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'raas_garba', label: 'રાસ ગરબા' },
                { id: 'dance', label: 'ડાન્સ' },
                { id: 'natak', label: 'નાટક' },
                { id: 'other', label: 'અન્ય' },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-3 p-3 sm:p-3.5 rounded-xl border cursor-pointer transition-all ${
                    category === opt.id
                      ? 'border-amber-600 bg-amber-50/60 shadow-2xs'
                      : 'border-stone-200 hover:border-amber-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="programCategory"
                    value={opt.id}
                    checked={category === opt.id}
                    onChange={() => setCategory(opt.id as ProgramCategory)}
                    className="w-4 h-4 text-amber-700 border-stone-300 focus:ring-amber-500"
                  />
                  <span className="text-sm sm:text-base font-semibold text-stone-900">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>

            {/* Warning notes depending on selection */}
            {category === 'dance' && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>મહત્વની નોંધ:</strong> સોલો ડાન્સ લેવામાં આવશે નહીં. માત્ર ગ્રુપ ડાન્સ જ માન્ય રહેશે.
                </span>
              </div>
            )}

            {category === 'natak' && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>મહત્વની નોંધ:</strong> નાટક હશે તો તેની મર્યાદા વિષય અનુસાર સાંસ્કૃતિક સમિતિ પાસે થી સ્ક્રિપ્ટ પાસ કરાવવાની રહેશે.
                </span>
              </div>
            )}

            {category === 'other' && (
              <div className="pt-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  અન્ય કાર્યક્રમની વિગત લખો (Specify program):
                </label>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="દા.ત. માઈમ, કવિતા, પ્રહસન વગેરે"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 text-sm"
                />
                {errors.customCategory && (
                  <p className="text-xs text-red-600 mt-1">{errors.customCategory}</p>
                )}
              </div>
            )}

            {errors.category && (
              <p className="text-xs text-red-600 font-medium">{errors.category}</p>
            )}
          </div>

          {/* 3. કાર્યક્રમ નું નામ અથવા ગીત ના બોલ */}
          <div id="field-performanceTitle" className="space-y-2 border-b border-stone-100 pb-6">
            <label className="block text-sm sm:text-base font-bold text-stone-900">
              કાર્યક્રમ નું નામ અથવા ગીત ના બોલ <span className="text-red-600">*</span>
            </label>
            <p className="text-xs text-stone-500">
              તમારા કાર્યક્રમનું શીર્ષક અથવા પ્રથમ ગીતના શબ્દો લખો.
            </p>
            <input
              type="text"
              value={performanceTitle}
              onChange={(e) => setPerformanceTitle(e.target.value)}
              placeholder="દા.ત. અંબા અભયપદ દાયિની રે... / પંખીડા તું ઉડી જાજે..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-stone-900 text-sm font-medium"
              required
            />
            {errors.performanceTitle && (
              <p className="text-xs text-red-600 font-medium">{errors.performanceTitle}</p>
            )}
          </div>

          {/* 4. કાર્યક્રમ નો સમય */}
          <div id="field-duration" className="space-y-3 border-b border-stone-100 pb-6">
            <div>
              <label className="block text-sm sm:text-base font-bold text-stone-900">
                કાર્યક્રમ નો સમય <span className="text-red-600">*</span>
              </label>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5 font-medium">
                તમારો કાર્યક્રમ કેટલા મિનિટ નો છે તે લખો.. am & pm થી કઈ લેવા દેવા નથી.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              
              {/* Minutes */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="45"
                  value={durationMinutes}
                  onChange={(e) =>
                    setDurationMinutes(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className="w-20 px-3 py-2 text-center text-lg font-bold font-mono rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 bg-white"
                  placeholder="05"
                />
                <span className="text-sm font-semibold text-stone-700">મિનિટ (Mins)</span>
              </div>

              <span className="text-xl font-bold text-stone-400">:</span>

              {/* Seconds */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={durationSeconds}
                  onChange={(e) =>
                    setDurationSeconds(
                      e.target.value === '' ? '' : Math.min(59, Math.max(0, parseInt(e.target.value) || 0))
                    )
                  }
                  className="w-20 px-3 py-2 text-center text-lg font-bold font-mono rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 bg-white"
                  placeholder="00"
                />
                <span className="text-sm font-semibold text-stone-700">સેકન્ડ (Secs)</span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 ml-auto">
                <span className="text-xs text-stone-500 hidden sm:inline">ઝડપી સમય:</span>
                {[3, 5, 7, 10].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setDurationMinutes(m);
                      setDurationSeconds(0);
                    }}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                      durationMinutes === m && durationSeconds === 0
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-amber-400'
                    }`}
                  >
                    {m} મિનિટ
                  </button>
                ))}
              </div>

            </div>

            {errors.duration && (
              <p className="text-xs text-red-600 font-medium">{errors.duration}</p>
            )}
          </div>

          {/* 5. કાર્યક્રમ માં ભાગ લેનારના નામ (Photo upload & Table) */}
          <div id="field-participantsPhoto" className="space-y-4 border-b border-stone-100 pb-6">
            <FileUploadWithProgress
              id="participants-photo-upload"
              label="કાર્યક્રમ માં ભાગ લેનારના નામ"
              subLabel="WRITE NAME AND AGE IN PAGE AND TAKE PHOTO AND UPLOAD HERE (Upload 1 supported file: image. Max 10 MB.)"
              acceptTypes="image/*,.jpg,.jpeg,.png,.webp,.heic"
              maxSizeBytes={10 * 1024 * 1024} // 10MB
              maxSizeLabel="10 MB"
              fileKind="image"
              currentFile={participantsPhoto}
              onFileUploaded={(meta) => {
                setParticipantsPhoto(meta);
                if (errors.participantsPhoto) {
                  const updated = { ...errors };
                  delete updated.participantsPhoto;
                  setErrors(updated);
                }
              }}
              onFileRemoved={() => setParticipantsPhoto(undefined)}
              isRequired
            />

            {errors.participantsPhoto && (
              <p className="text-xs text-red-600 font-medium">{errors.participantsPhoto}</p>
            )}

            {/* Optional Direct Participant List Table */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowManualParticipantTable(!showManualParticipantTable)}
                className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1.5 underline"
              >
                <span>
                  {showManualParticipantTable
                    ? '▼ સ્પર્ધકોનું ટેબલ છુપાવો (Hide manual table)'
                    : '► વૈકલ્પિક: સ્પર્ધકોના નામ અને ઉંમર અહીં સીધા ટાઈપ પણ કરી શકો છો (Add names in table)'}
                </span>
              </button>

              {showManualParticipantTable && (
                <div className="mt-3 p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="text-xs text-stone-600 font-medium">
                    ભાગ લેનાર દરેક સભ્યનું પૂરું નામ અને ઉંમર:
                  </div>

                  <div className="space-y-2">
                    {manualParticipants.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-6 text-center text-xs font-bold text-stone-500 font-mono">
                          {idx + 1}.
                        </span>
                        <input
                          type="text"
                          placeholder="સભ્યનું નામ (Full Name)"
                          value={p.name}
                          onChange={(e) => handleParticipantChange(idx, 'name', e.target.value)}
                          className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-stone-300 bg-white focus:ring-1 focus:ring-amber-500"
                        />
                        <input
                          type="text"
                          placeholder="ઉંમર (Age)"
                          value={p.age}
                          onChange={(e) => handleParticipantChange(idx, 'age', e.target.value)}
                          className="w-20 px-3 py-1.5 text-xs text-center rounded-xl border border-stone-300 bg-white focus:ring-1 focus:ring-amber-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveParticipantRow(idx)}
                          disabled={manualParticipants.length === 1}
                          className="p-1.5 text-stone-400 hover:text-red-700 disabled:opacity-30 rounded"
                          title="કાઢી નાખો"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddParticipantRow}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>વધુ સભ્ય ઉમેરો (Add Row)</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 6. કાર્યક્રમ તૈયાર કરાવનાર નું નામ તથા નંબર */}
          <div id="field-coordinatorName" className="space-y-3 border-b border-stone-100 pb-6">
            <div>
              <label className="block text-sm sm:text-base font-bold text-stone-900">
                કાર્યક્રમ તૈયાર કરાવનાર નું નામ તથા નંબર <span className="text-red-600">*</span>
              </label>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5 font-medium">
                જવાબદાર વ્યક્તિ નું નામ અને નંબર
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  તૈયાર કરાવનાર / જવાબદાર વ્યક્તિનું નામ (Name):
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={coordinatorName}
                    onChange={(e) => setCoordinatorName(e.target.value)}
                    placeholder="દા.ત. રમેશભાઈ પટેલ / કવિતાબેન"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm font-medium"
                    required
                  />
                </div>
                {errors.coordinatorName && (
                  <p className="text-xs text-red-600 mt-1">{errors.coordinatorName}</p>
                )}
              </div>

              <div id="field-coordinatorPhone">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  સંપર્ક મોબાઈલ નંબર (10-Digit Mobile):
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    maxLength={10}
                    value={coordinatorPhone}
                    onChange={(e) => setCoordinatorPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="દા.ત. 9825012345"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm font-mono font-medium"
                    required
                  />
                </div>
                {errors.coordinatorPhone && (
                  <p className="text-xs text-red-600 mt-1">{errors.coordinatorPhone}</p>
                )}
              </div>
            </div>
          </div>

          {/* 7. કાર્યક્રમ શરૂ થાય તે પહેલા કાર્યક્રમ વિષે કઈ માહિતી આપવી છે? */}
          <div id="field-preIntro" className="space-y-3 border-b border-stone-100 pb-6">
            <div>
              <label className="block text-sm sm:text-base font-bold text-stone-900">
                કાર્યક્રમ શરૂ થાય તે પહેલા કાર્યક્રમ વિષે કઈ માહિતી આપવી છે? <span className="text-red-600">*</span>
              </label>
              <p className="text-xs text-stone-500 mt-0.5">
                સ્ટેજ પર એન્કરિંગ દરમિયાન કોઈ પ્રસ્તાવના કે કલાકારોનો પરિચય આપવાનો છે?
              </p>
            </div>

            <div className="flex items-center gap-6">
              {['YES', 'NO'].map((val) => (
                <label
                  key={val}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl border cursor-pointer font-bold text-sm transition-all ${
                    preIntroRequired === val
                      ? 'border-amber-600 bg-amber-50/70 text-amber-900'
                      : 'border-stone-200 hover:border-amber-300 text-stone-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="preIntroOption"
                    value={val}
                    checked={preIntroRequired === val}
                    onChange={() => setPreIntroRequired(val as 'YES' | 'NO')}
                    className="w-4 h-4 text-amber-700 border-stone-300 focus:ring-amber-500"
                  />
                  <span>{val}</span>
                </label>
              ))}
            </div>

            {preIntroRequired === 'YES' && (
              <div className="pt-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  એન્કરિંગ / પ્રસ્તાવના માટેની વિગત લખો (Write introduction notes):
                </label>
                <textarea
                  rows={3}
                  value={preIntroDetails}
                  onChange={(e) => setPreIntroDetails(e.target.value)}
                  placeholder="દા.ત. આ ગરબો મા ઉમિયા ના નવ દિવ્ય રૂપો ની વંદના રજૂ કરે છે..."
                  className="w-full p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 text-sm"
                />
              </div>
            )}

            {errors.preIntro && (
              <p className="text-xs text-red-600 font-medium">{errors.preIntro}</p>
            )}
          </div>

          {/* 8. કાર્યક્રમ દરમ્યાન LED સ્ક્રીન પર કઈ બતાવવા નું છે ? */}
          <div id="field-ledScreen" className="space-y-3 border-b border-stone-100 pb-6">
            <div>
              <label className="block text-sm sm:text-base font-bold text-stone-900">
                કાર્યક્રમ દરમ્યાન LED સ્ક્રીન પર કઈ બતાવવા નું છે ? <span className="text-red-600">*</span>
              </label>
              <div className="p-3 bg-amber-50/80 border border-amber-300 rounded-xl text-xs sm:text-sm text-stone-800 font-medium mt-1 leading-relaxed">
                કાર્યક્રમ દરમ્યાન જો led સ્ક્રીન પર કઈ બતાવવા ના હો તોહ તે વિડિયો તમને જાતે તૈયાર કરીને પેન ડ્રાઇવ માં પહોંચાડવા નું રહેશે.
              </div>
            </div>

            <div className="flex items-center gap-6">
              {['YES', 'NO'].map((val) => (
                <label
                  key={val}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl border cursor-pointer font-bold text-sm transition-all ${
                    ledScreenRequired === val
                      ? 'border-amber-600 bg-amber-50/70 text-amber-900'
                      : 'border-stone-200 hover:border-amber-300 text-stone-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="ledScreenOption"
                    value={val}
                    checked={ledScreenRequired === val}
                    onChange={() => setLedScreenRequired(val as 'YES' | 'NO')}
                    className="w-4 h-4 text-amber-700 border-stone-300 focus:ring-amber-500"
                  />
                  <span>{val}</span>
                </label>
              ))}
            </div>

            {ledScreenRequired === 'YES' && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>
                  <strong>યાદ રાખો:</strong> પેન ડ્રાઇવમાં MP4 (1080p) ફોર્મેટમાં વિડિયો તૈયાર કરી રિહર્સલના દિવસે ટેકનિકલ હેડ <strong>જીગ્નેશ પોકાર (9890191916)</strong> ને જમા કરાવવાનો રહેશે.
                </span>
              </div>
            )}

            {errors.ledScreen && (
              <p className="text-xs text-red-600 font-medium">{errors.ledScreen}</p>
            )}
          </div>

          {/* 9. PLEASE UPLOAD SONG HERE (Audio or Video, Max 1 GB) */}
          <div id="field-songFile" className="space-y-4 border-b border-stone-100 pb-6">
            <FileUploadWithProgress
              id="song-file-upload"
              label="PLEASE UPLOAD SONG HERE"
              subLabel="Upload 1 supported file: audio or video. Max 1 GB."
              acceptTypes="audio/*,video/*,.mp3,.wav,.m4a,.aac,.mp4,.mov,.mkv"
              maxSizeBytes={1024 * 1024 * 1024} // 1 GB
              maxSizeLabel="1 GB"
              fileKind="media"
              currentFile={songFile}
              onFileUploaded={(meta) => {
                setSongFile(meta);
                if (errors.songFile) {
                  const updated = { ...errors };
                  delete updated.songFile;
                  setErrors(updated);
                }
              }}
              onFileRemoved={() => setSongFile(undefined)}
              isRequired
            />

            {errors.songFile && (
              <p className="text-xs text-red-600 font-medium">{errors.songFile}</p>
            )}
          </div>

          {/* Dual-Factor Security & Terms Confirmation */}
          <div id="field-terms" className="p-4 bg-amber-50/60 border border-amber-300 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-xs sm:text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>ડ્યુઅલ-ફેક્ટર પ્રમાણીકરણ અને નિયમોની બાંહેધરી</span>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="w-4 h-4 text-amber-700 rounded border-stone-300 focus:ring-amber-500 mt-1 shrink-0"
              />
              <span className="text-xs sm:text-[13px] text-stone-700 leading-relaxed">
                હું ખાતરી આપું છું કે અમારા કાર્યક્રમમાં સમાજની મર્યાદા જળવાશે. અમે સાંસ્કૃતિક સમિતિને નિયત સમયે રિહર્સલ બતાવીશું અને સમિતિનો નિર્ણય આખરી રહેશે.
              </span>
            </label>

            {errors.terms && (
              <p className="text-xs text-red-600 font-medium">{errors.terms}</p>
            )}
          </div>

          {/* Submission Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-stone-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>સબમિટ થતાં જ AES-256 એન્ક્રિપ્ટેડ પહોંચ (Receipt) મળશે.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-amber-700 via-amber-800 to-red-800 hover:from-amber-800 hover:to-red-900 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>સુરક્ષિત સબમિટ થઈ રહ્યું છે...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>ફોર્મ સબમિટ કરો (Submit Form)</span>
                </>
              )}
            </button>
          </div>

        </div>

      </form>

    </div>
  );
};
