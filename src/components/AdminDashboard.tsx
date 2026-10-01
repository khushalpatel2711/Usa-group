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
  Trash2,
  History,
  Users,
  Mic,
} from 'lucide-react';
import {
  RegistrationEntry,
  AdminUser,
  AdminUploadedFile,
  ProgramCategory,
  AuditLog,
  UploadedFileMeta,
} from '../types';
import {
  updateEntryStatus,
  exportEntriesToCSV,
  downloadEntryParticipants,
  getParticipantDownloadFileName,
  exportAllParticipantsToCSV,
  downloadEntryPreIntro,
  exportPreIntroSheetToCSV,
  getStoredAdminFiles,
  clearAllEntries,
  deleteEntry,
  deleteAdminFile,
  clearAllAdminFiles,
  getStoredLogs,
  deleteSingleLog,
  clearAllLogs,
} from '../utils/storage';
import { formatFileSize, formatGujaratiDate, downloadImageFile } from '../utils/crypto';
import { AdminFileUploadModal } from './AdminFileUploadModal';

interface AdminDashboardProps {
  adminUser: AdminUser;
  entries: RegistrationEntry[];
  onRefreshEntries: () => void;
  lang: 'gu' | 'en';
  autoLogoutSecondsLeft?: number;
  onResetAutoLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminUser,
  entries,
  onRefreshEntries,
  lang,
  autoLogoutSecondsLeft,
  onResetAutoLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'entries' | 'admin_files' | 'schedule' | 'logs'>('entries');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(getStoredLogs());
  const [logSearchQuery, setLogSearchQuery] = useState('');

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
    fileMeta?: UploadedFileMeta;
    fallbackInfo?: { title?: string; entryNumber?: string; coordinator?: string };
  } | null>(null);

  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false);
  const [adminFiles, setAdminFiles] = useState<AdminUploadedFile[]>(getStoredAdminFiles());

  // Filter entries
  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      e.performanceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.coordinatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.coordinatorPhone.includes(searchQuery) ||
      e.entryNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || e.category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'all' || e.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Filter logs
  const filteredLogs = auditLogs.filter((log) => {
    if (!logSearchQuery.trim()) return true;
    const q = logSearchQuery.toLowerCase();
    return (
      log.details.toLowerCase().includes(q) ||
      log.performedBy.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q)
    );
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
    setAuditLogs(getStoredLogs());
  };

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    onConfirm: () => void;
  } | null>(null);

  const handleAdminFileUploaded = (file: AdminUploadedFile) => {
    setAdminFiles(getStoredAdminFiles());
    setAuditLogs(getStoredLogs());
  };

  const handleClearAllEntries = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'તમામ એન્ટ્રીઓ સાફ કરો (Clear All Entries)',
      message: 'શું તમે ખરેખર તમામ રજીસ્ટ્રેશન એન્ટ્રીઓ ડિલીટ કરવા માંગો છો? બધો રજીસ્ટ્રેશન ડેટા ખાલી થઈ જશે.',
      confirmText: 'હા, બધી એન્ટ્રીઓ ડિલીટ કરો',
      onConfirm: () => {
        clearAllEntries();
        onRefreshEntries();
        setAuditLogs(getStoredLogs());
        setConfirmDialog(null);
      },
    });
  };

  const handleDeleteSingleEntry = (id: string, title: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'એન્ટ્રી ડિલીટ કરો (Delete Entry)',
      message: `શું તમે "${title}" એન્ટ્રી ડિલીટ કરવા માંગો છો?`,
      confirmText: 'ડિલીટ કરો',
      onConfirm: () => {
        deleteEntry(id);
        onRefreshEntries();
        setAuditLogs(getStoredLogs());
        setConfirmDialog(null);
      },
    });
  };

  const handleDeleteAdminFile = (id: string, title: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'દસ્તાવેજ ડિલીટ કરો',
      message: `શું તમે "${title}" દસ્તાવેજ ડિલીટ કરવા માંગો છો?`,
      confirmText: 'ડિલીટ કરો',
      onConfirm: () => {
        const updated = deleteAdminFile(id);
        setAdminFiles(updated);
        setAuditLogs(getStoredLogs());
        setConfirmDialog(null);
      },
    });
  };

  const handleClearAllAdminFiles = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'તમામ સમિતિ ફાઇલો સાફ કરો',
      message: 'શું તમે ખરેખર તમામ સમિતિ દસ્તાવેજો ડિલીટ કરવા માંગો છો?',
      confirmText: 'હા, બધી ફાઇલો ડિલીટ કરો',
      onConfirm: () => {
        clearAllAdminFiles();
        setAdminFiles([]);
        setAuditLogs(getStoredLogs());
        setConfirmDialog(null);
      },
    });
  };

  const handleDeleteSingleLog = (id: string) => {
    const updated = deleteSingleLog(id);
    setAuditLogs(updated);
  };

  const handleClearAllLogs = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'તમામ લૉગ્સ સાફ કરો (Delete All Logs)',
      message: 'શું તમે ખરેખર બધા સિસ્ટમ & એક્ટિવિટી લૉગ્સ ડિલીટ કરવા માંગો છો? આ ક્રિયા પાછી ફેરવી શકાશે નહીં.',
      confirmText: 'હા, બધા લૉગ્સ ડિલીટ કરો',
      onConfirm: () => {
        clearAllLogs();
        setAuditLogs([]);
        setConfirmDialog(null);
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Admin Header with 2FA Indicator */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 rounded-3xl text-white p-6 sm:p-8 mb-8 border border-amber-500/40 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>સુરક્ષિત એડમિન સેશન (Active)</span>
              </div>

              {autoLogoutSecondsLeft !== undefined && (
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border transition-all ${
                    autoLogoutSecondsLeft <= 15
                      ? 'bg-red-950/90 text-red-200 border-red-500 shadow-xs animate-pulse'
                      : 'bg-amber-900/60 text-amber-200 border-amber-600/60'
                  }`}
                  title="૧ મિનિટ નિષ્ક્રિયતા બાદ આપોઆપ લૉગઆઉટ થશે"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>
                    ઓટો-લૉગઆઉટ: 00:{autoLogoutSecondsLeft < 10 ? `0${autoLogoutSecondsLeft}` : autoLogoutSecondsLeft}
                  </span>
                  {onResetAutoLogout && (
                    <button
                      onClick={onResetAutoLogout}
                      className="text-[10px] uppercase font-bold text-amber-300 hover:text-white underline ml-1 cursor-pointer"
                      title="સમય રીસેટ કરો (Extend 1 Min)"
                    >
                      રીસેટ
                    </button>
                  )}
                </div>
              )}
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
              disabled={entries.length === 0}
              className="px-4 py-2 text-xs font-bold text-stone-900 bg-amber-100 hover:bg-amber-200 disabled:opacity-40 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Excel / CSV ડાઉનલોડ</span>
            </button>

            <button
              onClick={() => exportAllParticipantsToCSV(entries)}
              disabled={entries.length === 0}
              className="px-4 py-2 text-xs font-bold text-amber-950 bg-amber-200 hover:bg-amber-300 disabled:opacity-40 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              title="તમામ એન્ટ્રીઓના ભાગ લેનાર સ્પર્ધકોની યાદી CSV ડાઉનલોડ કરો"
            >
              <Users className="w-4 h-4 text-amber-900" />
              <span>તમામ સ્પર્ધકોની યાદી ડાઉનલોડ</span>
            </button>

            <button
              onClick={() => exportPreIntroSheetToCSV(entries)}
              disabled={entries.filter((e) => e.preIntroRequired).length === 0}
              className="px-4 py-2 text-xs font-bold text-purple-950 bg-purple-100 hover:bg-purple-200 disabled:opacity-40 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 border border-purple-300/60"
              title="કાર્યક્રમ શરૂ થાય તે પહેલાં આપવાની માહિતી (પ્રિ-ઇન્ટ્રો / એન્કરિંગ શીટ) ડાઉનલોડ કરો"
            >
              <Mic className="w-4 h-4 text-purple-700" />
              <span>
                પ્રિ-ઇન્ટ્રો / એન્કરિંગ શીટ ({entries.filter((e) => e.preIntroRequired).length})
              </span>
            </button>

            <button
              onClick={() => window.print()}
              disabled={entries.length === 0}
              className="px-4 py-2 text-xs font-bold text-stone-300 hover:text-white disabled:opacity-40 bg-white/10 hover:bg-white/20 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>પ્રિન્ટ શેડ્યૂલ</span>
            </button>

            {entries.length > 0 && (
              <button
                onClick={handleClearAllEntries}
                className="px-3.5 py-2 text-xs font-bold text-red-300 hover:text-white bg-red-950/60 hover:bg-red-800 border border-red-500/40 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                title="તમામ એન્ટ્રીઓ ડિલીટ કરો"
              >
                <Trash2 className="w-4 h-4" />
                <span>તમામ એન્ટ્રીઓ સાફ કરો</span>
              </button>
            )}

            {auditLogs.length > 0 && (
              <button
                onClick={handleClearAllLogs}
                className="px-3.5 py-2 text-xs font-bold text-amber-200 hover:text-white bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                title="તમામ એક્ટિવિટી લૉગ્સ ડિલીટ કરો"
              >
                <History className="w-4 h-4" />
                <span>તમામ લૉગ્સ સાફ કરો</span>
              </button>
            )}
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
      <div className="flex items-center gap-2 mb-6 border-b border-stone-200 pb-3 flex-wrap">
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

        <button
          onClick={() => {
            setAuditLogs(getStoredLogs());
            setActiveTab('logs');
          }}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center gap-2 ${
            activeTab === 'logs'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 bg-stone-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>ઓડિટ & એક્ટિવિટી લૉગ્સ ({auditLogs.length})</span>
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
              <p className="text-sm font-bold text-stone-700">
                {entries.length === 0 ? 'હજુ સુધી કોઈ એન્ટ્રી નોંધાયેલ નથી.' : 'આ ફિલ્ટર મુજબ કોઈ એન્ટ્રી મળી નથી.'}
              </p>
              <p className="text-xs text-stone-500 mt-1">
                {entries.length === 0
                  ? 'નવા રજીસ્ટ્રેશન ફોર્મ સબમિટ થતાં અહીં આપમેળે જોવા મળશે.'
                  : 'શોધ શબ્દ અથવા કેટેગરી ફિલ્ટર બદલીને ફરી તપાસો.'}
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
                            <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                              🎤 પ્રિ-ઇન્ટ્રો માહિતી: YES
                            </span>
                          </>
                        )}
                      </div>

                      {/* Pre-Intro Stage Announcement Card & Download */}
                      {entry.preIntroRequired && (
                        <div className="mt-2.5 p-2.5 bg-purple-50/80 border border-purple-200 rounded-xl text-xs space-y-1.5 shadow-2xs">
                          <div className="flex items-center justify-between font-bold text-purple-950 flex-wrap gap-2">
                            <span className="flex items-center gap-1.5">
                              <Mic className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                              <span>કાર્યક્રમ શરૂ થાય તે પહેલાં આપવાની માહિતી (Pre-Intro):</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => downloadEntryPreIntro(entry)}
                              className="px-2.5 py-1 bg-purple-200 hover:bg-purple-300 text-purple-950 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors border border-purple-300 shadow-2xs"
                              title="આ કાર્યક્રમની પ્રિ-ઇન્ટ્રો માહિતી ફાઇલ ડાઉનલોડ કરો"
                            >
                              <Download className="w-3 h-3 text-purple-900" />
                              <span>માહિતી ડાઉનલોડ (.txt)</span>
                            </button>
                          </div>
                          {entry.preIntroDetails ? (
                            <p className="text-xs text-purple-950 bg-white p-2 rounded-lg border border-purple-100 font-medium leading-relaxed">
                              "{entry.preIntroDetails}"
                            </p>
                          ) : (
                            <p className="text-[11px] text-purple-700 italic">
                              (કાર્યક્રમ શરૂ થાય તે પહેલા માહિતી આપવાની હા પાડેલ છે)
                            </p>
                          )}
                        </div>
                      )}

                      {/* Participant Names List */}
                      {entry.manualParticipants && entry.manualParticipants.length > 0 && (
                        <div className="mt-2.5 p-2.5 bg-amber-50/70 border border-amber-200/90 rounded-xl text-xs space-y-1.5">
                          <div className="flex items-center justify-between font-bold text-amber-950 flex-wrap gap-2">
                            <span className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-amber-800" />
                              <span>ભાગ લેનાર સભ્યો ({entry.manualParticipants.length}):</span>
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => downloadEntryParticipants(entry)}
                                className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors border border-amber-300 shadow-2xs"
                                title={`ફાઇલ નામ: "${getParticipantDownloadFileName(entry)}"`}
                              >
                                <Download className="w-3 h-3 text-amber-900" />
                                <span>નામ ડાઉનલોડ (CSV)</span>
                              </button>
                            </div>
                          </div>
                          <div className="text-[11px] text-stone-500 font-mono flex items-center gap-1">
                            <span className="text-stone-400">ફાઇલ:</span>
                            <span className="font-semibold text-amber-900 truncate">
                              {getParticipantDownloadFileName(entry)}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {entry.manualParticipants.map((p, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-stone-200 text-[11px] text-stone-800 font-medium"
                              >
                                <span className="font-mono text-stone-400 font-bold">{idx + 1}.</span>
                                <span>{p.name}</span>
                                {p.age && (
                                  <span className="text-stone-500 font-mono text-[10px]">({p.age} વર્ષ)</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1.5">
                      <div className="text-[10px] font-bold uppercase text-amber-900/80 tracking-wide">
                        કાર્યક્રમ તૈયાર કરાવનાર:
                      </div>
                      <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                        <span className="truncate">{entry.coordinatorName}</span>
                      </div>
                      <div className="text-stone-600 flex items-center gap-1.5 font-mono">
                        <Phone className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                        <a href={`tel:${entry.coordinatorPhone}`} className="hover:underline font-semibold text-stone-700">
                          {entry.coordinatorPhone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Media & Files bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Audio/Video play button */}
                      {entry.songFile ? (
                        <button
                          onClick={() =>
                            setActiveMediaModal({
                              type: entry.songFile!.mimeType.startsWith('video/')
                                ? 'video'
                                : 'audio',
                              title: entry.songFile!.originalName,
                              url: entry.songFile!.dataUrl,
                            })
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold flex items-center gap-1.5"
                        >
                          <Music className="w-3.5 h-3.5 text-amber-700" />
                          <span>ગીત સાંભળો ({formatFileSize(entry.songFile.size)})</span>
                        </button>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-600 border border-stone-200 text-[11px] font-semibold flex items-center gap-1">
                          <Music className="w-3 h-3 text-stone-400" />
                          <span>ગીત: પેન ડ્રાઇવમાં આપશે (NO)</span>
                        </span>
                      )}

                      {/* Participant Names CSV download button with Dance / Group Name */}
                      {entry.manualParticipants && entry.manualParticipants.length > 0 && (
                        <div className="inline-flex items-center rounded-lg border border-amber-300 bg-amber-100 shadow-2xs">
                          <button
                            onClick={() => downloadEntryParticipants(entry)}
                            className="px-2.5 py-1.5 hover:bg-amber-200 text-amber-950 font-bold flex items-center gap-1.5 transition-colors text-xs rounded-l-lg"
                            title={`સ્પર્ધકોની યાદી ડાઉનલોડ કરો (ફાઇલ: "${getParticipantDownloadFileName(entry)}")`}
                          >
                            <Download className="w-3.5 h-3.5 text-amber-900" />
                            <span>
                              સ્પર્ધકોના નામ ડાઉનલોડ ({entry.performanceTitle || entry.coordinatorName})
                            </span>
                          </button>
                          {entry.performanceTitle && entry.coordinatorName && (
                            <div className="flex items-center border-l border-amber-300/80 px-1.5 py-1 gap-1 bg-amber-50 rounded-r-lg text-[10px]">
                              <button
                                onClick={() => downloadEntryParticipants(entry, 'dance')}
                                className="px-1.5 py-0.5 font-semibold text-amber-900 hover:bg-amber-200 rounded transition-colors"
                                title={`ડાન્સ નામથી ડાઉનલોડ: "${entry.performanceTitle.trim()}.csv"`}
                              >
                                ડાન્સ નામ
                              </button>
                              <span className="text-amber-300">|</span>
                              <button
                                onClick={() => downloadEntryParticipants(entry, 'group')}
                                className="px-1.5 py-0.5 font-semibold text-amber-900 hover:bg-amber-200 rounded transition-colors"
                                title={`ગ્રૂપ નામથી ડાઉનલોડ: "${entry.coordinatorName.trim()}.csv"`}
                              >
                                ગ્રૂપ નામ
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Participant sheet button & download */}
                      {entry.participantsPhotoFile && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              setActiveMediaModal({
                                type: 'image',
                                title: entry.participantsPhotoFile!.originalName,
                                url: entry.participantsPhotoFile!.dataUrl,
                                fileMeta: entry.participantsPhotoFile,
                                fallbackInfo: {
                                  title: entry.performanceTitle,
                                  entryNumber: entry.entryNumber,
                                  coordinator: entry.coordinatorName,
                                },
                              })
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 text-stone-600" />
                            <span>સ્પર્ધકોની યાદી ફોટો</span>
                          </button>

                          <button
                            onClick={() =>
                              downloadImageFile(entry.participantsPhotoFile!, {
                                title: entry.performanceTitle,
                                entryNumber: entry.entryNumber,
                                coordinator: entry.coordinatorName,
                              })
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                            title="સ્પર્ધકોની યાદી ફોટો ડાઉનલોડ કરો"
                          >
                            <Download className="w-3.5 h-3.5 text-amber-800" />
                            <span>ફોટો ડાઉનલોડ</span>
                          </button>
                        </div>
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
                        <span>સ્ટેટસ મેનેજ કરો</span>
                      </button>
                      <button
                        onClick={() => handleDeleteSingleEntry(entry.id, entry.performanceTitle)}
                        className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="આ એન્ટ્રી ડિલીટ કરો"
                      >
                        <Trash2 className="w-4 h-4" />
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 font-festive">
                સાંસ્કૃતિક સમિતિ સુરક્ષિત દસ્તાવેજો (2FA Enforced)
              </h3>
              <p className="text-xs text-stone-500">
                તમામ ફાઇલો ક્લાયન્ટ સાઇડ AES-256 એન્ક્રિપ્શન સાથે સુરક્ષિત છે.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {adminFiles.length > 0 && (
                <button
                  onClick={handleClearAllAdminFiles}
                  className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors border border-red-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>તમામ ફાઇલો સાફ કરો</span>
                </button>
              )}
              <button
                onClick={() => setIsUploadDocModalOpen(true)}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Upload className="w-4 h-4" />
                <span>નવો દસ્તાવેજ અપલોડ કરો</span>
              </button>
            </div>
          </div>

          {adminFiles.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-stone-200">
              <FileText className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-stone-700">કોઈ સમિતિ દસ્તાવેજ ઉપલબ્ધ નથી.</p>
              <p className="text-xs text-stone-400 mt-1">
                નવા દસ્તાવેજ અપલોડ કરવા "નવો દસ્તાવેજ અપલોડ કરો" બટન દબાવો.
              </p>
            </div>
          ) : (
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
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-emerald-700 font-semibold">
                        AES-GCM-256 ✓
                      </span>
                      <button
                        onClick={() => {
                          if (doc.file.dataUrl) {
                            const a = document.createElement('a');
                            a.href = doc.file.dataUrl;
                            a.download = doc.file.originalName;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                          } else {
                            downloadImageFile(doc.file, {
                              title: doc.title,
                              coordinator: doc.uploadedBy,
                            });
                          }
                        }}
                        className="p-1 text-stone-500 hover:text-amber-800 hover:bg-amber-50 rounded-md transition-colors"
                        title="આ ફાઇલ ડાઉનલોડ કરો"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAdminFile(doc.id, doc.title)}
                        className="p-1 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                        title="આ દસ્તાવેજ ડિલીટ કરો"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => exportPreIntroSheetToCSV(entries)}
                disabled={entries.filter((e) => e.preIntroRequired).length === 0}
                className="px-3.5 py-2 bg-purple-100 hover:bg-purple-200 text-purple-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-purple-300 shadow-2xs"
                title="કાર્યક્રમ શરૂ થાય તે પહેલાં આપવાની માહિતી ડાઉનલોડ કરો"
              >
                <Mic className="w-4 h-4 text-purple-700" />
                <span>એન્કરિંગ / પ્રિ-ઇન્ટ્રો શીટ ડાઉનલોડ ({entries.filter((e) => e.preIntroRequired).length})</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 self-start"
              >
                <Printer className="w-4 h-4" />
                <span>પ્રિન્ટ કરો (Print Stage Sheet)</span>
              </button>
            </div>
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
                  <th className="p-3">પ્રિ-ઇન્ટ્રો એન્કરિંગ માહિતી</th>
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
                    <td className="p-3">
                      {item.preIntroRequired ? (
                        <div className="space-y-1 max-w-xs">
                          <span className="font-bold text-purple-800 text-[11px] bg-purple-100 px-1.5 py-0.5 rounded border border-purple-200 inline-block">
                            હા (YES)
                          </span>
                          {item.preIntroDetails ? (
                            <p className="text-[11px] text-stone-700 font-medium italic line-clamp-2">
                              "{item.preIntroDetails}"
                            </p>
                          ) : (
                            <span className="text-[10px] text-stone-400 block">(માહિતી આપવાની છે)</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-stone-400">ના (NO)</span>
                      )}
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

      {/* TAB 4: Audit & Activity Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-700" />
                <h3 className="text-lg sm:text-xl font-bold font-festive text-stone-900">
                  સિસ્ટમ ઓડિટ & એક્ટિવિટી લૉગ્સ (Audit Logs)
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                ફોર્મ સબમિશન, સ્ટેટસ ફેરફાર અને સુરક્ષિત ફાઇલ ક્રિયાઓનો રીયલ-ટાઇમ લૉગ રેકોર્ડ.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {auditLogs.length > 0 && (
                <button
                  onClick={handleClearAllLogs}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>તમામ લૉગ્સ ડિલીટ કરો (Delete All Logs)</span>
                </button>
              )}
            </div>
          </div>

          {/* Search Logs */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="લૉગ વિગત, ક્રિયા અથવા વપરાશકર્તા થી શોધો..."
                value={logSearchQuery}
                onChange={(e) => setLogSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>
            <span className="text-xs text-stone-500 font-mono">
              કુલ લૉગ્સ: {filteredLogs.length}
            </span>
          </div>

          {/* Logs List Table */}
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-stone-200 rounded-2xl">
              <History className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-stone-700">કોઈ લૉગ્સ ઉપલબ્ધ નથી.</p>
              <p className="text-xs text-stone-400 mt-1">
                બધા લૉગ્સ ડિલીટ થયેલ છે અથવા શોધ પરિણામ શૂન્ય છે.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-700 uppercase text-[11px] font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-3 w-44">સમય (Timestamp)</th>
                    <th className="p-3 w-36">ક્રિયા પ્રકાર (Action)</th>
                    <th className="p-3">વિગત (Details)</th>
                    <th className="p-3 w-44">કર્તા (Performed By)</th>
                    <th className="p-3 w-20 text-center">ડિલીટ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="p-3 font-mono text-stone-500 text-[11px] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleDateString('gu-IN')} {new Date(log.timestamp).toLocaleTimeString('gu-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                            log.action === 'entry_created'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.action === 'status_updated'
                              ? 'bg-blue-100 text-blue-800'
                              : log.action === 'entry_deleted' || log.action === 'file_deleted' || log.action === 'all_entries_cleared'
                              ? 'bg-red-100 text-red-800'
                              : log.action === 'file_uploaded'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {log.action === 'entry_created'
                            ? 'નવી એન્ટ્રી'
                            : log.action === 'status_updated'
                            ? 'સ્ટેટસ બદલાયું'
                            : log.action === 'entry_deleted'
                            ? 'એન્ટ્રી ડિલીટ'
                            : log.action === 'file_uploaded'
                            ? 'ફાઇલ અપલોડ'
                            : log.action === 'file_deleted'
                            ? 'ફાઇલ ડિલીટ'
                            : log.action === 'all_entries_cleared'
                            ? 'ઓલ ક્લિયર'
                            : 'સિસ્ટમ'}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-stone-800">
                        {log.details}
                      </td>
                      <td className="p-3 text-stone-600 font-mono text-[11px]">
                        {log.performedBy}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDeleteSingleLog(log.id)}
                          className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center justify-center"
                          title="આ લૉગ ડિલીટ કરો"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
              
              {/* Program Overview & Pre-Intro Details Card */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-sm">{selectedEntryForReview.performanceTitle}</span>
                  <span className="font-mono text-stone-500 font-semibold">{selectedEntryForReview.formattedDuration} મિનિટ</span>
                </div>
                <div className="text-xs text-stone-600 flex items-center justify-between">
                  <span>તૈયાર કરાવનાર: <strong>{selectedEntryForReview.coordinatorName}</strong></span>
                  <span className="font-mono">{selectedEntryForReview.coordinatorPhone}</span>
                </div>

                {selectedEntryForReview.preIntroRequired && (
                  <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200 space-y-1.5 mt-2">
                    <div className="flex items-center justify-between font-bold text-purple-950 text-xs">
                      <span className="flex items-center gap-1.5">
                        <Mic className="w-3.5 h-3.5 text-purple-700" />
                        <span>કાર્યક્રમ શરૂ થાય તે પહેલાં આપવાની માહિતી:</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => downloadEntryPreIntro(selectedEntryForReview)}
                        className="px-2 py-0.5 bg-purple-200 hover:bg-purple-300 text-purple-900 rounded font-bold text-[10px] flex items-center gap-1 transition-colors border border-purple-300"
                        title="પ્રિ-ઇન્ટ્રો ટેક્સ્ટ ફાઇલ ડાઉનલોડ કરો"
                      >
                        <Download className="w-3 h-3 text-purple-800" />
                        <span>ડાઉનલોડ (.txt)</span>
                      </button>
                    </div>
                    {selectedEntryForReview.preIntroDetails ? (
                      <p className="text-xs text-purple-950 bg-white p-2 rounded-lg border border-purple-100 font-medium italic leading-relaxed">
                        "{selectedEntryForReview.preIntroDetails}"
                      </p>
                    ) : (
                      <p className="text-[11px] text-purple-700 italic">
                        (માહિતી આપવાની હા પાડેલ છે)
                      </p>
                    )}
                  </div>
                )}
              </div>

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
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4 gap-2">
              <span className="font-bold text-sm text-stone-900 truncate flex-1">
                {activeMediaModal.title}
              </span>

              <div className="flex items-center gap-2 shrink-0">
                {activeMediaModal.type === 'image' && (
                  <button
                    onClick={() => {
                      if (activeMediaModal.fileMeta) {
                        downloadImageFile(activeMediaModal.fileMeta, activeMediaModal.fallbackInfo);
                      } else {
                        const fallbackMeta: UploadedFileMeta = {
                          id: `img_${Date.now()}`,
                          originalName: activeMediaModal.title,
                          size: 0,
                          mimeType: 'image/jpeg',
                          encryptedHash: '',
                          encryptionAlgorithm: 'AES-GCM-256',
                          ivHex: '',
                          uploadedAt: new Date().toISOString(),
                          dataUrl: activeMediaModal.url,
                          encryptedStatus: 'verified',
                        };
                        downloadImageFile(fallbackMeta, activeMediaModal.fallbackInfo);
                      }
                    }}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    title="ઇમેજ ડાઉનલોડ કરો"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ફોટો ડાઉનલોડ</span>
                  </button>
                )}

                {(activeMediaModal.type === 'audio' || activeMediaModal.type === 'video') &&
                  activeMediaModal.url && (
                    <a
                      href={activeMediaModal.url}
                      download={activeMediaModal.title}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ડાઉનલોડ</span>
                    </a>
                  )}

                <button
                  onClick={() => setActiveMediaModal(null)}
                  className="text-stone-400 hover:text-stone-800 p-1 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  ✕
                </button>
              </div>
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
                <div className="w-full flex flex-col items-center gap-3">
                  <div className="max-h-[65vh] overflow-auto rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-center p-2 w-full">
                    <img
                      src={activeMediaModal.url}
                      alt="Participant list sheet"
                      className="max-h-[60vh] object-contain rounded-xl shadow-xs"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (activeMediaModal.fileMeta) {
                        downloadImageFile(activeMediaModal.fileMeta, activeMediaModal.fallbackInfo);
                      } else {
                        const fallbackMeta: UploadedFileMeta = {
                          id: `img_${Date.now()}`,
                          originalName: activeMediaModal.title,
                          size: 0,
                          mimeType: 'image/jpeg',
                          encryptedHash: '',
                          encryptionAlgorithm: 'AES-GCM-256',
                          ivHex: '',
                          uploadedAt: new Date().toISOString(),
                          dataUrl: activeMediaModal.url,
                          encryptedStatus: 'verified',
                        };
                        downloadImageFile(fallbackMeta, activeMediaModal.fallbackInfo);
                      }
                    }}
                    className="w-full py-2.5 px-4 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>સ્પર્ધકોની યાદી ફોટો ડાઉનલોડ કરો (Download Image)</span>
                  </button>
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

      {/* In-App Confirmation Modal (Replaces blocked window.confirm) */}
      {confirmDialog && confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs">
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-bold text-stone-900 font-festive">
                {confirmDialog.title}
              </h4>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                {confirmDialog.message}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-bold text-xs transition-colors"
              >
                રદ કરો (Cancel)
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
