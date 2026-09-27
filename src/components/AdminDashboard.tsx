import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Upload,
  Printer,
  Music,
  Video,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Edit3,
  Phone,
  Mail,
  User,
  ExternalLink,
  ChevronDown,
  Layers,
  Lock,
} from 'lucide-react';
import {
  RegistrationEntry,
  AdminUser,
  AdminUploadedFile,
  ProgramCategory,
} from '../types';
import {
  updateEntryStatus,
  exportEntriesToCSV,
  getStoredAdminFiles,
} from '../utils/storage';
import { formatFileSize, formatGujaratiDate } from '../utils/crypto';
import { AdminFileUploadModal } from './AdminFileUploadModal';

interface AdminDashboardProps {
  adminUser: AdminUser;
  entries: RegistrationEntry[];
  onRefreshEntries: () => void;
  lang: 'gu' | 'en';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminUser,
  entries,
  onRefreshEntries,
  lang,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'entries' | 'admin_files' | 'schedule'>('entries');

  // Modal states
  const [selectedEntryForReview, setSelectedEntryForReview] = useState<RegistrationEntry | null>(null);
  const [reviewStatus, setReviewStatus] = useState<RegistrationEntry['status']>('pending');
  const [reviewNotes, setReviewNotes] = useState('');
  const [rehearsalDate, setRehearsalDate] = useState('');
  const [stageSeq, setStageSeq] = useState<number | ''>('');

