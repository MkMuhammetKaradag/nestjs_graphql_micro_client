import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profilPhoto?: string;
}

export interface AuthState {
  user: User | null;
  isAuth: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuth: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },

    setIsAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
  },
});

export const { setUser, setIsAuth } = authSlice.actions;

export default authSlice.reducer;
