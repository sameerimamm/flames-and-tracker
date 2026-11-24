'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FlamesRecord } from '../lib/db';
import {
  X,
  Trash2,
  RefreshCw,
  Search,
  Users,
  Database,
  Calendar,
  MapPin,
  Download,
  AlertTriangle,
} from 'lucide-react';

interface AdminRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordDeleted?: () => void;
}

export const AdminRecordsModal: React.FC<AdminRecordsModalProps> = ({
  isOpen,
  onClose,
  onRecordDeleted,
}) => {
  const [records, setRecords] = useState<FlamesRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isClearingAll, setIsClearingAll] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchRecords = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/records', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.records)) {
        setRecords(data.records);
      } else {
        setErrorMessage('Failed to load database records.');
      }
    } catch (err) {
      setErrorMessage('Could not connect to database endpoint.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRecords();
    }
  }, [isOpen]);

  const handleDelete = async (id: string, name1: string, name2: string) => {
    if (!confirm(`Are you sure you want to remove "${name1} & ${name2}" from the database?`)) {
      return;
    }

    setIsDeletingId(id);
    try {
      const res = await fetch(`/api/records?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setRecords((prev) => prev.filter((r) => r.id !== id));
        onRecordDeleted?.();
      } else {
        alert('Failed to delete record: ' + (data.error || 'Unknown error'));
      }
    } catch {
      alert('Error connecting to server.');
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear ALL submission records? This cannot be undone.')) {
      return;
    }

    setIsClearingAll(true);
    try {
      const res = await fetch('/api/records?clearAll=true', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setRecords([]);
        onRecordDeleted?.();
      }
    } catch {
      alert('Error clearing records.');
    } finally {
      setIsClearingAll(false);
    }
  };

  const handleExportCSV = () => {
    if (records.length === 0) return;
    const headers = ['ID', 'Person 1', 'Person 2', 'Result', 'Count', 'Date', 'Location'];
    const rows = records.map((r) => [
      r.id,
      `"${r.name1}"`,
      `"${r.name2}"`,
      `"${r.resultEmoji} ${r.resultWord}"`,
      r.remainingCount,
      `"${new Date(r.timestamp).toLocaleString()}"`,
      `"${r.clientInfo || 'N/A'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `flames_submissions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return records;
    const q = searchQuery.toLowerCase();
    return records.filter(
      (r) =>
        r.name1.toLowerCase().includes(q) ||
        r.name2.toLowerCase().includes(q) ||
        r.resultWord.toLowerCase().includes(q)
    );
  }, [records, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  Submissions Database
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold font-mono">
                  {records.length} records
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track who is using the FLAMES calculator in real-time. Remove any names anytime.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchRecords}
              disabled={isLoading}
              title="Refresh Records"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-500' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar & Search */}
        <div className="p-4 sm:px-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or result..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {records.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearAll}
                  disabled={isClearingAll}
                  className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Records Content List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isLoading && records.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
              <p className="text-xs font-medium">Loading database submissions...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <Users className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {searchQuery ? 'No matching submissions found' : 'No calculations recorded yet'}
              </p>
              <p className="text-xs text-slate-500 max-w-sm">
                Whenever anyone enters two names and clicks &quot;Calculate Destiny&quot; on your live site, their submission will appear right here!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5">
              {filteredRecords.map((r) => {
                const dateStr = new Date(r.timestamp).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={r.id}
                    className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-500/40 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xl shrink-0 shadow-sm">
                        {r.resultEmoji}
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                            {r.name1} & {r.name2}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-pink-500/10 text-pink-600 dark:text-pink-400 shrink-0">
                            {r.resultWord}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1 font-mono">
                            Count: <strong>{r.remainingCount}</strong>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{dateStr}</span>
                          </span>
                          {r.clientInfo && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1 truncate max-w-[150px]">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span>{r.clientInfo}</span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleDelete(r.id, r.name1, r.name2)}
                      disabled={isDeletingId === r.id}
                      title="Remove this name pair"
                      className="self-end sm:self-center p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Showing <strong>{filteredRecords.length}</strong> of <strong>{records.length}</strong> total submissions
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