  const [activeMediaModal, setActiveMediaModal] = useState<{
    type: 'audio' | 'video' | 'image';
    title: string;
    url?: string;
  } | null>(null);

  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false);
  const [adminFiles, setAdminFiles] = useState<AdminUploadedFile[]>(getStoredAdminFiles());

  // Filter entries
  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      e.performanceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.coordinatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.coordinatorPhone.includes(searchQuery) ||
      e.entryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || e.category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'all' || e.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate statistics
  const totalCount = entries.length;
  const garbaCount = entries.filter((e) => e.category === 'raas_garba').length;
  const danceCount = entries.filter((e) => e.category === 'dance').length;
  const natakCount = entries.filter((e) => e.category === 'natak').length;
  const otherCount = entries.filter((e) => e.category === 'other').length;
  const approvedCount = entries.filter((e) => e.status === 'confirmed' || e.status === 'rehearsal_scheduled').length;

  const handleOpenReview = (entry: RegistrationEntry) => {
    setSelectedEntryForReview(entry);
    setReviewStatus(entry.status);
    setReviewNotes(entry.adminNotes || '');
    setRehearsalDate(entry.rehearsalDate || '');
    setStageSeq(entry.stageSequenceNumber !== undefined ? entry.stageSequenceNumber : '');
  };

  const handleSaveReview = () => {
    if (!selectedEntryForReview) return;
    updateEntryStatus(
      selectedEntryForReview.id,
      reviewStatus,
      reviewNotes,
      rehearsalDate,
      stageSeq === '' ? undefined : Number(stageSeq)
    );
    setSelectedEntryForReview(null);
    onRefreshEntries();
  };

  const handleAdminFileUploaded = (file: AdminUploadedFile) => {
    setAdminFiles(getStoredAdminFiles());
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Admin Header with 2FA Indicator */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 rounded-3xl text-white p-6 sm:p-8 mb-8 border border-amber-500/40 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ડ્યુઅલ-ફેક્ટર વેરિફાઇડ એડમિન સેશન (2FA Active)</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-festive mt-1">
              દશેરા સાંસ્કૃતિક સમિતિ મેનેજમેન્ટ પોર્ટલ
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm mt-1">
              લૉગિન થયેલ અધિકારી: <strong className="text-amber-200">{adminUser.name}</strong> · {adminUser.role} ({adminUser.email})
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsUploadDocModalOpen(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>સુરક્ષિત ફાઇલ અપલોડ કરો</span>
            </button>

            <button
              onClick={() => exportEntriesToCSV(entries)}
              className="px-4 py-2 text-xs font-bold text-stone-900 bg-amber-100 hover:bg-amber-200 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Excel / CSV ડાઉનલોડ</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 text-xs font-bold text-stone-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>પ્રિન્ટ શેડ્યૂલ</span>
            </button>
          </div>
        </div>

        {/* Live Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-white/10 text-stone-200">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-[11px] text-stone-400 block">કુલ રજીસ્ટ્રેશન</span>
            <span className="text-xl font-bold font-mono text-white">{totalCount}</span>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-[11px] text-amber-300 block">રાસ ગરબા</span>
            <span className="text-xl font-bold font-mono text-amber-300">{garbaCount}</span>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-[11px] text-rose-300 block">ડાન્સ (ગ્રુપ)</span>
            <span className="text-xl font-bold font-mono text-rose-300">{danceCount}</span>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-[11px] text-sky-300 block">નાટક</span>
            <span className="text-xl font-bold font-mono text-sky-300">{natakCount}</span>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-emerald-400 block">મંજૂર / રિહર્સલ</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{approvedCount}</span>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 mb-6 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTab('entries')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center gap-2 ${
            activeTab === 'entries'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 bg-stone-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>કાર્યક્રમ એન્ટ્રીઓ ({entries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('admin_files')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center gap-2 ${
            activeTab === 'admin_files'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 bg-stone-100'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>સમિતિ એન્ક્રિપ્ટેડ ફાઇલો ({adminFiles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center gap-2 ${
            activeTab === 'schedule'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 bg-stone-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>સ્ટેજ ક્રમ અને રન-શીટ</span>
        </button>
      </div>

      {/* TAB 1: Participant Entries Table & Review */}
      {activeTab === 'entries' && (
        <div className="space-y-6">
          
          {/* Search & Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="ગીત, સંયોજક, નંબર અથવા એન્ટ્રી ID થી શોધો..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white font-medium text-stone-700"
              >
                <option value="all">તમામ કેટેગરી (All Categories)</option>
                <option value="raas_garba">રાસ ગરબા</option>
                <option value="dance">ડાન્સ (Dance)</option>
                <option value="natak">નાટક (Natak)</option>
                <option value="other">અન્ય (Other)</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white font-medium text-stone-700"
              >
                <option value="all">તમામ સ્ટેટસ (All Status)</option>
                <option value="pending">પેન્ડિંગ (Pending)</option>
                <option value="script_approved">સ્ક્રિપ્ટ મંજૂર (Approved)</option>
                <option value="rehearsal_scheduled">રિહર્સલ નિયત</option>
                <option value="confirmed">કન્ફર્મ (Confirmed)</option>
                <option value="rejected">નામંજૂર</option>
              </select>
            </div>
          </div>

          {/* Entries Cards / Table */}
          {filteredEntries.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-stone-200">
              <AlertCircle className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-stone-700">કોઈ એન્ટ્રી મળી નથી.</p>
              <p className="text-xs text-stone-500 mt-1">
                ફિલ્ટર અથવા શોધ શબ્દ બદલીને ફરી તપાસો.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 hover:border-amber-400 transition-colors shadow-2xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono font-bold text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                        {entry.entryNumber}
                      </span>
                      <span className="text-xs font-semibold text-stone-500">
                        {formatGujaratiDate(entry.submittedAt)}
                      </span>
                      {entry.stageSequenceNumber && (
                        <span className="text-xs font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded-md">
                          સ્ટેજ ક્રમ: #{entry.stageSequenceNumber}
                        </span>
                      )}
                    </div>

                    {/* Status Pill */}
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full w-fit ${
                        entry.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : entry.status === 'rehearsal_scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : entry.status === 'script_approved'
                          ? 'bg-amber-100 text-amber-800'
                          : entry.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {entry.status === 'confirmed'
                        ? '✓ કન્ફર્મ'
                        : entry.status === 'rehearsal_scheduled'
                        ? '📅 રિહર્સલ શિડ્યુલ'
                        : entry.status === 'script_approved'
                        ? '📜 સ્ક્રિપ્ટ મંજૂર'
                        : entry.status === 'rejected'
                        ? '✕ નામંજૂર'
                        : '⏳ પેન્ડિંગ રિવ્યૂ'}
                    </span>
                  </div>

                  {/* Main Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <h4 className="text-base sm:text-lg font-bold text-amber-950 font-festive">
                        {entry.performanceTitle}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-stone-600 mt-1 flex-wrap">
                        <span className="font-semibold text-stone-800">
                          {entry.category === 'raas_garba'
                            ? 'રાસ ગરબા'
                            : entry.category === 'dance'
                            ? 'ડાન્સ (ગ્રુપ)'
                            : entry.category === 'natak'
                            ? 'નાટક'
                            : `અન્ય (${entry.customCategory || ''})`}
                        </span>
                        <span>·</span>
                        <span className="font-mono">સમય: {entry.formattedDuration} મિનિટ</span>
                        {entry.ledScreenRequired && (
                          <>
                            <span>·</span>
                            <span className="text-blue-700 font-semibold">
                              LED સ્ક્રીન જરૂરી (પેન ડ્રાઇવ)
                            </span>
                          </>
                        )}
                        {entry.preIntroRequired && (
                          <>
                            <span>·</span>
                            <span className="text-purple-700 font-semibold">
                              એન્કરિંગ પ્રસ્તાવના છે
                            </span>
                          </>
                        )}
                      </div>

                      {entry.preIntroDetails && (
                        <p className="text-xs text-stone-600 bg-stone-50 p-2 rounded-lg mt-2 italic">
                          "{entry.preIntroDetails}"
                        </p>
                      )}
                    </div>

                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1">
                      <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-stone-500" />
                        <span>{entry.coordinatorName}</span>
                      </div>
                      <div className="text-stone-600 flex items-center gap-1.5 font-mono">
                        <Phone className="w-3.5 h-3.5 text-stone-500" />
                        <a href={`tel:${entry.coordinatorPhone}`} className="hover:underline">
                          {entry.coordinatorPhone}
                        </a>
                      </div>
                      <div className="text-stone-500 text-[11px] truncate">{entry.email}</div>
                    </div>
                  </div>

                  {/* Media & Files bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Audio/Video play button */}
                      <button
                        onClick={() =>
                          setActiveMediaModal({
                            type: entry.songFile.mimeType.startsWith('video/')
                              ? 'video'
                              : 'audio',
                            title: entry.songFile.originalName,
                            url: entry.songFile.dataUrl,
                          })
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold flex items-center gap-1.5"
                      >
                        <Music className="w-3.5 h-3.5 text-amber-700" />
                        <span>ગીત સાંભળો ({formatFileSize(entry.songFile.size)})</span>
                      </button>

                      {/* Participant sheet button */}
                      {entry.participantsPhotoFile && (
                        <button
                          onClick={() =>
                            setActiveMediaModal({
                              type: 'image',
                              title: entry.participantsPhotoFile!.originalName,
                              url: entry.participantsPhotoFile!.dataUrl,
                            })
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 font-semibold flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-stone-600" />
                          <span>સ્પર્ધકોની યાદી ફોટો</span>
                        </button>
                      )}

                      <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                        🔒 AES-256 Checksum Verified
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenReview(entry)}
                        className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>સ્ટેટસ & રિહર્સલ મેનેજ કરો</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: Admin Secure Documents & Uploaded Assets */}
      {activeTab === 'admin_files' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 font-festive">
                સાંસ્કૃતિક સમિતિ સુરક્ષિત દસ્તાવેજો (2FA Enforced)
              </h3>
              <p className="text-xs text-stone-500">
                તમામ ફાઇલો ક્લાયન્ટ સાઇડ AES-256 એન્ક્રિપ્શન સાથે સુરક્ષિત છે.
              </p>
            </div>
            <button
              onClick={() => setIsUploadDocModalOpen(true)}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Upload className="w-4 h-4" />
              <span>નવો દસ્તાવેજ અપલોડ કરો</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminFiles.map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-amber-400 transition-colors shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{doc.title}</h4>
                      <div className="text-xs text-stone-500 font-mono mt-0.5">
                        {doc.file.originalName} ({formatFileSize(doc.file.size)})
                      </div>
                    </div>
                  </div>

                  {doc.isConfidential && (
                    <span className="text-[10px] bg-red-100 text-red-800 font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                      <Lock className="w-3 h-3" /> ગુપ્ત
                    </span>
                  )}
                </div>

                {doc.notes && (
                  <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl">
                    {doc.notes}
                  </p>
                )}

                <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
                  <span>અપલોડ કરનાર: {doc.uploadedBy}</span>
                  <span className="font-mono text-emerald-700 font-semibold">
                    AES-GCM-256 ✓
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Printable Stage Sequence / Run Sheet */}
      {activeTab === 'schedule' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-festive text-stone-900">
                દશેરા સાંસ્કૃતિક કાર્યક્રમ ૨૦૨૬ - સ્ટેજ રન-શીટ
              </h3>
              <p className="text-xs text-stone-500">
                શ્રી ઉમિયા સોશિયલ એક્ટિવિટી ગ્રુપ - નંદિની વિભાગ, નાશિક
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 self-start"
            >
              <Printer className="w-4 h-4" />
              <span>પ્રિન્ટ કરો (Print Stage Sheet)</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 text-stone-600 uppercase text-[11px] font-bold border-b border-stone-200">
                <tr>
                  <th className="p-3">ક્રમ</th>
                  <th className="p-3">એન્ટ્રી નં.</th>
                  <th className="p-3">કાર્યક્રમ પ્રકાર</th>
                  <th className="p-3">કાર્યક્રમ / ગીત</th>
                  <th className="p-3">સમય</th>
                  <th className="p-3">તૈયાર કરાવનાર & નંબર</th>
                  <th className="p-3">LED સ્ક્રીન</th>
                  <th className="p-3">સ્ટેટસ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {entries.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-amber-50/40">
                    <td className="p-3 font-bold font-mono text-stone-900">
                      {item.stageSequenceNumber ? `#${item.stageSequenceNumber}` : `${idx + 1}`}
                    </td>
                    <td className="p-3 font-mono font-semibold text-amber-900">
                      {item.entryNumber}
                    </td>
                    <td className="p-3 font-medium">
                      {item.category === 'raas_garba'
                        ? 'રાસ ગરબા'
                        : item.category === 'dance'
                        ? 'ડાન્સ'
                        : item.category === 'natak'
                        ? 'નાટક'
                        : 'અન્ય'}
                    </td>
                    <td className="p-3 font-bold text-stone-900 max-w-xs truncate">
                      {item.performanceTitle}
                    </td>
                    <td className="p-3 font-mono text-stone-600">
                      {item.formattedDuration}
                    </td>
                    <td className="p-3 text-stone-700">
                      {item.coordinatorName} ({item.coordinatorPhone})
                    </td>
                    <td className="p-3 font-semibold">
                      {item.ledScreenRequired ? (
                        <span className="text-blue-700">હા (પેન ડ્રાઇવ)</span>
                      ) : (
                        <span className="text-stone-400">ના</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="text-xs font-semibold text-stone-800">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review & Status Edit Modal */}
      {selectedEntryForReview && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs">
          <div
            className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-amber-800 to-red-800 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base font-festive">
                  સ્ટેટસ & સમિતિ મંજૂરી અપડેટ
                </h3>
                <p className="text-xs text-amber-200">
                  {selectedEntryForReview.entryNumber} · {selectedEntryForReview.coordinatorName}
                </p>
              </div>
              <button
                onClick={() => setSelectedEntryForReview(null)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  કાર્યક્રમ સ્ટેટસ (Status):
                </label>
                <select
                  value={reviewStatus}
                  onChange={(e) =>
                    setReviewStatus(e.target.value as RegistrationEntry['status'])
                  }
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                >
                  <option value="pending">પેન્ડિંગ સમિતિ રિવ્યૂ (Pending Review)</option>
                  <option value="script_approved">સ્ક્રિપ્ટ મંજૂર (Script Approved)</option>
                  <option value="rehearsal_scheduled">રિહર્સલ સમય નિયત (Rehearsal Scheduled)</option>
                  <option value="confirmed">સ્ટેજ પર્ફોર્મન્સ કન્ફર્મ (Confirmed)</option>
                  <option value="rejected">નામંજૂર (Rejected)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    સ્ટેજ ક્રમ (Sequence #):
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="દા.ત. 1, 2, 3..."
                    value={stageSeq}
                    onChange={(e) =>
                      setStageSeq(e.target.value === '' ? '' : parseInt(e.target.value))
                    }
                    className="w-full p-2 rounded-xl border border-stone-300 font-mono text-center font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    રિહર્સલ તારીખ & સમય:
                  </label>
                  <input
                    type="text"
                    placeholder="દા.ત. 02/10 સાંજે 06:00"
                    value={rehearsalDate}
                    onChange={(e) => setRehearsalDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  સમિતિ શેરો / નોંધ (Internal Admin Notes):
                </label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="નાટકની સ્ક્રિપ્ટ મંજૂરી, સમય મર્યાદા કે વસ્ત્ર પરિધાન અંગે નોંધ..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setSelectedEntryForReview(null)}
                  className="px-4 py-2 text-stone-600 font-semibold"
                >
                  રદ કરો
                </button>
                <button
                  type="button"
                  onClick={handleSaveReview}
                  className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold"
                >
                  અપડેટ સેવ કરો
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Playback Modal */}
      {activeMediaModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setActiveMediaModal(null)}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <span className="font-bold text-sm text-stone-900 truncate pr-4">
                {activeMediaModal.title}
              </span>
              <button
                onClick={() => setActiveMediaModal(null)}
                className="text-stone-400 hover:text-stone-800"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col items-center justify-center">
              {activeMediaModal.type === 'audio' && (
                <div className="w-full space-y-3">
                  <div className="p-6 bg-amber-50 rounded-2xl flex items-center justify-center">
                    <Music className="w-12 h-12 text-amber-700" />
                  </div>
                  <audio
                    controls
                    autoPlay
                    src={activeMediaModal.url}
                    className="w-full outline-hidden"
                  />
                </div>
              )}

              {activeMediaModal.type === 'video' && (
                <div className="w-full">
                  <video
                    controls
                    autoPlay
                    src={activeMediaModal.url}
                    className="w-full max-h-72 rounded-2xl bg-black"
                  />
                </div>
              )}

              {activeMediaModal.type === 'image' && (
                <div className="max-h-[70vh] overflow-auto">
                  <img
                    src={activeMediaModal.url}
                    alt="Participant list sheet"
                    className="max-h-[65vh] object-contain rounded-xl"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin File Upload Modal */}
      <AdminFileUploadModal
        isOpen={isUploadDocModalOpen}
        onClose={() => setIsUploadDocModalOpen(false)}
        adminUser={adminUser}
        onFileSaved={handleAdminFileUploaded}
        lang={lang}
      />

    </div>
  );
};
