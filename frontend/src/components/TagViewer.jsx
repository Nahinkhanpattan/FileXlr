import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCategory, setSearchQuery, setCompareFileA, setCompareFileB, setActiveTab } from '../store/fileSlice';
import { saveReport, clearSuccessMessage } from '../store/historySlice';
import {
  Tag,
  Search,
  Filter,
  Copy,
  Check,
  Save,
  Download,
  GitCompare,
  Hash,
  MapPin,
  FileCheck,
  Sparkles,
  Info,
} from 'lucide-react';
import GpsMapView from './GpsMapView';
import ExportModal from './ExportModal';

export default function TagViewer() {
  const dispatch = useDispatch();
  const { currentAnalysis, selectedCategory, searchQuery } = useSelector((state) => state.file);
  const { isSaving, successMessage, error: saveError } = useSelector((state) => state.history);

  const [copiedTag, setCopiedTag] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  if (!currentAnalysis) {
    return null;
  }

  const {
    fileName,
    formattedSize,
    mimeType,
    fileCategory,
    tagCount,
    hashes,
    gpsCoordinates,
    metadata,
  } = currentAnalysis;

  // Category Tabs List
  const categories = ['ALL', 'EXIF', 'IPTC', 'XMP', 'GPS', 'System', 'Audio', 'Video', 'Document'];

  // Copy tag text to clipboard
  const handleCopyTag = (name, val) => {
    const text = `${name}: ${val}`;
    navigator.clipboard.writeText(text);
    setCopiedTag(name);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  // Dispatch save report to database
  const handleSaveToHistory = () => {
    dispatch(saveReport(currentAnalysis));
    setTimeout(() => dispatch(clearSuccessMessage()), 4000);
  };

  // Filter tags based on selectedCategory & searchQuery
  const filteredMetadata = {};
  for (const [catName, tags] of Object.entries(metadata || {})) {
    if (!tags || tags.length === 0) continue;

    if (selectedCategory !== 'ALL' && selectedCategory !== catName) {
      continue;
    }

    const matchingTags = tags.filter((t) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        t.name?.toLowerCase().includes(q) ||
        String(t.value)?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
      );
    });

    if (matchingTags.length > 0) {
      filteredMetadata[catName] = matchingTags;
    }
  }

  return (
    <div className="space-y-6">
      {/* File Metadata Overview Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800">
                {fileCategory}
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate max-w-lg">
                {fileName}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-3">
              <span>Size: <strong className="text-slate-700 dark:text-slate-300">{formattedSize}</strong></span>
              <span>MIME: <strong className="text-slate-700 dark:text-slate-300">{mimeType}</strong></span>
              <span>Extracted Tags: <strong className="text-blue-600 dark:text-blue-400 font-bold">{tagCount} tags</strong></span>
            </p>
          </div>

          {/* Action Buttons: Save to DB, Compare, Export */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSaveToHistory}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all border border-slate-200 dark:border-slate-600"
            >
              <Save className="w-3.5 h-3.5 text-blue-500" />
              <span>{isSaving ? 'Saving...' : 'Save to DB'}</span>
            </button>

            <button
              onClick={() => {
                dispatch(setCompareFileA(currentAnalysis));
                dispatch(setActiveTab('compare'));
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-all"
            >
              <GitCompare className="w-3.5 h-3.5 text-indigo-500" />
              <span>Compare File</span>
            </button>

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export (JSON/CSV/XML)</span>
            </button>
          </div>
        </div>

        {/* Database Save Toast Notice */}
        {successMessage && (
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              {successMessage}
            </span>
          </div>
        )}

        {/* Hashes Summary Strip */}
        {hashes && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-800 font-mono text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-500 shrink-0">MD5:</span>
              <span className="text-slate-800 dark:text-slate-200 truncate select-all">{hashes.md5}</span>
            </div>
            <div className="flex items-center gap-2 overflow-hidden">
              <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-500 shrink-0">SHA256:</span>
              <span className="text-slate-800 dark:text-slate-200 truncate select-all">{hashes.sha256}</span>
            </div>
          </div>
        )}
      </div>

      {/* GPS Location Map (If image has GPS metadata) */}
      {gpsCoordinates && (
        <GpsMapView gpsData={gpsCoordinates} fileName={fileName} />
      )}

      {/* Category Pills & Instant Tag Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count =
              cat === 'ALL'
                ? tagCount
                : metadata[cat]?.length || 0;

            if (cat !== 'ALL' && count === 0) return null; // Hide empty tag categories

            return (
              <button
                key={cat}
                onClick={() => dispatch(setCategory(cat))}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                    isSelected
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tag Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search EXIF / Tag Name or Value..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Grouped Tags Display Tables */}
      <div className="space-y-6">
        {Object.keys(filteredMetadata).length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              No metadata tags match your filter or search query.
            </p>
          </div>
        ) : (
          Object.entries(filteredMetadata).map(([groupName, groupTags]) => (
            <div
              key={groupName}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"
            >
              {/* Group Header */}
              <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-500" />
                  <h3 className="text-sm font-bold tracking-wide uppercase text-slate-800 dark:text-slate-200">
                    {groupName} Metadata ({groupTags.length})
                  </h3>
                </div>
              </div>

              {/* Tags Table */}
              <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {groupTags.map((tag, idx) => (
                  <div
                    key={idx}
                    className="p-4 hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors grid grid-cols-1 md:grid-cols-12 gap-2 items-start"
                  >
                    {/* Tag Name */}
                    <div className="md:col-span-4 flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 font-mono">
                        {tag.name}
                      </span>
                    </div>

                    {/* Tag Value */}
                    <div className="md:col-span-7 font-mono text-xs text-blue-600 dark:text-blue-400 break-words font-medium">
                      {String(tag.value)}
                    </div>

                    {/* Copy Button */}
                    <div className="md:col-span-1 flex justify-end">
                      <button
                        onClick={() => handleCopyTag(tag.name, tag.value)}
                        title="Copy Tag"
                        className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
                      >
                        {copiedTag === tag.name ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Export Modal Component */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        metadataData={currentAnalysis}
      />
    </div>
  );
}
