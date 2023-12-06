"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import OpenGraphTags from "@/utils/OpenGraphTags";
import MuiTheme from "@/components/theme";
import { Suspense, type ReactNode } from "react";
import { Providers } from "@/redux/provider";
import ToastProvider from "@/redux/toastProvider";
import React from "react";
import PackageStateChanged from "@/components/auth/PackageStateChanged";
import AuthStateChanged from "@/components/auth/AuthStateChanged";
import { defaultLocale, locales } from "@/middleware";
import BackdropLoading from "@/components/backdrop";
import Popup from "@/components/popup";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });
interface LayoutProps {
  children: ReactNode;
  params: { lang: string };
}

export default function RootLayout({ children, params }: LayoutProps) {
  return (
    <html lang={params.lang ?? defaultLocale}>
      <OpenGraphTags />
      <Script src="https://js.pusher.com/8.0.1/pusher.min.js" />
      <body className={inter.className}>
        <Providers>
          <PackageStateChanged>
            <AuthStateChanged>
              <ToastProvider>
                <Suspense fallback={<BackdropLoading />}>
                  <MuiTheme>{children}</MuiTheme>
                  <Popup />
                </Suspense>
              </ToastProvider>
            </AuthStateChanged>
          </PackageStateChanged>
        </Providers>
      </body>
    </html>
  );
}
