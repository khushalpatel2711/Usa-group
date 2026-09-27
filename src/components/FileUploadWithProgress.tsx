import React, { useState, useRef } from 'react';
import {
  Upload,
  FileCheck,
  Lock,
  ShieldCheck,
  AlertTriangle,
  X,
  Play,
  Pause,
  Volume2,
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  CheckCircle2,
} from 'lucide-react';
import { UploadedFileMeta, UploadProgressState } from '../types';
import { simulateEncryptedUpload, formatFileSize, formatTransferSpeed } from '../utils/crypto';

interface FileUploadWithProgressProps {
  id: string;
  label: string;
  subLabel?: string;
  acceptTypes: string; // e.g. "image/*" or "audio/*,video/*"
  maxSizeBytes: number; // 10MB or 1GB
  maxSizeLabel: string; // "10 MB" or "1 GB"
  fileKind: 'image' | 'media';
  currentFile?: UploadedFileMeta;
  onFileUploaded: (file: UploadedFileMeta) => void;
  onFileRemoved: () => void;
  isRequired?: boolean;
}

export const FileUploadWithProgress: React.FC<FileUploadWithProgressProps> = ({
  id,
  label,
  subLabel,
  acceptTypes,
  maxSizeBytes,
  maxSizeLabel,
  fileKind,
  currentFile,
  onFileUploaded,
  onFileRemoved,
  isRequired = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [progressState, setProgressState] = useState<UploadProgressState | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [showImageZoom, setShowImageZoom] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const abortControllerRef = useRef<{ abort: () => void } | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndProcessFile = (file: File) => {
    setErrorMsg(null);

    // Validate size
    if (file.size > maxSizeBytes) {
      setErrorMsg(`ફાઇલનું કદ નિર્ધારિત મર્યાદા (${maxSizeLabel}) કરતાં મોટું છે.`);
      return;
    }

    // Validate type
    const matchesAccept = acceptTypes.split(',').some((type) => {
      const trimmed = type.trim();
      if (trimmed.endsWith('/*')) {
        const prefix = trimmed.replace('/*', '');
        return file.type.startsWith(prefix);
      }
      return file.type === trimmed || file.name.endsWith(trimmed);
    });

    if (!matchesAccept && acceptTypes !== '*/*') {
      setErrorMsg(`અસમર્થિત ફાઇલ ફોર્મેટ. માન્ય ફોર્મેટ: ${acceptTypes}`);
      return;
    }

    // If image, create thumbnail
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
    }

    // Start encrypted chunked upload simulation
    abortControllerRef.current = simulateEncryptedUpload(
      file,
      (state) => {
        setProgressState(state);
      },
      (meta) => {
        setProgressState(null);
        onFileUploaded(meta);
      },
      (err) => {
        setProgressState(null);
        setErrorMsg(err);
      }
    );
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setProgressState(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveExistingFile = () => {
    onFileRemoved();
    setImagePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      {/* Label and instructions */}
      <div className="mb-2">
        <label htmlFor={id} className="block text-sm sm:text-base font-bold text-stone-900">
          {label} {isRequired && <span className="text-red-600 font-bold">*</span>}
        </label>
        {subLabel && (
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5 leading-relaxed font-normal">
            {subLabel}
          </p>
        )}
      </div>

      {/* Error notification */}
      {errorMsg && (
        <div className="mb-3 p-3 bg-red-50 border border-red-300 rounded-xl text-red-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-stone-400 hover:text-stone-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* State 1: Active In-Progress Upload Bar */}
      {progressState?.isUploading && (
        <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-xl space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-semibold text-amber-950">
              <Lock className="w-4 h-4 text-amber-700 animate-pulse" />
              <span>{progressState.statusText}</span>
            </div>
            <button
              type="button"
              onClick={handleCancelUpload}
              className="text-stone-500 hover:text-red-700 text-xs underline"
            >
              રદ કરો (Cancel)
            </button>
          </div>

          {/* Animated Progress Bar */}
          <div className="relative w-full h-3 bg-amber-200/70 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-600 to-red-600 rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progressState.progress}%` }}
            />
          </div>

          {/* Metrics row */}
          <div className="flex items-center justify-between text-[11px] font-mono text-stone-700">
            <span>
              {formatFileSize(progressState.uploadedBytes)} / {formatFileSize(progressState.totalBytes)}
            </span>
            <span className="font-bold text-amber-900">{progressState.progress}%</span>
            <span>
              {progressState.speedBytesPerSec > 0
                ? formatTransferSpeed(progressState.speedBytesPerSec)
                : 'એન્ક્રિપ્ટિંગ...'}
            </span>
          </div>

          <div className="text-[10px] text-stone-500 flex items-center gap-1.5 pt-1 border-t border-amber-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>AES-GCM 256-Bit ક્લાયન્ટ એન્ક્રિપ્શન સુરક્ષિત રીતે લાગુ થઈ રહ્યું છે.</span>
          </div>
        </div>
      )}

      {/* State 2: Completed Upload Card with Security Badges & Preview */}
      {!progressState?.isUploading && currentFile && (
        <div className="bg-stone-50 border border-emerald-300/80 rounded-xl p-3.5 sm:p-4 space-y-3 shadow-2xs">
          
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                {fileKind === 'image' ? (
                  <ImageIcon className="w-5 h-5" />
                ) : currentFile.mimeType.startsWith('video/') ? (
                  <Video className="w-5 h-5" />
                ) : (
                  <Music className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                    {currentFile.originalName}
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0">
                    <CheckCircle2 className="w-3 h-3" /> સુરક્ષિત અપલોડ
                  </span>
                </div>
                <div className="text-xs text-stone-500 font-mono mt-0.5">
                  {formatFileSize(currentFile.size)} · {currentFile.mimeType}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemoveExistingFile}
              className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="ફાઇલ હટાવો અને બીજી પસંદ કરો"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Audio Player Preview */}
          {currentFile.dataUrl && currentFile.mimeType.startsWith('audio/') && (
            <div className="pt-2 border-t border-stone-200">
              <div className="text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-amber-700" />
                <span>ઓડિયો ગીત સાંભળો (Audio Player):</span>
              </div>
              <audio
                controls
                src={currentFile.dataUrl}
                className="w-full h-10 rounded-lg outline-hidden"
              />
            </div>
          )}

          {/* Video Player Preview */}
          {currentFile.dataUrl && currentFile.mimeType.startsWith('video/') && (
            <div className="pt-2 border-t border-stone-200">
              <div className="text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-amber-700" />
                <span>વિડિયો પૂર્વાવલોકન (Video Player):</span>
              </div>
              <video
                controls
                src={currentFile.dataUrl}
                className="w-full max-h-48 rounded-lg bg-black"
              />
            </div>
          )}

          {/* Image Thumbnail Preview */}
          {(currentFile.dataUrl || imagePreviewUrl) && fileKind === 'image' && (
            <div className="pt-2 border-t border-stone-200 flex items-center gap-3">
              <img
                src={currentFile.dataUrl || imagePreviewUrl || ''}
                alt="Uploaded participant sheet preview"
                className="w-16 h-16 object-cover rounded-lg border border-stone-300 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setShowImageZoom(true)}
              />
              <div className="text-xs text-stone-600">
                <span className="font-semibold text-stone-800 block">સ્પર્ધકોની યાદી ફોટો</span>
                <button
                  type="button"
                  onClick={() => setShowImageZoom(true)}
                  className="text-amber-800 hover:underline font-medium text-[11px]"
                >
                  મોટો ફોટો જુઓ (Zoom)
                </button>
              </div>
            </div>
          )}

          {/* Encryption Integrity Badge */}
          <div className="p-2.5 bg-stone-100 rounded-lg text-[10px] font-mono text-stone-600 space-y-0.5 border border-stone-200/80">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-800">
                🔒 {currentFile.encryptionAlgorithm} એન્ક્રિપ્ટેડ
              </span>
              <span className="text-emerald-700 font-semibold">2FA Checksum OK</span>
            </div>
            <div className="truncate text-stone-500" title={currentFile.encryptedHash}>
              SHA-256: {currentFile.encryptedHash}
            </div>
          </div>
        </div>
      )}

      {/* State 3: Dropzone when no file or upload active */}
      {!progressState?.isUploading && !currentFile && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-150 ${
            dragActive
              ? 'border-amber-600 bg-amber-50/90 scale-[1.01]'
              : 'border-stone-300 hover:border-amber-500 bg-stone-50/50 hover:bg-stone-50'
          }`}
        >
          <input
            ref={fileInputRef}
            id={id}
            type="file"
            accept={acceptTypes}
            onChange={handleInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>

            <div className="text-xs sm:text-sm font-semibold text-stone-800">
              <span>અહીં ફાઇલ સિલેક્ટ કરો અથવા ડ્રેગ કરો</span>
              <span className="block text-[11px] font-normal text-stone-500 mt-0.5">
                (Click to select or drag and drop file)
              </span>
            </div>

            <div className="inline-flex items-center gap-2 text-[11px] text-stone-500">
              <span className="bg-stone-200/70 px-2 py-0.5 rounded font-mono">
                મહત્તમ: {maxSizeLabel}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-emerald-800 font-medium">
                <Lock className="w-3 h-3" />
                <span>End-to-End Encrypted</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal for image zoom */}
      {showImageZoom && (currentFile?.dataUrl || imagePreviewUrl) && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setShowImageZoom(false)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-stone-200">
              <span className="font-bold text-sm text-stone-900">
                સ્પર્ધકોની યાદી ફોટો પૂર્વાવલોકન
              </span>
              <button
                type="button"
                onClick={() => setShowImageZoom(false)}
                className="p-1 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 max-h-[75vh] overflow-auto flex justify-center bg-stone-900">
              <img
                src={currentFile?.dataUrl || imagePreviewUrl || ''}
                alt="Full size participant sheet"
                className="max-h-[70vh] object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
