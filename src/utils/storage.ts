import { RegistrationEntry, AdminUser, AdminUploadedFile } from '../types';

const STORAGE_KEYS = {
  ENTRIES: 'dussehra_2026_registrations',
  ADMIN_SESSION: 'dussehra_2026_admin_session',
  ADMIN_FILES: 'dussehra_2026_admin_files',
  CURRENT_EMAIL: 'dussehra_2026_active_email',
};

// Initial seeded realistic entries so the portal is immediately alive and functional
const INITIAL_ENTRIES: RegistrationEntry[] = [
  {
    id: 'entry_1727400001',
    entryNumber: 'DUS-2026-001',
    submittedAt: '2026-09-24T18:30:00.000Z',
    email: 'khushalpatel1997@gmail.com',
    category: 'raas_garba',
    performanceTitle: 'મા ઉમિયા ના રઢિયાળા ગરબા (ગોપાલ નંદિની રાસ મંડળ)',
    durationMinutes: 7,
    durationSeconds: 30,
    formattedDuration: '07:30',
    participantsPhotoFile: {
      id: 'file_mock_1',
      originalName: 'garba_participants_list.jpg',
      size: 1420500,
      mimeType: 'image/jpeg',
      encryptedHash: 'a4b8c9d0e1f23456789abcdef0123456789abcdef0123456789abcdef0123456',
      encryptionAlgorithm: 'AES-GCM-256',
      ivHex: '4a6b8c0d1e2f3a4b5c6d7e8f',
      uploadedAt: '2026-09-24T18:28:00.000Z',
      encryptedStatus: 'verified',
    },
    manualParticipants: [
      { name: 'પ્રિયા પટેલ', age: '19' },
      { name: 'ધાર્મિ પટેલ', age: '21' },
      { name: 'કાવ્યા પોકાર', age: '18' },
      { name: 'રિદ્ધિ દીવાની', age: '20' },
      { name: 'નિશા પટેલ', age: '22' },
      { name: 'હર્ષિતા ભવાની', age: '19' },
    ],
    coordinatorName: 'કવિતાબેન પટેલ',
    coordinatorPhone: '9825012345',
    preIntroRequired: true,
    preIntroDetails: 'આ ગરબો મા ઉમિયા ના પ્રાચીન છંદ અને અર્વાચીન તાલ સાથે નંદિની વિભાગના યુવાનો દ્વારા રજૂ કરવામાં આવશે.',
    ledScreenRequired: true,
    songFile: {
      id: 'song_mock_1',
      originalName: 'umiya_mataji_raas_track_hq.mp3',
      size: 8940000,
      mimeType: 'audio/mpeg',
      encryptedHash: '8f7e6d5c4b3a210987654321fedcba0987654321fedcba0987654321fedcba',
      encryptionAlgorithm: 'AES-GCM-256',
      ivHex: '89abcdef0123456789abcdef',
      uploadedAt: '2026-09-24T18:29:30.000Z',
      encryptedStatus: 'verified',
    },
    status: 'rehearsal_scheduled',
    rehearsalDate: '2026-10-02 18:00',
    adminNotes: 'સ્ક્રિપ્ટ અને સૂર મંજૂર. રિહર્સલ તારીખ ૨ ઓક્ટોબર સાંજે ૬ વાગ્યે નંદિની હોલ ખાતે.',
    stageSequenceNumber: 1,
  },
  {
    id: 'entry_1727400002',
    entryNumber: 'DUS-2026-002',
    submittedAt: '2026-09-25T14:15:00.000Z',
    email: 'nandini.youth@gmail.com',
    category: 'natak',
    performanceTitle: 'સમાજ નું ગૌરવ અને નવી પેઢી (નાટક)',
    durationMinutes: 11,
    durationSeconds: 45,
    formattedDuration: '11:45',
    participantsPhotoFile: {
      id: 'file_mock_2',
      originalName: 'natak_cast_ages.jpg',
      size: 1980000,
      mimeType: 'image/jpeg',
      encryptedHash: '123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      encryptionAlgorithm: 'AES-GCM-256',
      ivHex: 'abcdef0123456789abcdef01',
      uploadedAt: '2026-09-25T14:10:00.000Z',
      encryptedStatus: 'verified',
    },
    manualParticipants: [
      { name: 'રોહન પોકાર', age: '23' },
      { name: 'મિતેશ દીવાની', age: '25' },
      { name: 'ચિંતન ભવાની', age: '22' },
      { name: 'ભાવિક પટેલ', age: '24' },
    ],
    coordinatorName: 'જયેશભાઈ પટેલ',
    coordinatorPhone: '9422078901',
    preIntroRequired: true,
    preIntroDetails: 'નાટકના પાત્રો અને દશેરા પર્વની વિશેષતા રજૂ કરતું ૪૫ સેકન્ડનું સંવાદ પ્રસ્તાવના.',
    ledScreenRequired: false,
    songFile: {
      id: 'song_mock_2',
      originalName: 'natak_bgm_master.mp3',
      size: 14200000,
      mimeType: 'audio/mpeg',
      encryptedHash: 'cdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
      encryptionAlgorithm: 'AES-GCM-256',
      ivHex: '0123456789abcdef01234567',
      uploadedAt: '2026-09-25T14:14:00.000Z',
      encryptedStatus: 'verified',
    },
    status: 'script_approved',
    adminNotes: 'સાંસ્કૃતિક સમિતિ દ્વારા સ્ક્રિપ્ટ તપાસવામાં આવી છે અને મર્યાદાપૂર્ણ હોવાથી મંજૂરી અપાઈ છે.',
    stageSequenceNumber: 2,
  },
  {
    id: 'entry_1727400003',
    entryNumber: 'DUS-2026-003',
    submittedAt: '2026-09-26T09:40:00.000Z',
    email: 'nashik.patel.group@gmail.com',
    category: 'dance',
    performanceTitle: 'શૌર્ય અને સંસ્કૃતિ - લોકનૃત્ય (ગ્રુપ ડાન્સ)',
    durationMinutes: 6,
    durationSeconds: 15,
    formattedDuration: '06:15',
    participantsPhotoFile: {
      id: 'file_mock_3',
      originalName: 'dance_troupe_details.png',
      size: 2150000,
      mimeType: 'image/png',
      encryptedHash: '789abcdef0123456789abcdef0123456789abcdef0123456789abcdef012345',
      encryptionAlgorithm: 'AES-GCM-256',
      ivHex: 'fedcba9876543210fedcba98',
      uploadedAt: '2026-09-26T09:35:00.000Z',
      encryptedStatus: 'verified',
    },
    manualParticipants: [
      { name: 'આરવ પટેલ', age: '14' },
      { name: 'વિવાન દીવાની', age: '15' },
      { name: 'દેવ પોકાર', age: '14' },
      { name: 'અક્ષત ભવાની', age: '16' },
      { name: 'કૃષ્ણ પટેલ', age: '15' },
    ],
    coordinatorName: 'ધર્મેશભાઈ ભવાની',
    coordinatorPhone: '9890123456',
    preIntroRequired: false,
    ledScreenRequired: true,
    songFile: {
      id: 'song_mock_3',
      originalName: 'dussehra_folk_dance_soundtrack.mp3',
      size: 7850000,
      mimeType: 'audio/mpeg',
      encryptedHash: '56789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123',
      encryptionAlgorithm: 'AES-GCM-256',
      ivHex: '56789abcdef0123456789abc',
      uploadedAt: '2026-09-26T09:38:00.000Z',
      encryptedStatus: 'verified',
    },
    status: 'pending',
    adminNotes: 'પ્રાથમિક ફોર્મ પ્રાપ્ત થયું. ઓડિયો ક્વોલિટી યોગ્ય છે.',
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
      localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(INITIAL_ENTRIES));
      return INITIAL_ENTRIES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading entries from storage', err);
    return INITIAL_ENTRIES;
  }
}

export function saveEntry(entry: RegistrationEntry): RegistrationEntry {
  const current = getStoredEntries();
  const updated = [entry, ...current.filter(e => e.id !== entry.id)];
  localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(updated));
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
  return file;
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
    'Email',
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
    e.email,
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
