import { RegistrationEntry, AdminUser, AdminUploadedFile, AuditLog } from '../types';

const STORAGE_KEYS = {
  ENTRIES: 'dussehra_2026_registrations',
  ADMIN_SESSION: 'dussehra_2026_admin_session',
  ADMIN_FILES: 'dussehra_2026_admin_files',
  CURRENT_EMAIL: 'dussehra_2026_active_email',
  LOGS: 'dussehra_2026_audit_logs',
};

// Initial seeded entries - empty for fresh user submissions
const INITIAL_ENTRIES: RegistrationEntry[] = [];

// Initial audit logs
const INITIAL_LOGS: AuditLog[] = [
  {
    id: 'log_init_1',
    timestamp: new Date().toISOString(),
    action: 'system',
    details: 'દશેરા ૨૦૨૬ પોર્ટલ ઓનલાઈન. AES-256 એન્ક્રિપ્શન મોનિટરિંગ સક્રિય.',
    performedBy: 'System Core',
  },
];

// Initial seeded admin documents
const INITIAL_ADMIN_FILES: AdminUploadedFile[] = [
  {
    id: 'doc_1',
    title: 'દશેરા ૨૦૨૬ સ્ટેજ ક્રમ અને રન-શીટ (ડ્રાફ્ટ)',
    documentType: 'stage_run_sheet',
    file: {
      id: 'admin_file_1',
      originalName: 'Dussehra_2026_Stage_RunSheet_V1.pdf',
      size: 450200,
      mimeType: 'application/pdf',
      encryptedHash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8',
      encryptionAlgorithm: 'AES-GCM-256',
      ivHex: '1a2b3c4d5e6f7a8b9c0d1e2f',
      uploadedAt: '2026-09-25T11:00:00.000Z',
      encryptedStatus: 'verified',
    },
    uploadedBy: 'કેતન દીવાની (સાંસ્કૃતિક પ્રમુખ)',
    uploadedAt: '2026-09-25T11:00:00.000Z',
    notes: 'સાંસ્કૃતિક કાર્યક્રમનો કાર્યક્રમ વાઇઝ સમયપત્રક અને સ્ટેજ એન્ટ્રી ક્રમ.',
    isConfidential: true,
  },
  {
    id: 'doc_2',
    title: 'LED સ્ક્રીન બેકગ્રાઉન્ડ વીડિયો ફોર્મેટ ગાઈડલાઈન્સ',
    documentType: 'led_assets',
    file: {
      id: 'admin_file_2',
      originalName: 'LED_Screen_Spec_and_Resolution_Guide.pdf',
      size: 890100,
      mimeType: 'application/pdf',
      encryptedHash: 'b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
      encryptionAlgorithm: 'AES-GCM-256',
      ivHex: '9f8e7d6c5b4a3928170f9e8d',
      uploadedAt: '2026-09-25T12:30:00.000Z',
      encryptedStatus: 'verified',
    },
    uploadedBy: 'જીગ્નેશ પોકાર (ટેકનિકલ કોઓર્ડિનેટર)',
    uploadedAt: '2026-09-25T12:30:00.000Z',
    notes: 'પેન ડ્રાઇવમાં જમા કરાવવાના વિડિયોનું 1920x1080 ફોર્મેટ સ્પેસિફિકેશન.',
    isConfidential: false,
  },
];

export const COMMITTEE_ACCOUNTS: AdminUser[] = [
  {
    id: 'admin_ketan',
    email: 'ketan@umiya.org',
    name: 'કેતન દીવાની (Ketan Diwani)',
    role: 'Cultural Committee Head',
    phone: '8888858257',
    avatarInitials: 'KD',
  },
  {
    id: 'admin_gaurav',
    email: 'gaurav@umiya.org',
    name: 'ગૌરવ ભવાની (Gaurav Bhawani)',
    role: 'Committee Member',
    phone: '9021223266',
    avatarInitials: 'GB',
  },
  {
    id: 'admin_jignesh',
    email: 'jignesh@umiya.org',
    name: 'જીગ્નેશ પોકાર (Jignesh Pokar)',
    role: 'Technical Head',
    phone: '9890191916',
    avatarInitials: 'JP',
  },
  {
    id: 'admin_khushal',
    email: 'khushalpatel1997@gmail.com',
    name: 'ખુશાલ પટેલ (Khushal Patel)',
    role: 'Stage Coordinator',
    phone: '9898989898',
    avatarInitials: 'KP',
  },
];

export function getStoredEntries(): RegistrationEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify([]));
      return [];
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading entries from storage', err);
    return [];
  }
}

export function clearAllEntries(): void {
  localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify([]));
  addAuditLog('all_entries_cleared', 'તમામ રજીસ્ટ્રેશન એન્ટ્રીઓ સાફ કરવામાં આવી.', 'સાંસ્કૃતિક સમિતિ એડમિન');
}

export function deleteEntry(id: string): RegistrationEntry[] {
  const current = getStoredEntries();
  const target = current.find(e => e.id === id);
  const updated = current.filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(updated));
  if (target) {
    addAuditLog('entry_deleted', `એન્ટ્રી ${target.entryNumber} (${target.performanceTitle}) ડિલીટ કરી.`, 'સાંસ્કૃતિક સમિતિ એડમિન');
  }
  return updated;
}

