import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHistory, deleteReport } from '../store/historySlice';
import { setDirectAnalysis, setActiveTab } from '../store/fileSlice';
import { History, Trash2, ExternalLink, Calendar, FileText, Loader2, Database } from 'lucide-react';

export default function HistoryView() {
  const dispatch = useDispatch();
  const { items, isLoading, error } = useSelector((state) => state.history);

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  const handleOpenReport = (report) => {
    dispatch(setDirectAnalysis(report));
    dispatch(setActiveTab('viewer'));
  };

  const handleDelete = (id) => {
    dispatch(deleteReport(id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900/50">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Database Analysis History (MongoDB)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Saved metadata reports associated with your user session.
            </p>
          </div>
        </div>

        <button
          onClick={() => dispatch(fetchHistory())}
          className="px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 rounded-xl border border-blue-200 dark:border-blue-900/50 transition-colors"
        >
          Refresh List
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Fetching saved reports from database...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <History className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            No saved metadata reports in database yet.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Click "Save to DB" on any extracted metadata view to store it.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((report) => (
            <div
              key={report._id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-md">
                    {report.fileCategory || 'Binary'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {report.fileName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Size: <strong className="text-slate-700 dark:text-slate-300">{report.fileSize ? `${Math.round(report.fileSize / 1024)} KB` : 'N/A'}</strong> • Tags: <strong className="text-blue-600 font-bold">{report.tagCount}</strong>
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                <button
                  onClick={() => handleOpenReport(report)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>Inspect Tags</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(report._id)}
                  title="Delete Report"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
