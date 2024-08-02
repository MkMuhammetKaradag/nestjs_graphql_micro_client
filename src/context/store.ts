import AuthReducer from './slices/AuthSlice';
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
const store = configureStore({
  reducer: {
    auth: AuthReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
