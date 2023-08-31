import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "message",
  initialState: {
    message: null,
    type: "success",
  },
  reducers: {
    setMessage: (state, action) => {
      const { message, type } = action.payload;
      state.message = message;
      state.type = type;
    },
    clearMessage: (state) => {
      state.message = null;
      state.type = "success";
    },
  },
});

export const { setMessage, clearMessage } = userSlice.actions;

export default userSlice.reducer;
