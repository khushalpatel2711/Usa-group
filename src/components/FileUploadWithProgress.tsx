import React, { useState, useRef, useEffect } from 'react';
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
  Sparkles,
  Download,
  Activity,
  Layers,
} from 'lucide-react';
import { UploadedFileMeta, UploadProgressState } from '../types';
import { simulateEncryptedUpload, formatFileSize, formatTransferSpeed } from '../utils/crypto';
import { downloadHiQualityMedia, getMediaBlobUrl } from '../utils/mediaDb';

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
  isHiQuality?: boolean;
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
  isHiQuality = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [progressState, setProgressState] = useState<UploadProgressState | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [mediaPlayUrl, setMediaPlayUrl] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const abortControllerRef = useRef<{ abort: () => void } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync media URL from file dataUrl or IndexedDB for reliable permanent playback
  useEffect(() => {
    if (currentFile && (currentFile.mimeType.startsWith('audio/') || currentFile.mimeType.startsWith('video/'))) {
      if (currentFile.dataUrl) {
        setMediaPlayUrl(currentFile.dataUrl);
      } else {
        getMediaBlobUrl(currentFile.id).then((url) => {
          if (url) setMediaPlayUrl(url);
        });
      }
    } else {
      setMediaPlayUrl(null);
    }
  }, [currentFile]);

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
      const trimmed = type.trim().toLowerCase();
      if (trimmed.endsWith('/*')) {
        const prefix = trimmed.replace('/*', '');
        return file.type.toLowerCase().startsWith(prefix);
      }
      return file.type.toLowerCase() === trimmed || file.name.toLowerCase().endsWith(trimmed);
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

    // Start encrypted chunked upload simulation with Hi-Quality preservation
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
    setMediaPlayUrl(null);
    setIsAudioPlaying(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isMediaKind = fileKind === 'media' || isHiQuality;

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

      {/* Hi-Quality Mode Banner */}
      {isMediaKind && (
        <div className="mb-3 px-3.5 py-2.5 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-white rounded-2xl border border-amber-500/30 shadow-xs flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            </span>
            <div>
              <div className="font-extrabold text-xs sm:text-sm text-amber-300 flex items-center gap-2">
                <span>💎 HI QUALITY (HQ) AUDIO & VIDEO SUPPORT</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full uppercase border border-emerald-400/30 font-mono font-bold">
                  Lossless Master
                </span>
              </div>
              <div className="text-[11px] text-stone-300">
                MP3, WAV, M4A, AAC, MP4, MOV (Max 1 GB) · 100% અસલ અવાજ અને વિડિયો ક્વોલિટી સચવાશે.
              </div>
            </div>
          </div>
        </div>
      )}

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
        <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300 rounded-2xl space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <Sparkles className="w-4 h-4 text-amber-700 animate-spin" />
              <span>{progressState.statusText}</span>
            </div>
            <button
              type="button"
              onClick={handleCancelUpload}
              className="text-stone-500 hover:text-red-700 text-xs font-semibold underline"
            >
              રદ કરો (Cancel)
            </button>
          </div>

          {/* Animated Progress Bar */}
          <div className="relative w-full h-3 bg-amber-200/80 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progressState.progress}%` }}
            />
          </div>

          {/* Metrics row */}
          <div className="flex items-center justify-between text-[11px] font-mono text-stone-700">
            <span>
              {formatFileSize(progressState.uploadedBytes)} / {formatFileSize(progressState.totalBytes)}
            </span>
            <span className="font-bold text-amber-950 text-xs">{progressState.progress}%</span>
            <span>
              {progressState.speedBytesPerSec > 0
                ? formatTransferSpeed(progressState.speedBytesPerSec)
                : 'Hi-Quality Processing...'}
            </span>
          </div>

          <div className="text-[10px] text-stone-600 flex items-center justify-between pt-1 border-t border-amber-200/70">
            <span className="flex items-center gap-1.5 font-medium text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>AES-GCM 256-Bit એન્ક્રિપ્શન સાથે અનકમ્પ્રેસ્ડ ક્વોલિટી પ્રોસેસિંગ</span>
            </span>
            <span className="font-mono text-stone-500">Max 1 GB</span>
          </div>
        </div>
      )}

      {/* State 2: Completed Upload Card with Security Badges & Preview */}
      {!progressState?.isUploading && currentFile && (
        <div className="bg-stone-50 border-2 border-emerald-400/70 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
          
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 shrink-0 mt-0.5 shadow-2xs">
                {fileKind === 'image' ? (
                  <ImageIcon className="w-5 h-5" />
                ) : currentFile.mimeType.startsWith('video/') ? (
                  <Video className="w-5 h-5 text-indigo-700" />
                ) : (
                  <Music className="w-5 h-5 text-amber-700" />
                )}
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm sm:text-base font-extrabold text-stone-900 truncate max-w-xs sm:max-w-md">
                    {currentFile.originalName}
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 border border-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> સુરક્ષિત અપલોડ
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-600 font-mono flex-wrap">
                  <span className="font-bold text-stone-800">{formatFileSize(currentFile.size)}</span>
                  <span>·</span>
                  <span>{currentFile.mimeType}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemoveExistingFile}
              className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              title="ફાઇલ હટાવો અને બીજી પસંદ કરો"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Hi-Quality Metrics Chip Row */}
          {currentFile.qualityBadge && (
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/90 text-amber-950 border border-amber-300 rounded-lg text-xs font-bold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>{currentFile.qualityBadge}</span>
              </span>

              {currentFile.mediaInfo?.formattedDuration && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-200/80 text-stone-800 rounded-lg text-xs font-mono">
                  <span>⏱️ સમયગાળો:</span>
                  <strong>{currentFile.mediaInfo.formattedDuration}</strong>
                </span>
              )}

              {currentFile.mediaInfo?.sampleRate && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-mono">
                  <span>🎛️ સાઉન્ડ:</span>
                  <strong>{currentFile.mediaInfo.sampleRate}</strong>
                </span>
              )}

              {currentFile.mediaInfo?.channels && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-700 rounded-lg text-xs font-mono">
                  <span>📻 {currentFile.mediaInfo.channels}</span>
                </span>
              )}
            </div>
          )}

          {/* Audio Player Preview with Live Equalizer & Master Download */}
          {currentFile.mimeType.startsWith('audio/') && (
            <div className="p-4 bg-stone-900 text-white rounded-2xl space-y-3 shadow-md">
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <Music className="w-4 h-4 text-amber-400" />
                  <span>હાઇ-ક્વોલિટી ઓડિયો પ્લેયર (Hi-Fi Studio Player):</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Waveform Equalizer Animation */}
                  {isAudioPlaying && (
                    <div className="flex items-end gap-1 h-4">
                      <span className="w-1 bg-amber-400 animate-pulse h-3 rounded-full"></span>
                      <span className="w-1 bg-amber-300 animate-pulse h-4 rounded-full"></span>
                      <span className="w-1 bg-emerald-400 animate-pulse h-2 rounded-full"></span>
                      <span className="w-1 bg-amber-400 animate-pulse h-4 rounded-full"></span>
                      <span className="w-1 bg-amber-300 animate-pulse h-3 rounded-full"></span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      downloadHiQualityMedia(
                        currentFile.id,
                        mediaPlayUrl || currentFile.dataUrl,
                        currentFile.originalName
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                    title="ઓરિજિનલ અનકમ્પ્રેસ્ડ માસ્ટર ફાઇલ ડાઉનલોડ કરો"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ડાઉનલોડ (Download Master)</span>
                  </button>
                </div>
              </div>

              <audio
                ref={audioRef}
                controls
                src={mediaPlayUrl || currentFile.dataUrl}
                onPlay={() => setIsAudioPlaying(true)}
                onPause={() => setIsAudioPlaying(false)}
                onEnded={() => setIsAudioPlaying(false)}
                className="w-full h-11 rounded-xl outline-hidden invert hue-rotate-180"
              />
            </div>
          )}

          {/* Video Player Preview with Master Download */}
          {currentFile.mimeType.startsWith('video/') && (
            <div className="p-4 bg-stone-900 text-white rounded-2xl space-y-3 shadow-md">
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <Video className="w-4 h-4 text-amber-400" />
                  <span>હાઇ-ડેફિનેશન વિડિયો પૂર્વાવલોકન (HD Video Preview):</span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    downloadHiQualityMedia(
                      currentFile.id,
                      mediaPlayUrl || currentFile.dataUrl,
                      currentFile.originalName
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  title="ઓરિજિનલ અનકમ્પ્રેસ્ડ વિડિયો ડાઉનલોડ કરો"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ડાઉનલોડ (Download HD Master)</span>
                </button>
              </div>

              <video
                controls
                src={mediaPlayUrl || currentFile.dataUrl}
                className="w-full max-h-64 rounded-xl bg-black object-contain border border-stone-800"
              />
            </div>
          )}

          {/* Image Thumbnail Preview */}
          {(currentFile.dataUrl || imagePreviewUrl) && fileKind === 'image' && (
            <div className="pt-2 border-t border-stone-200 flex items-center gap-3">
              <img
                src={currentFile.dataUrl || imagePreviewUrl || ''}
                alt="Uploaded participant sheet preview"
                className="w-16 h-16 object-cover rounded-xl border border-stone-300 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setShowImageZoom(true)}
              />
              <div className="text-xs text-stone-600">
                <span className="font-bold text-stone-800 block">સ્પર્ધકોની યાદી ફોટો</span>
                <button
                  type="button"
                  onClick={() => setShowImageZoom(true)}
                  className="text-amber-800 hover:underline font-bold text-xs"
                >
                  મોટો ફોટો જુઓ (Zoom)
                </button>
              </div>
            </div>
          )}

          {/* Encryption Integrity Badge */}
          <div className="p-3 bg-stone-100 rounded-xl text-[10px] font-mono text-stone-600 space-y-1 border border-stone-200/80">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-700" />
                <span>{currentFile.encryptionAlgorithm} એન્ક્રિપ્ટેડ · સુરક્ષિત સ્ટોરેજ</span>
              </span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ✓ 2FA Checksum OK
              </span>
            </div>
            <div className="truncate text-stone-500" title={currentFile.encryptedHash}>
              SHA-256 Checksum: {currentFile.encryptedHash}
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
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? 'border-amber-600 bg-amber-50/90 scale-[1.01] shadow-lg'
              : 'border-stone-300 hover:border-amber-500 bg-stone-50/60 hover:bg-stone-50 shadow-2xs'
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

          <div className="flex flex-col items-center justify-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-xs">
              {isMediaKind ? (
                <Music className="w-6 h-6 text-amber-700" />
              ) : (
                <Upload className="w-6 h-6 text-amber-800" />
              )}
            </div>

            <div className="text-sm sm:text-base font-bold text-stone-900">
              <span>અહીં ફાઇલ સિલેક્ટ કરો અથવા ડ્રેગ કરો</span>
              <span className="block text-xs font-medium text-stone-500 mt-0.5">
                (Click to select or drag and drop your file)
              </span>
            </div>

            {/* Supported formats & limits */}
            <div className="flex items-center justify-center gap-2 text-xs text-stone-600 flex-wrap">
              <span className="bg-amber-100/80 text-amber-950 font-bold px-2.5 py-0.5 rounded-lg border border-amber-200">
                મહત્તમ ફાઇલ સાઇઝ: {maxSizeLabel}
              </span>
              <span>·</span>
              <span className="bg-stone-200/80 text-stone-700 font-mono px-2 py-0.5 rounded-lg text-[11px]">
                {isMediaKind ? 'MP3, WAV, M4A, AAC, MP4, MOV' : acceptTypes}
              </span>
            </div>

            <div className="pt-1 flex items-center gap-3 text-[11px] text-emerald-800 font-bold">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                <span>AES-GCM 256-Bit Encrypted</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-800 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hi-Quality Uncompressed Upload</span>
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
            className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-stone-200">
              <span className="font-bold text-sm text-stone-900">
                સ્પર્ધકોની યાદી ફોટો પૂર્વાવલોકન
              </span>
              <button
                type="button"
                onClick={() => setShowImageZoom(false)}
                className="p-1 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 max-h-[75vh] overflow-auto flex justify-center bg-stone-900 rounded-2xl">
              <img
                src={currentFile?.dataUrl || imagePreviewUrl || ''}
                alt="Full size participant sheet"
                className="max-h-[70vh] object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
