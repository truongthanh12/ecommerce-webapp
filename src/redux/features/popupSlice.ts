import { createSlice } from "@reduxjs/toolkit";

export const popupSlice = createSlice({
  name: "popup",
  initialState: {
    popup: null,
  },
  reducers: {
    setPopup: (state, action) => {
      const { popup } = action.payload;
      state.popup = popup;
    },
    clearPopup: (state) => {
      state.popup = null;
    },
  },
});

export const { setPopup, clearPopup } = popupSlice.actions;

export default popupSlice.reducer;
