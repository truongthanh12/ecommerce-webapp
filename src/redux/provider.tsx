"use client";
import React from "react";
import { persistor, store } from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import BackdropLoading from "@/components/backdrop";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<BackdropLoading />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
