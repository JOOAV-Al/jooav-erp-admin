import Cookies from "js-cookie";
import { AuthState } from '@/features/auth/types';
import { User } from '@/interfaces/authentication';
import {createSlice, PayloadAction} from '@reduxjs/toolkit'

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isUserLoading: true,
  availabilityStatus: null,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: ( state, action: PayloadAction<{token: string, user: User}>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isUserLoading = false;
      Cookies.set("authToken", action.payload.token, {
        sameSite: "strict",
      });
    },
    setAvailabilityStatus: (state, action: PayloadAction<{availabilityStatus: string | null}>) => {
      state.availabilityStatus = action.payload?.availabilityStatus;
    },
    updateUserData: (state, action: PayloadAction<{user: User | null}>) => {
      state.user = action.payload?.user;
    },
    logout: (state) => {
      state.isUserLoading = true;
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.availabilityStatus = null;
    },
  }
})

export const { setCredentials, setAvailabilityStatus, updateUserData, logout} = authSlice.actions;
export default authSlice.reducer