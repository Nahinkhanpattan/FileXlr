import { configureStore } from '@reduxjs/toolkit';
import fileReducer from './fileSlice';
import historyReducer from './historySlice';

export const store = configureStore({
  reducer: {
    file: fileReducer,
    history: historyReducer,
  },
});
