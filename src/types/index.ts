export type ProgramCategory = 'raas_garba' | 'dance' | 'natak' | 'other';

export interface Participant {
  name: string;
  age: string;
}

export interface UploadedFileMeta {
  id: string;
  originalName: string;
  size: number;
  mimeType: string;
  encryptedHash: string; // SHA-256 Checksum
  encryptionAlgorithm: string; // e.g. 'AES-GCM-256'
  ivHex: string;
  dataUrl?: string;
  uploadedAt: string;
  encryptedStatus: 'client_encrypted' | 'verified';
}

export interface RegistrationEntry {
  id: string;
  entryNumber: string; // e.g. "DUS-2026-001"
  submittedAt: string;
  email?: string;
  category: ProgramCategory;
  customCategory?: string;
  performanceTitle: string; // કાર્યક્રમ નું નામ અથવા ગીત ના બોલ
  durationMinutes: number;
  durationSeconds: number;
  formattedDuration: string;
  participantsPhotoFile?: UploadedFileMeta;
  manualParticipants?: Participant[];
  coordinatorName: string; // કાર્યક્રમ તૈયાર કરાવનાર નું નામ
  coordinatorPhone: string; // તથા નંબર
  preIntroRequired: boolean; // કાર્યક્રમ શરૂ થાય તે પહેલા માહિતી
  preIntroDetails?: string;
  ledScreenRequired: boolean; // LED સ્ક્રીન વિડિયો
  songUploadChoice?: 'YES' | 'NO'; // ગીત અપલોડ વિકલ્પ
  songFile?: UploadedFileMeta;
  status: 'pending' | 'script_approved' | 'rehearsal_scheduled' | 'confirmed' | 'rejected';
  adminNotes?: string;
  rehearsalDate?: string;
  stageSequenceNumber?: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'Cultural Committee Member' | 'Committee Member' | 'Stage Coordinator' | 'Technical Head';
  phone: string;
  avatarInitials: string;
}

export interface AdminUploadedFile {
  id: string;
  title: string;
  documentType: 'stage_run_sheet' | 'script_pass' | 'rehearsal_schedule' | 'led_assets' | 'audio_master' | 'committee_minutes';
  file: UploadedFileMeta;
  uploadedBy: string;
  uploadedAt: string;
  notes?: string;
  isConfidential: boolean;
}

export interface UploadProgressState {
  isUploading: boolean;
  progress: number; // 0 - 100
  uploadedBytes: number;
  totalBytes: number;
  speedBytesPerSec: number;
  statusText: string;
  isEncrypting: boolean;
  encryptionProgress: number;
  error?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action:
    | 'entry_created'
    | 'status_updated'
    | 'entry_deleted'
    | 'file_uploaded'
    | 'file_deleted'
    | 'admin_login'
    | 'all_entries_cleared'
    | 'system';
  details: string;
  performedBy: string;
}
