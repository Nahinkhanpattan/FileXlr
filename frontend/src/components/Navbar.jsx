import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../store/fileSlice';
import {
  Terminal,
  Sun,
  Moon,
  FileSearch,
  GitCompare,
  Layers,
  History,
  User,
  LogOut,
  ShieldAlert,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { isDarkMode, toggleDarkMode, isCliViewMode, toggleCliViewMode } = useTheme();
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.file.activeTab);

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & ExifTool Tagline */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl text-white shadow-md shadow-blue-500/20">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                  file<span className="text-blue-600 dark:text-blue-400">Xlr</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800">
                  ExifTool
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Deep File Metadata & EXIF / IPTC / XMP Analyzer
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => dispatch(setActiveTab('viewer'))}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'viewer'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileSearch className="w-4 h-4" />
              Metadata Explorer
            </button>

            <button
              onClick={() => dispatch(setActiveTab('compare'))}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'compare'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              Compare Files
            </button>

            <button
              onClick={() => dispatch(setActiveTab('batch'))}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'batch'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              Batch Processor
            </button>

            <button
              onClick={() => dispatch(setActiveTab('history'))}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              Saved History
            </button>
          </nav>

          {/* Action Buttons: CLI Mode Toggle, Theme Toggle, Auth */}
          <div className="flex items-center gap-2">
            {/* CLI Mode Toggle (Context API) */}
            <button
              onClick={toggleCliViewMode}
              title="Toggle ExifTool Terminal View"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg border transition-all ${
                isCliViewMode
                  ? 'bg-slate-900 text-emerald-400 border-emerald-500/50 shadow-md shadow-emerald-900/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{isCliViewMode ? 'CLI Mode ON' : 'CLI View'}</span>
            </button>

            {/* Dark/Light Mode Toggle (Context API) */}
            <button
              onClick={toggleDarkMode}
              title="Toggle Light/Dark Theme"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Auth Controls (Context API) */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white leading-none">
                    {user?.name || 'Authenticated User'}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {user?.email || 'Logged In'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Log Out"
                  className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In / JWT</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => dispatch(setActiveTab('viewer'))}
            className={`p-2 rounded-lg text-xs font-medium ${
              activeTab === 'viewer' ? 'text-blue-600 font-semibold' : 'text-slate-500'
            }`}
          >
            Explorer
          </button>
          <button
            onClick={() => dispatch(setActiveTab('compare'))}
            className={`p-2 rounded-lg text-xs font-medium ${
              activeTab === 'compare' ? 'text-blue-600 font-semibold' : 'text-slate-500'
            }`}
          >
            Compare
          </button>
          <button
            onClick={() => dispatch(setActiveTab('batch'))}
            className={`p-2 rounded-lg text-xs font-medium ${
              activeTab === 'batch' ? 'text-blue-600 font-semibold' : 'text-slate-500'
            }`}
          >
            Batch
          </button>
          <button
            onClick={() => dispatch(setActiveTab('history'))}
            className={`p-2 rounded-lg text-xs font-medium ${
              activeTab === 'history' ? 'text-blue-600 font-semibold' : 'text-slate-500'
            }`}
          >
            History
          </button>
        </div>
      </div>
    </header>
  );
}
