import { configureStore } from '@reduxjs/toolkit';
import { equipesApi } from './features/equipes/equipesApi';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: {
    [equipesApi.reducerPath]: equipesApi.reducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(equipesApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Enable the refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 