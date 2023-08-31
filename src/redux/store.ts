import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import authSlice from "./features/authSlice";
import messageSlice from "./features/messageSlice";

const authPersistConfig = {
  key: "auth",
  storage,
  blacklist: ["isLoading"],
};

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2,
  blacklist: ["message"],
};

const rootReducer: any = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice),
  message: messageSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});

export const persistor = persistStore(store, null, () => {
  store.getState();
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
