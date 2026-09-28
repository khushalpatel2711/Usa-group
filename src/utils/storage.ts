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
    uploadedBy: 'કેતન દીવાની (સાંસ્કૃતિક સમિતિ)',
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
    role: 'Cultural Committee Member',
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
    name: 'ખુશાલ પજવાણી (Khushal Pajwani)',
    role: 'Stage Coordinator',
    phone: '7744064106',
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

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  existingEntry?: RegistrationEntry;
  reason?: 'phone' | 'name' | 'both';
  message?: string;
}

/**
 * Checks if an active (non-rejected) entry already exists with the same mobile number or coordinator name.
 * Rule: One mobile number and name can make a single entry only.
 * If the admin rejects the entry (status === 'rejected'), then only can the same mobile number and name submit a new entry.
 */
export function checkDuplicateEntry(name: string, phone: string, currentEntryId?: string): DuplicateCheckResult {
  const entries = getStoredEntries();
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  const cleanName = name.trim().toLowerCase();

  // If neither phone nor name is provided yet, no conflict
  if (!cleanPhone && !cleanName) {
    return { isDuplicate: false };
  }

  // Look for any active entry that is NOT rejected
  const duplicate = entries.find((entry) => {
    // If editing the same entry, ignore itself
    if (currentEntryId && entry.id === currentEntryId) {
      return false;
    }

    // CRITICAL: If the entry was REJECTED by admin, it does NOT block a new entry!
    if (entry.status === 'rejected') {
      return false;
    }

    const existingCleanPhone = (entry.coordinatorPhone || '').replace(/\D/g, '').slice(-10);
    const existingCleanName = (entry.coordinatorName || '').trim().toLowerCase();

    const phoneMatches = Boolean(cleanPhone && existingCleanPhone && cleanPhone === existingCleanPhone);
    const nameMatches = Boolean(cleanName && existingCleanName && cleanName === existingCleanName);

    return phoneMatches || nameMatches;
  });

  if (!duplicate) {
    return { isDuplicate: false };
  }

  const existingCleanPhone = (duplicate.coordinatorPhone || '').replace(/\D/g, '').slice(-10);
  const existingCleanName = (duplicate.coordinatorName || '').trim().toLowerCase();
  const phoneMatches = Boolean(cleanPhone && existingCleanPhone && cleanPhone === existingCleanPhone);
  const nameMatches = Boolean(cleanName && existingCleanName && cleanName === existingCleanName);

  let reason: 'phone' | 'name' | 'both' = 'both';
  if (phoneMatches && !nameMatches) reason = 'phone';
  else if (!phoneMatches && nameMatches) reason = 'name';

  const statusGujarati =
    duplicate.status === 'confirmed'
      ? 'કન્ફર્મ (Confirmed)'
      : duplicate.status === 'script_approved'
      ? 'સ્ક્રિપ્ટ મંજૂર (Script Approved)'
      : duplicate.status === 'rehearsal_scheduled'
      ? 'રિહર્સલ નિયત (Rehearsal Scheduled)'
      : 'ચકાસણી હેઠળ પેન્ડિંગ (Pending Review)';

  let message = '';
  if (reason === 'both') {
    message = `આ નામ "${duplicate.coordinatorName}" અને મોબાઈલ નંબર (${duplicate.coordinatorPhone}) પરથી પહેલેથી એન્ટ્રી નોંધાયેલ છે (ટોકન: ${duplicate.entryNumber}, ગીત: "${duplicate.performanceTitle}", સ્થિતિ: ${statusGujarati}). એક મોબાઈલ નંબર અને નામ પરથી માત્ર ૧ જ એન્ટ્રી માન્ય છે. જો એડમિન દ્વારા આ અગાઉની એન્ટ્રી રીજેક્ટ (Reject) કરવામાં આવે, તો જ નવી એન્ટ્રી કરી શકાશે.`;
  } else if (reason === 'phone') {
    message = `આ મોબાઈલ નંબર (${duplicate.coordinatorPhone}) પરથી પહેલેથી એન્ટ્રી નોંધાયેલ છે (ટોકન: ${duplicate.entryNumber}, ગીત: "${duplicate.performanceTitle}", સ્થિતિ: ${statusGujarati}). એક મોબાઈલ નંબર પરથી માત્ર ૧ જ એન્ટ્રી માન્ય છે. જો એડમિન દ્વારા તે એન્ટ્રી રીજેક્ટ (Reject) થાય, તો જ આ નંબર પરથી નવી એન્ટ્રી કરી શકાશે.`;
  } else {
    message = `આ નામ "${duplicate.coordinatorName}" પરથી પહેલેથી એન્ટ્રી નોંધાયેલ છે (ટોકન: ${duplicate.entryNumber}, ગીત: "${duplicate.performanceTitle}", સ્થિતિ: ${statusGujarati}). એક વ્યક્તિના નામ પરથી માત્ર ૧ જ એન્ટ્રી માન્ય છે. જો એડમિન દ્વારા તે એન્ટ્રી રીજેક્ટ (Reject) થાય, તો જ નવી એન્ટ્રી કરી શકાશે.`;
  }

  return {
    isDuplicate: true,
    existingEntry: duplicate,
    reason,
    message,
  };
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
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (user && user.name && user.name.includes('પ્રમુખ')) {
      user.name = user.name.replace(/પ્રમુખ/g, '').replace(/\s+/g, ' ').trim();
      user.role = 'Cultural Committee Member';
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(user));
    }
    return user;
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
    'ટોકન નંબર',
    'તારીખ',
    'કેટેગરી',
    'કાર્યક્રમ / ડાન્સનું નામ',
    'કાર્યક્રમ નો સમય',
    'સ્પર્ધકોની સંખ્યા',
    'સ્પર્ધકોની યાદી',
    'કાર્યક્રમ તૈયાર કરાવનાર નું નામ',
    'કાર્યક્રમ તૈયાર કરાવનાર નો નંબર',
    'કાર્યક્રમ શરૂ થાય તે પહેલાં માહિતી (હા/ના)',
    'કાર્યક્રમ શરૂ થાય તે પહેલાં આપવાની માહિતી (વિગત)',
    'LED સ્ક્રીન વિડિયો',
    'સ્ટેટસ',
    'રિહર્સલ તારીખ',
    'સમિતિ શેરો / નોંધ',
  ];

  const rows = entries.map(e => {
    const participantsList =
      e.manualParticipants && e.manualParticipants.length > 0
        ? e.manualParticipants
            .map((p, i) => `${i + 1}. ${p.name}${p.age ? ` (${p.age} વર્ષ)` : ''}`)
            .join('; ')
        : '-';
    const participantsCount = e.manualParticipants?.length || 0;

    const statusLabel =
      e.status === 'confirmed'
        ? 'મંજૂર'
        : e.status === 'rejected'
        ? 'નામંજૂર'
        : e.status === 'rehearsal_scheduled'
        ? 'રિહર્સલ નક્કી થયેલ'
        : e.status === 'script_approved'
        ? 'સ્ક્રિપ્ટ મંજૂર'
        : 'પ્રતીક્ષામાં';

    return [
      e.entryNumber,
      new Date(e.submittedAt).toLocaleDateString('gu-IN'),
      e.category === 'raas_garba'
        ? 'રાસ ગરબા'
        : e.category === 'dance'
        ? 'ડાન્સ'
        : e.category === 'natak'
        ? 'નાટક'
        : `અન્ય ${e.customCategory ? `(${e.customCategory})` : ''}`,
      `"${(e.performanceTitle || '').replace(/"/g, '""')}"`,
      `"${e.formattedDuration || ''}"`,
      participantsCount,
      `"${participantsList.replace(/"/g, '""')}"`,
      `"${(e.coordinatorName || '').replace(/"/g, '""')}"`,
      `"${(e.coordinatorPhone || '').replace(/"/g, '""')}"`,
      e.preIntroRequired ? 'હા (YES)' : 'ના (NO)',
      `"${(e.preIntroRequired && e.preIntroDetails ? e.preIntroDetails : '').replace(/"/g, '""')}"`,
      e.ledScreenRequired ? 'હા' : 'ના',
      statusLabel,
      e.rehearsalDate || '',
      `"${(e.adminNotes || '').replace(/"/g, '""')}"`,
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `દશેરા_2026_એન્ટ્રીઓ_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Computes the file name for downloading participants list based on Dance name or Group name in Gujarati.
 */
export function getParticipantDownloadFileName(
  entry: RegistrationEntry,
  namingMode?: 'dance' | 'group' | 'both'
): string {
  const danceName = (entry.performanceTitle || '').trim();
  const groupName = (entry.coordinatorName || '').trim();

  let target = '';
  if (namingMode === 'dance') {
    target = danceName || groupName;
  } else if (namingMode === 'group') {
    target = groupName || danceName;
  } else {
    // If both dance name and group name are present and distinct, format as "Dance - Group"
    if (danceName && groupName && danceName.toLowerCase() !== groupName.toLowerCase()) {
      target = `${danceName} - ${groupName}`;
    } else {
      target = danceName || groupName || 'સ્પર્ધકોની_યાદી';
    }
  }

  // Remove filesystem forbidden characters: \ / : * ? " < > |
  const safe = target
    .replace(/[/\\?%*:|"<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return `${safe || 'સ્પર્ધકોની_યાદી'}.csv`;
}

/**
 * Downloads participant names for a specific entry as a CSV file in pure Gujarati.
 * The file name is set to the Dance name or Group name.
 */
export function downloadEntryParticipants(
  entry: RegistrationEntry,
  namingMode?: 'dance' | 'group' | 'both'
): void {
  const participants = entry.manualParticipants || [];
  if (participants.length === 0) {
    alert('આ એન્ટ્રીમાં કોઈ સ્પર્ધકોના નામ મળ્યા નથી.');
    return;
  }

  const headers = [
    'ક્રમ',
    'સ્પર્ધકનું પૂરું નામ',
    'ઉંમર',
    'કાર્યક્રમ / ડાન્સનું નામ',
    'કાર્યક્રમ નો સમય',
    'કેટેગરી',
    'ટોકન નંબર',
    'કાર્યક્રમ તૈયાર કરાવનાર નું નામ',
    'કાર્યક્રમ તૈયાર કરાવનાર નો નંબર',
    'કાર્યક્રમ શરૂ થાય તે પહેલાં માહિતી (Pre-Intro)',
  ];

  const categoryLabel =
    entry.category === 'raas_garba'
      ? 'રાસ ગરબા'
      : entry.category === 'dance'
      ? 'ડાન્સ'
      : entry.category === 'natak'
      ? 'નાટક'
      : `અન્ય ${entry.customCategory ? `(${entry.customCategory})` : ''}`;

  const preIntroText = entry.preIntroRequired
    ? entry.preIntroDetails
      ? `હા: ${entry.preIntroDetails}`
      : 'હા (YES)'
    : 'ના (NO)';

  const rows = participants.map((p, idx) => [
    idx + 1,
    `"${(p.name || '').replace(/"/g, '""')}"`,
    p.age ? `"${p.age}"` : '""',
    `"${(entry.performanceTitle || '').replace(/"/g, '""')}"`,
    `"${entry.formattedDuration || ''}"`,
    `"${categoryLabel}"`,
    `"${entry.entryNumber}"`,
    `"${(entry.coordinatorName || '').replace(/"/g, '""')}"`,
    `"${(entry.coordinatorPhone || '').replace(/"/g, '""')}"`,
    `"${preIntroText.replace(/"/g, '""')}"`,
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,\uFEFF' +
    [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);

  const downloadFileName = getParticipantDownloadFileName(entry, namingMode);
  link.setAttribute('download', downloadFileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Downloads all participants across all registrations in a consolidated master CSV in pure Gujarati.
 */
export function exportAllParticipantsToCSV(entries: RegistrationEntry[]): void {
  const allRows: string[][] = [];
  let globalIndex = 1;

  entries.forEach((entry) => {
    const categoryLabel =
      entry.category === 'raas_garba'
        ? 'રાસ ગરબા'
        : entry.category === 'dance'
        ? 'ડાન્સ'
        : entry.category === 'natak'
        ? 'નાટક'
        : `અન્ય ${entry.customCategory ? `(${entry.customCategory})` : ''}`;

    const statusLabel =
      entry.status === 'confirmed'
        ? 'મંજૂર'
        : entry.status === 'rejected'
        ? 'નામંજૂર'
        : entry.status === 'rehearsal_scheduled'
        ? 'રિહર્સલ નક્કી થયેલ'
        : entry.status === 'script_approved'
        ? 'સ્ક્રિપ્ટ મંજૂર'
        : 'પ્રતીક્ષામાં';

    const preIntroText = entry.preIntroRequired
      ? entry.preIntroDetails
        ? `હા: ${entry.preIntroDetails}`
        : 'હા (YES)'
      : 'ના (NO)';

    const participants = entry.manualParticipants || [];
    if (participants.length > 0) {
      participants.forEach((p, idx) => {
        allRows.push([
          String(globalIndex++),
          entry.entryNumber,
          `"${(p.name || '').replace(/"/g, '""')}"`,
          p.age ? `"${p.age}"` : '""',
          String(idx + 1),
          `"${(entry.performanceTitle || '').replace(/"/g, '""')}"`,
          `"${entry.formattedDuration || ''}"`,
          `"${categoryLabel}"`,
          `"${(entry.coordinatorName || '').replace(/"/g, '""')}"`,
          `"${(entry.coordinatorPhone || '').replace(/"/g, '""')}"`,
          `"${preIntroText.replace(/"/g, '""')}"`,
          statusLabel,
        ]);
      });
    } else {
      // Entry with no participant rows listed
      allRows.push([
        String(globalIndex++),
        entry.entryNumber,
        '"- (કોઈ સભ્ય યાદી નથી) -"',
        '""',
        '1',
        `"${(entry.performanceTitle || '').replace(/"/g, '""')}"`,
        `"${entry.formattedDuration || ''}"`,
        `"${categoryLabel}"`,
        `"${(entry.coordinatorName || '').replace(/"/g, '""')}"`,
        `"${(entry.coordinatorPhone || '').replace(/"/g, '""')}"`,
        `"${preIntroText.replace(/"/g, '""')}"`,
        statusLabel,
      ]);
    }
  });

  const headers = [
    'કુલ ક્રમ',
    'ટોકન નંબર',
    'સ્પર્ધકનું પૂરું નામ',
    'ઉંમર',
    'ગ્રૂપ ક્રમ',
    'કાર્યક્રમ / ડાન્સનું નામ',
    'કાર્યક્રમ નો સમય',
    'કેટેગરી',
    'કાર્યક્રમ તૈયાર કરાવનાર નું નામ',
    'કાર્યક્રમ તૈયાર કરાવનાર નો નંબર',
    'કાર્યક્રમ શરૂ થાય તે પહેલાં માહિતી (Pre-Intro)',
    'સ્ટેટસ',
  ];

  const csvContent =
    'data:text/csv;charset=utf-8,\uFEFF' +
    [headers.join(','), ...allRows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute(
    'download',
    `દશેરા_2026_તમામ_સ્પર્ધકોની_યાદી_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Downloads a single entry's pre-intro stage announcement notes as a clean text file.
 */
export function downloadEntryPreIntro(entry: RegistrationEntry): void {
  if (!entry.preIntroRequired && !entry.preIntroDetails) {
    alert('આ કાર્યક્રમમાં શરૂઆતની કોઈ પ્રિ-ઇન્ટ્રો માહિતી નોંધાયેલ નથી.');
    return;
  }

  const danceName = (entry.performanceTitle || '').trim();
  const coordinator = (entry.coordinatorName || '').trim();
  const safeTitle = (danceName || coordinator || 'કાર્યક્રમ')
    .replace(/[/\\?%*:|"<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const content = `======================================================================
શ્રી ઉમિયા સોશિયલ એક્ટિવિટી ગ્રુપ - નંદિની વિભાગ , નાશિક
દશેરા સાંસ્કૃતિક કાર્યક્રમ વર્ષ ૨૦૨૬
----------------------------------------------------------------------
સ્ટેજ એન્કરિંગ / ઉદ્ઘોષણા - કાર્યક્રમ શરૂ થાય તે પહેલાં આપવાની માહિતી
======================================================================

ટોકન નંબર: ${entry.entryNumber}
કાર્યક્રમ / ડાન્સનું નામ: ${entry.performanceTitle}
કેટેગરી: ${entry.category === 'raas_garba' ? 'રાસ ગરબા' : entry.category === 'dance' ? 'ડાન્સ' : entry.category === 'natak' ? 'નાટક' : `અન્ય (${entry.customCategory || ''})`}
સમય મર્યાદા: ${entry.formattedDuration} મિનિટ
તૈયાર કરાવનાર: ${entry.coordinatorName} (મોબાઈલ: ${entry.coordinatorPhone})
કુલ કલાકારો: ${entry.manualParticipants?.length || 0}
LED સ્ક્રીન જરૂરી: ${entry.ledScreenRequired ? 'હા (પેન ડ્રાઇવ)' : 'ના'}
સ્ટેજ ક્રમ: ${entry.stageSequenceNumber ? `#${entry.stageSequenceNumber}` : 'નિર્ધારિત નથી'}

----------------------------------------------------------------------
📢 કાર્યક્રમ શરૂ થાય તે પહેલાં સ્ટેજ પર આપવાની માહિતી:
----------------------------------------------------------------------
${entry.preIntroDetails || '(માહિતી આપવાની હા પાડેલ છે, પરંતુ વિગત નોંધેલ નથી)'}
======================================================================
તારીખ: ${new Date(entry.submittedAt).toLocaleDateString('gu-IN')}
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${safeTitle}_પ્રિ_ઇન્ટ્રો_માહિતી.txt`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads a dedicated Pre-Intro & Stage Anchoring sheet (CSV) for all entries
 * where "કાર્યક્રમ શરૂ થાય તે પહેલા કાર્યક્રમ વિષે કઈ માહિતી આપવી છે" is YES.
 */
export function exportPreIntroSheetToCSV(entries: RegistrationEntry[]): void {
  const introEntries = entries.filter((e) => e.preIntroRequired);
  if (introEntries.length === 0) {
    alert('કોઈપણ કાર્યક્રમમાં "કાર્યક્રમ શરૂ થાય તે પહેલા માહિતી આપવી છે: YES" નોંધાયેલ નથી.');
    return;
  }

  const headers = [
    'ક્રમ',
    'સ્ટેજ ક્રમ',
    'ટોકન નંબર',
    'કાર્યક્રમ / ગીતનું નામ',
    'કેટેગરી',
    'સમય',
    'તૈયાર કરાવનારનું નામ',
    'મોબાઈલ નંબર',
    'કુલ કલાકારો',
    'LED સ્ક્રીન',
    'કાર્યક્રમ શરૂ થાય તે પહેલાં આપવાની માહિતી / એન્કરિંગ નોંધ (Pre-Intro Announcement)',
  ];

  const rows = introEntries.map((e, idx) => [
    idx + 1,
    e.stageSequenceNumber ? `#${e.stageSequenceNumber}` : '-',
    e.entryNumber,
    `"${(e.performanceTitle || '').replace(/"/g, '""')}"`,
    e.category === 'raas_garba' ? 'રાસ ગરબા' : e.category === 'dance' ? 'ડાન્સ' : e.category === 'natak' ? 'નાટક' : `અન્ય (${e.customCategory || ''})`,
    `"${e.formattedDuration || ''}"`,
    `"${(e.coordinatorName || '').replace(/"/g, '""')}"`,
    `"${(e.coordinatorPhone || '').replace(/"/g, '""')}"`,
    e.manualParticipants?.length || 0,
    e.ledScreenRequired ? 'હા (પેન ડ્રાઇવ)' : 'ના',
    `"${(e.preIntroDetails || 'હા').replace(/"/g, '""')}"`,
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,\uFEFF' +
    [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute(
    'download',
    `દશેરા_2026_પ્રિ_ઇન્ટ્રો_એન્કરિંગ_માહિતી_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

