import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Async Thunk: Fetch history list from MongoDB / Backend
export const fetchHistory = createAsyncThunk(
  'history/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/metadata/history`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch history'
      );
    }
  }
);

// Async Thunk: Save report to MongoDB / Backend
export const saveReport = createAsyncThunk(
  'history/saveReport',
  async (metadataResult, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/metadata/save`, {
        metadataResult,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to save report'
      );
    }
  }
);

// Async Thunk: Delete report by ID
export const deleteReport = createAsyncThunk(
  'history/deleteReport',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/metadata/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete report'
      );
    }
  }
);

const initialState = {
  items: [],
  isLoading: false,
  isSaving: false,
  error: null,
  successMessage: null,
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch History
      .addCase(fetchHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Save Report
      .addCase(saveReport.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(saveReport.fulfilled, (state, action) => {
        state.isSaving = false;
        state.items.unshift(action.payload);
        state.successMessage = 'Report saved to database successfully!';
      })
      .addCase(saveReport.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload;
      })
      // Delete Report
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export const { clearSuccessMessage } = historySlice.actions;
export default historySlice.reducer;
