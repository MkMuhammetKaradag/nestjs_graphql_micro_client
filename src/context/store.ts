import AuthReducer from './slices/AuthSlice';
import AppReducer from './slices/AppSlice';
import ShoppingCartReducer from './slices/ShoppingCartSlice';
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
const store = configureStore({
  reducer: {
    auth: AuthReducer,
    app: AppReducer,
    shoppingCart: ShoppingCartReducer,
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