export function saveEntry(entry: RegistrationEntry): RegistrationEntry {
  const current = getStoredEntries();
  const updated = [entry, ...current.filter(e => e.id !== entry.id)];
  localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(updated));
  addAuditLog('entry_created', `નવી એન્ટ્રી ${entry.entryNumber} (${entry.performanceTitle}) સબમિટ થઈ.`, entry.coordinatorName || 'સ્પર્ધક');
  return entry;
}

export function updateEntryStatus(
  id: string,
  status: RegistrationEntry['status'],
  notes?: string,
  rehearsalDate?: string,
  stageSequenceNumber?: number
): RegistrationEntry | null {
  const current = getStoredEntries();
  const index = current.findIndex(e => e.id === id);
  if (index === -1) return null;

  current[index] = {
    ...current[index],
    status,
    adminNotes: notes !== undefined ? notes : current[index].adminNotes,
    rehearsalDate: rehearsalDate !== undefined ? rehearsalDate : current[index].rehearsalDate,
    stageSequenceNumber: stageSequenceNumber !== undefined ? stageSequenceNumber : current[index].stageSequenceNumber,
  };

  localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(current));
  addAuditLog('status_updated', `એન્ટ્રી ${current[index].entryNumber} નું સ્ટેટસ અપડેટ થયું: ${status}`, 'સાંસ્કૃતિક સમિતિ');
  return current[index];
}

export function getStoredAdminFiles(): AdminUploadedFile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_FILES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_FILES, JSON.stringify(INITIAL_ADMIN_FILES));
      return INITIAL_ADMIN_FILES;
    }
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_ADMIN_FILES;
  }
}

export function saveAdminFile(file: AdminUploadedFile): AdminUploadedFile {
  const current = getStoredAdminFiles();
  const updated = [file, ...current];
  localStorage.setItem(STORAGE_KEYS.ADMIN_FILES, JSON.stringify(updated));
  addAuditLog('file_uploaded', `સમિતિ દસ્તાવેજ અપલોડ થયો: ${file.title}`, file.uploadedBy);
  return file;
}

export function deleteAdminFile(id: string): AdminUploadedFile[] {
  const current = getStoredAdminFiles();
  const target = current.find(f => f.id === id);
  const updated = current.filter(f => f.id !== id);
  localStorage.setItem(STORAGE_KEYS.ADMIN_FILES, JSON.stringify(updated));
  if (target) {
    addAuditLog('file_deleted', `દસ્તાવેજ ડિલીટ કર્યો: ${target.title}`, 'સાંસ્કૃતિક સમિતિ એડમિન');
  }
  return updated;
}

export function clearAllAdminFiles(): void {
  localStorage.setItem(STORAGE_KEYS.ADMIN_FILES, JSON.stringify([]));
  addAuditLog('file_deleted', 'તમામ સમિતિ ફાઇલો અને દસ્તાવેજો સાફ કર્યા.', 'સાંસ્કૃતિક સમિતિ એડમિન');
}

// LOGS MANAGEMENT
export function getStoredLogs(): AuditLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
      return INITIAL_LOGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_LOGS;
  }
}

export function addAuditLog(
  action: AuditLog['action'],
  details: string,
  performedBy: string = 'સાંસ્કૃતિક સમિતિ'
): AuditLog {
  const current = getStoredLogs();
  const newLog: AuditLog = {
    id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    action,
    details,
    performedBy,
  };
  const updated = [newLog, ...current.slice(0, 99)]; // Keep latest 100 logs
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to write audit log', err);
  }
  return newLog;
}

export function deleteSingleLog(id: string): AuditLog[] {
  const current = getStoredLogs();
  const updated = current.filter(l => l.id !== id);
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
  return updated;
}

export function clearAllLogs(): void {
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify([]));
}

export function getAdminSession(): AdminUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAdminSession(user: AdminUser | null): void {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  }
}

export function exportEntriesToCSV(entries: RegistrationEntry[]): void {
  const headers = [
    'Entry No',
    'Date',
    'Category',
    'Performance Title',
    'Duration',
    'Coordinator Name',
    'Phone Number',
    'Pre-Intro Required',
    'LED Video Required',
    'Status',
    'Rehearsal Date',
    'Admin Notes',
  ];

  const rows = entries.map(e => [
    e.entryNumber,
    new Date(e.submittedAt).toLocaleDateString('en-IN'),
    e.category === 'raas_garba'
      ? 'રાસ ગરબા'
      : e.category === 'dance'
      ? 'ડાન્સ'
      : e.category === 'natak'
      ? 'નાટક'
      : `અન્ય (${e.customCategory || ''})`,
    `"${(e.performanceTitle || '').replace(/"/g, '""')}"`,
    e.formattedDuration,
    `"${(e.coordinatorName || '').replace(/"/g, '""')}"`,
    e.coordinatorPhone,
    e.preIntroRequired ? 'YES' : 'NO',
    e.ledScreenRequired ? 'YES' : 'NO',
    e.status,
    e.rehearsalDate || '',
    `"${(e.adminNotes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Dussehra_2026_Entries_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
