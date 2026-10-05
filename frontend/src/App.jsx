import React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import DemoFiles from './components/DemoFiles';
import FileUpload from './components/FileUpload';
import TagViewer from './components/TagViewer';
import ExifCliViewer from './components/ExifCliViewer';
import FileComparer from './components/FileComparer';
import HistoryView from './components/HistoryView';
import AuthModal from './components/AuthModal';
import { Terminal, Shield, Sparkles, Layers } from 'lucide-react';

export default function App() {
  const { isCliViewMode } = useTheme();
  const activeTab = useSelector((state) => state.file.activeTab);
  const currentAnalysis = useSelector((state) => state.file.currentAnalysis);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Instant Demo Test Files Bar */}
        <DemoFiles />

        {/* Tab 1: Metadata Explorer */}
        {activeTab === 'viewer' && (
          <div className="space-y-6">
            <FileUpload />

            {currentAnalysis && (
              <div className="mt-8">
                {isCliViewMode ? <ExifCliViewer /> : <TagViewer />}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Compare Files Side-by-Side */}
        {activeTab === 'compare' && <FileComparer />}

        {/* Tab 3: Batch Processor */}
        {activeTab === 'batch' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900/50">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Batch Metadata Extraction Queue
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Upload multiple files simultaneously to extract metadata in batch.
                  </p>
                </div>
              </div>
            </div>
            <FileUpload />
            {currentAnalysis && <TagViewer />}
          </div>
        )}

        {/* Tab 4: Saved Database History */}
        {activeTab === 'history' && <HistoryView />}
      </main>

      {/* JWT Auth Modal */}
      <AuthModal />

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-500" />
            fileXlr Metadata Analyzer • MERN Stack Architecture
          </span>
          <span className="text-slate-400">
            Powered by Node.js, Express, MongoDB, React, Redux Toolkit & Context API
          </span>
        </div>
      </footer>
    </div>
  );
}
