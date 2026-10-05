import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { X, FileJson, FileSpreadsheet, Code2, Download } from 'lucide-react';

export default function ExportModal({ isOpen, onClose, metadataData }) {
  const [exportFormat, setExportFormat] = useState('json');

  if (!isOpen || !metadataData) return null;

  const { fileName, metadata, hashes, rawExifToolOutput } = metadataData;
  const baseName = fileName ? fileName.replace(/\.[^/.]+$/, '') : 'metadata';

  const handleDownload = () => {
    if (exportFormat === 'json') {
      const blob = new Blob([JSON.stringify(metadataData, null, 2)], {
        type: 'application/json;charset=utf-8',
      });
      saveAs(blob, `${baseName}_exiftool_metadata.json`);
    } else if (exportFormat === 'csv') {
      let csvRows = ['Category,Tag Name,Tag Value,Description'];
      if (metadata) {
        Object.entries(metadata).forEach(([cat, tags]) => {
          if (Array.isArray(tags)) {
            tags.forEach((t) => {
              const safeVal = String(t.value || '').replace(/"/g, '""');
              const safeDesc = String(t.description || '').replace(/"/g, '""');
              csvRows.push(`"${cat}","${t.name}","${safeVal}","${safeDesc}"`);
            });
          }
        });
      }
      const blob = new Blob([csvRows.join('\n')], {
        type: 'text/csv;charset=utf-8',
      });
      saveAs(blob, `${baseName}_exiftool_metadata.csv`);
    } else if (exportFormat === 'xml') {
      let xmlLines = ['<?xml version="1.0" encoding="UTF-8"?>', '<exiftool_report>'];
      xmlLines.push(`  <filename>${fileName}</filename>`);
      xmlLines.push(`  <md5>${hashes?.md5 || ''}</md5>`);
      xmlLines.push(`  <sha256>${hashes?.sha256 || ''}</sha256>`);
      xmlLines.push('  <tags>');

      if (metadata) {
        Object.entries(metadata).forEach(([cat, tags]) => {
          if (Array.isArray(tags)) {
            tags.forEach((t) => {
              xmlLines.push(`    <tag category="${cat}">`);
              xmlLines.push(`      <name>${t.name}</name>`);
              xmlLines.push(`      <value><![CDATA[${t.value}]]></value>`);
              xmlLines.push(`    </tag>`);
            });
          }
        });
      }

      xmlLines.push('  </tags>');
      xmlLines.push('</exiftool_report>');

      const blob = new Blob([xmlLines.join('\n')], {
        type: 'application/xml;charset=utf-8',
      });
      saveAs(blob, `${baseName}_exiftool_metadata.xml`);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-blue-500" />
          Export ExifTool Metadata Report
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Select target file format to export all extracted metadata tags.
        </p>

        {/* Format Selection Cards */}
        <div className="grid grid-cols-3 gap-3 my-6">
          <button
            onClick={() => setExportFormat('json')}
            className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
              exportFormat === 'json'
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold ring-2 ring-blue-500/20'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
          >
            <FileJson className="w-6 h-6 text-blue-500" />
            <span className="text-xs font-semibold">JSON</span>
          </button>

          <button
            onClick={() => setExportFormat('csv')}
            className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
              exportFormat === 'csv'
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
          >
            <FileSpreadsheet className="w-6 h-6 text-emerald-500" />
            <span className="text-xs font-semibold">CSV</span>
          </button>

          <button
            onClick={() => setExportFormat('xml')}
            className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
              exportFormat === 'xml'
                ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 font-bold ring-2 ring-amber-500/20'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
          >
            <Code2 className="w-6 h-6 text-amber-500" />
            <span className="text-xs font-semibold">XML</span>
          </button>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download .{exportFormat.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
