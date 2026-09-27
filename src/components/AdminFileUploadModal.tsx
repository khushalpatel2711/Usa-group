import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
} from 'lucide-react';
import { AdminUser, AdminUploadedFile, UploadedFileMeta } from '../types';
import { FileUploadWithProgress } from './FileUploadWithProgress';
import { saveAdminFile } from '../utils/storage';

interface AdminFileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminUser: AdminUser;
  onFileSaved: (file: AdminUploadedFile) => void;
  lang: 'gu' | 'en';
}

export const AdminFileUploadModal: React.FC<AdminFileUploadModalProps> = ({
  isOpen,
  onClose,
  adminUser,
  onFileSaved,
  lang,
}) => {
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState<AdminUploadedFile['documentType']>('stage_run_sheet');
  const [notes, setNotes] = useState('');
  const [isConfidential, setIsConfidential] = useState(true);
  const [uploadedFileMeta, setUploadedFileMeta] = useState<UploadedFileMeta | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!docTitle.trim()) {
      setErrorMsg('દસ્તાવેજનું શીર્ષક (Title) લખવું ફરજિયાત છે.');
      return;
    }

    if (!uploadedFileMeta) {
      setErrorMsg('કૃપા કરીને અપલોડ કરવા માટે ફાઇલ પસંદ કરો.');
      return;
    }

    const newAdminFile: AdminUploadedFile = {
      id: `doc_${Date.now()}`,
      title: docTitle.trim(),
      documentType: docType,
      file: uploadedFileMeta,
      uploadedBy: `${adminUser.name} (${adminUser.role})`,
      uploadedAt: new Date().toISOString(),
      notes: notes.trim() || undefined,
      isConfidential,
    };

    saveAdminFile(newAdminFile);
    onFileSaved(newAdminFile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
      <div
        className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-amber-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-amber-800 via-amber-900 to-stone-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-600/60 border border-amber-400/40 text-amber-200">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg font-festive leading-tight">
                {lang === 'gu'
                  ? 'સમિતિ સત્તાવાર ફાઇલ અપલોડ'
                  : 'Committee Secure Document Upload'}
              </h3>
              <p className="text-[11px] text-amber-200/90 font-mono">
                Admin 2FA Verified: {adminUser.email}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              દસ્તાવેજ શીર્ષક (Document Title):
            </label>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="દા.ત. દશેરા ૨૦૨૬ સ્ટેજ રન-શીટ / રીહર્સલ સ્લોટ પ્લાન"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 font-medium"
              required
            />
          </div>

          {/* Document Type */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              ફાઇલ પ્રકાર (Category):
            </label>
            <select
              value={docType}
              onChange={(e) =>
                setDocType(e.target.value as AdminUploadedFile['documentType'])
              }
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 font-medium bg-white"
            >
              <option value="stage_run_sheet">દશેરા સ્ટેજ રન-શીટ (Stage Run Sheet)</option>
              <option value="script_pass">મંજૂર સ્ક્રિપ્ટ લિસ્ટ (Script Approval Pass)</option>
              <option value="rehearsal_schedule">રિહર્સલ સમયપત્રક (Rehearsal Schedule)</option>
              <option value="led_assets">LED સ્ક્રીન ગાઈડલાઈન્સ & મીડિયા (LED Assets)</option>
              <option value="audio_master">માસ્ટર ઓડિયો ટ્રેક લિસ્ટ (Master Audio Track)</option>
              <option value="committee_minutes">સમિતિ મીટિંગ નોંધ (Committee Minutes)</option>
            </select>
          </div>

          {/* File Upload with Progress and AES-GCM Encryption */}
          <div className="pt-1">
            <FileUploadWithProgress
              id="admin-doc-upload"
              label="સુરક્ષિત ફાઇલ અપલોડ કરો (Upload Secure File)"
              subLabel="PDF, Excel, Audio, Video, Image, અથવા ZIP ફાઇલો માન્ય છે. 256-Bit AES એન્ક્રિપ્શન આપમેળે લાગુ થશે."
              acceptTypes="*/*"
              maxSizeBytes={1024 * 1024 * 1024} // 1GB
              maxSizeLabel="1 GB"
              fileKind="media"
              currentFile={uploadedFileMeta}
              onFileUploaded={(meta) => setUploadedFileMeta(meta)}
              onFileRemoved={() => setUploadedFileMeta(undefined)}
              isRequired
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              સમિતિ નોંધ / સૂચના (Internal Notes):
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="આ ફાઇલ બાબતે સમિતિ સભ્યો માટે કોઈ ખાસ સૂચના..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Confidentiality toggle */}
          <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isConfidential}
              onChange={(e) => setIsConfidential(e.target.checked)}
              className="w-4 h-4 text-amber-700 rounded border-stone-300 focus:ring-amber-500"
            />
            <span className="font-semibold">
              🔒 આ ફાઇલ માત્ર 2FA વેરિફાઇડ સમિતિ સભ્યો માટે જ ગુપ્ત (Confidential) રાખવી
            </span>
          </label>

          {/* Action buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
            >
              રદ કરો (Cancel)
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-amber-700 to-red-700 hover:from-amber-800 hover:to-red-800 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>એન્ક્રિપ્ટેડ ફાઇલ સેવ કરો</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
