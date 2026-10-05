import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Async Thunk for Single File Upload & Metadata Analysis
export const analyzeFile = createAsyncThunk(
  'file/analyzeFile',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_URL}/metadata/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to extract file metadata'
      );
    }
  }
);

// Async Thunk for Batch Processing
export const analyzeBatch = createAsyncThunk(
  'file/analyzeBatch',
  async (files, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append('files', f));

      const response = await axios.post(`${API_URL}/metadata/analyze-batch`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Batch processing failed'
      );
    }
  }
);

const initialState = {
  currentAnalysis: null,
  batchResults: [],
  isLoading: false,
  error: null,
  selectedCategory: 'ALL',
  searchQuery: '',
  // File Comparison State (File A & File B)
  compareFileA: null,
  compareFileB: null,
  isComparing: false,
  activeTab: 'viewer', // 'viewer', 'compare', 'batch', 'history'
};

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    setDirectAnalysis(state, action) {
      state.currentAnalysis = action.payload;
      state.error = null;
    },
    setCompareFileA(state, action) {
      state.compareFileA = action.payload;
    },
    setCompareFileB(state, action) {
      state.compareFileB = action.payload;
    },
    clearComparison(state) {
      state.compareFileA = null;
      state.compareFileB = null;
      state.isComparing = false;
    },
    resetFileState(state) {
      state.currentAnalysis = null;
      state.batchResults = [];
      state.isLoading = false;
      state.error = null;
      state.searchQuery = '';
      state.selectedCategory = 'ALL';
    },
  },
  extraReducers: (builder) => {
    builder
      // Single File Analysis
      .addCase(analyzeFile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(analyzeFile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentAnalysis = action.payload;
        state.selectedCategory = 'ALL';
        // Auto set compare File A if empty
        if (!state.compareFileA) {
          state.compareFileA = action.payload;
        } else if (!state.compareFileB && state.compareFileA.fileName !== action.payload.fileName) {
          state.compareFileB = action.payload;
        }
      })
      .addCase(analyzeFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Batch Analysis
      .addCase(analyzeBatch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(analyzeBatch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.batchResults = action.payload;
        if (action.payload.length > 0) {
          state.currentAnalysis = action.payload[0];
        }
      })
      .addCase(analyzeBatch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCategory,
  setSearchQuery,
  setActiveTab,
  setDirectAnalysis,
  setCompareFileA,
  setCompareFileB,
  clearComparison,
  resetFileState,
} = fileSlice.actions;

export default fileSlice.reducer;
