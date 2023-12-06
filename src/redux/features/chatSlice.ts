import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  chatId: string;
  user: Record<string, any>;
  chats: Record<string, any>;
  messages: Record<string, any>;
  isOpen: boolean;
}

const initialState: ChatState = {
  chatId: "",
  user: {},
  chats: {},
  messages: [],
  isOpen: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    changeUser: (state, action: PayloadAction<Record<string, any>>) => {
      state.user = action.payload;
      state.chatId =
        state.user && state.user.currentUserId > action.payload.uid
          ? state.user.currentUserId + action.payload.uid
          : action.payload.uid + state.user.currentUserId;
    },
    setChats: (state, action: PayloadAction<Record<string, any>>) => {
      state.chats = action.payload;
    },
    setMessages: (state, action: PayloadAction<Record<string, any>>) => {
      state.messages = action.payload;
    },
    openChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    closeChat: (state) => {
      state.isOpen = false;
    },
  },
});

export const { changeUser, setChats, setMessages, openChat, closeChat } =
  chatSlice.actions;
export default chatSlice.reducer;
