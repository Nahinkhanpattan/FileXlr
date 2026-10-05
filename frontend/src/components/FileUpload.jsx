import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { analyzeFile, analyzeBatch, setCompareFileB } from '../store/fileSlice';
import { UploadCloud, File, Image, Music, Film, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function FileUpload({ isCompareMode = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const { isLoading, error, currentAnalysis } = useSelector((state) => state.file);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const processFiles = (fileList) => {
    if (fileList.length === 1) {
      if (isCompareMode) {
        dispatch(analyzeFile(fileList[0])).then((action) => {
          if (action.payload) {
            dispatch(setCompareFileB(action.payload));
          }
        });
      } else {
        dispatch(analyzeFile(fileList[0]));
      }
    } else if (fileList.length > 1) {
      dispatch(analyzeBatch(fileList));
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
          isDragging
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple={!isCompareMode}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 shadow-inner">
            {isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <UploadCloud className="w-8 h-8" />
            )}
          </div>

          <div>
            <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              {isLoading
                ? 'Extracting Metadata & EXIF Tags...'
                : isCompareMode
                ? 'Upload Second File to Compare'
                : 'Drop files here or click to browse'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Supports Images (JPG, PNG, WEBP, TIFF), Audio (MP3, WAV), Video (MP4, MKV), Documents (PDF, TXT), and raw binaries up to 50MB.
            </p>
          </div>

          {/* Supported Format Icons Pill */}
          <div className="flex items-center justify-center gap-4 pt-2 text-slate-400 dark:text-slate-500 text-xs">
            <span className="flex items-center gap-1"><Image className="w-3.5 h-3.5" /> Images</span>
            <span className="flex items-center gap-1"><Music className="w-3.5 h-3.5" /> Audio</span>
            <span className="flex items-center gap-1"><Film className="w-3.5 h-3.5" /> Video</span>
            <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> Documents</span>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
