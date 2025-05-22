import { configureStore } from '@reduxjs/toolkit';
import { equipesApi } from './features/equipes/equipesApi';
import equipesReducer from './features/equipes/equipesSlice';

export const store = configureStore({
  reducer: {
    [equipesApi.reducerPath]: equipesApi.reducer,
    equipes: equipesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(equipesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 