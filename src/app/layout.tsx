"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import OpenGraphTags from "@/utils/OpenGraphTags";
import MuiTheme from "@/components/theme";
import { type ReactNode } from "react";
import { Providers } from "@/redux/provider";
import ToastProvider from "@/redux/toastProvider";
import React from "react";
import PackageStateChanged from "@/components/auth/PackageStateChanged";

const inter = Inter({ subsets: ["latin"] });
interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html>
      <OpenGraphTags />
      <body className={inter.className}>
        <Providers>
          <PackageStateChanged>
            <ToastProvider>
              <MuiTheme>{children}</MuiTheme>
            </ToastProvider>
          </PackageStateChanged>
        </Providers>
      </body>
    </html>
  );
}
