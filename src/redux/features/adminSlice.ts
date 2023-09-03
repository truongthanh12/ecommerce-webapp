import { createSlice } from "@reduxjs/toolkit";

export const adminStatusSlice = createSlice({
  name: "status",
  initialState: {
    status: "edit",
  },
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { setStatus } = adminStatusSlice.actions;

export default adminStatusSlice.reducer;
