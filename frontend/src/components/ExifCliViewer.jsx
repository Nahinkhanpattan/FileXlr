import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Terminal, Copy, Check, TerminalSquare } from 'lucide-react';

export default function ExifCliViewer() {
  const currentAnalysis = useSelector((state) => state.file.currentAnalysis);
  const [copied, setCopied] = useState(false);

  if (!currentAnalysis) {
    return null;
  }

  const { fileName, rawExifToolOutput } = currentAnalysis;

  const handleCopyCli = () => {
    if (rawExifToolOutput) {
      navigator.clipboard.writeText(rawExifToolOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-exif-cli text-emerald-400 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs">
      {/* Terminal Titlebar */}
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="ml-2 text-slate-400 text-xs font-semibold flex items-center gap-1.5">
            <TerminalSquare className="w-3.5 h-3.5 text-emerald-400" />
            exiftool -all:all -g "{fileName}"
          </span>
        </div>

        <button
          onClick={handleCopyCli}
          className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied Output</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy Raw ExifTool Stdout</span>
            </>
          )}
        </button>
      </div>

      {/* Terminal Output Buffer */}
      <div className="p-6 overflow-x-auto custom-scrollbar max-h-[600px] leading-relaxed whitespace-pre">
        <div className="text-slate-500 mb-3">$ exiftool -s -G1 "{fileName}"</div>
        <div className="text-emerald-400 font-mono select-all">
          {rawExifToolOutput || 'No raw stdout available.'}
        </div>
        <div className="mt-4 flex items-center gap-2 text-slate-500">
          <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse" />
          <span>[Command completed successfully]</span>
        </div>
      </div>
    </div>
  );
}
