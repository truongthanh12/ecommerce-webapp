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
import AuthStateChanged from "@/components/auth/AuthStateChanged";
import { defaultLocale } from "@/middleware";

const inter = Inter({ subsets: ["latin"] });
interface LayoutProps {
  children: ReactNode;
  params: { lang: string };
}

export default function RootLayout({ children, params }: LayoutProps) {
  return (
    <html lang={params.lang || defaultLocale}>
      <OpenGraphTags />
      <body className={inter.className}>
        <Providers>
          <PackageStateChanged>
            <AuthStateChanged>
              <ToastProvider>
                <MuiTheme>{children}</MuiTheme>
              </ToastProvider>
            </AuthStateChanged>
          </PackageStateChanged>
        </Providers>
      </body>
    </html>
  );
}
