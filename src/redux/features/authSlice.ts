import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    isLoading: false,
    error: {},
  },
  reducers: {
    loading: (state) => {
      state.isLoading = true;
    },
    login: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.error = {};
    },
    loginError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = {};
    },
  },
});

export const { login, logout, loading, loginError } = userSlice.actions;

//data saved in store
type TypeUserData = {
  data: any;
  optionalData?: { isVendor: boolean };
};
export const userData = ({ data, optionalData }: TypeUserData) => {
  const isVendor = optionalData?.isVendor ?? false; // Use optional chaining and nullish coalescing

  return {
    email: data.user.email || "",
    uid: data.user.uid,
    displayName: data.user.displayName || "",
    photoURL: data.user.photoURL || "",
    emailVerified: data.user.emailVerified,
    phoneNumber: data.user.phoneNumber || "",
    isVendor: isVendor || false,
  };
};

// selectors
export const selectUser = (state: any) => state.user.user;

export default userSlice.reducer;
