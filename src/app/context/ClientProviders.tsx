"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";
import { ThemeProvider } from "./ThemeContext";
import React from "react";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </Provider>
  );
}
