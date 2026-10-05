import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCompareFileA, setCompareFileB, clearComparison } from '../store/fileSlice';
import { GitCompare, File, X, AlertCircle, ArrowRightLeft, Equal, Diff } from 'lucide-react';
import FileUpload from './FileUpload';

export default function FileComparer() {
  const dispatch = useDispatch();
  const { compareFileA, compareFileB } = useSelector((state) => state.file);

  // Extract all tag keys across both files
  const getAllTagMap = (report) => {
    if (!report || !report.metadata) return {};
    const map = {};
    Object.values(report.metadata).forEach((tags) => {
      if (Array.isArray(tags)) {
        tags.forEach((t) => {
          map[t.name] = t.value;
        });
      }
    });
    return map;
  };

  const mapA = getAllTagMap(compareFileA);
  const mapB = getAllTagMap(compareFileB);

  // Union of all tag names
  const allTagNames = Array.from(new Set([...Object.keys(mapA), ...Object.keys(mapB)])).sort();

  return (
    <div className="space-y-6">
      {/* Compare Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-200 dark:border-indigo-900/40">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Side-by-Side ExifTool Metadata Comparison
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Compare EXIF headers, IPTC, XMP, hashes, and attributes between two files with highlighted diffs.
              </p>
            </div>
          </div>

          {(compareFileA || compareFileB) && (
            <button
              onClick={() => dispatch(clearComparison())}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-xl border border-rose-200 dark:border-rose-900/50 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Comparison</span>
            </button>
          )}
        </div>

        {/* File Pickers row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* File A Card */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40">
            <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400">
              Target File A
            </span>
            {compareFileA ? (
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs">
                    {compareFileA.fileName}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">
                    {compareFileA.formattedSize} • {compareFileA.mimeType}
                  </p>
                </div>
                <button
                  onClick={() => dispatch(setCompareFileA(null))}
                  className="p-1 text-slate-400 hover:text-rose-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500 mt-2">
                No File A loaded. Click analyze on Explorer or upload below.
              </p>
            )}
          </div>

          {/* File B Card */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40">
            <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400">
              Target File B
            </span>
            {compareFileB ? (
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs">
                    {compareFileB.fileName}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">
                    {compareFileB.formattedSize} • {compareFileB.mimeType}
                  </p>
                </div>
                <button
                  onClick={() => dispatch(setCompareFileB(null))}
                  className="p-1 text-slate-400 hover:text-rose-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="mt-2">
                <FileUpload isCompareMode={true} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Diff Table */}
      {compareFileA && compareFileB ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 grid grid-cols-12 font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300">
            <div className="col-span-4 flex items-center gap-2">
              <Diff className="w-4 h-4 text-blue-500" />
              Tag Name
            </div>
            <div className="col-span-4 text-blue-600 dark:text-blue-400 truncate">
              File A ({compareFileA.fileName})
            </div>
            <div className="col-span-4 text-indigo-600 dark:text-indigo-400 truncate">
              File B ({compareFileB.fileName})
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/60 font-mono text-xs">
            {allTagNames.map((tagName) => {
              const valA = mapA[tagName];
              const valB = mapB[tagName];
              const isDifferent = String(valA) !== String(valB);

              return (
                <div
                  key={tagName}
                  className={`p-4 grid grid-cols-12 gap-2 items-start transition-colors ${
                    isDifferent
                      ? 'bg-amber-50/60 dark:bg-amber-950/20 hover:bg-amber-100/60'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
                  }`}
                >
                  <div className="col-span-4 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    {isDifferent ? (
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Different values" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                    )}
                    <span className="truncate">{tagName}</span>
                  </div>

                  <div
                    className={`col-span-4 break-words ${
                      valA !== undefined
                        ? 'text-slate-800 dark:text-slate-200'
                        : 'text-slate-400 italic'
                    }`}
                  >
                    {valA !== undefined ? String(valA) : '[Missing]'}
                  </div>

                  <div
                    className={`col-span-4 break-words ${
                      valB !== undefined
                        ? 'text-slate-800 dark:text-slate-200'
                        : 'text-slate-400 italic'
                    }`}
                  >
                    {valB !== undefined ? String(valB) : '[Missing]'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <ArrowRightLeft className="w-8 h-8 text-slate-400 mx-auto mb-2 animate-bounce" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Please load both File A and File B to compare metadata side by side.
          </p>
        </div>
      )}
    </div>
  );
}
