"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import OpenGraphTags from "@/utils/OpenGraphTags";
import MuiTheme from "@/components/theme";
import { useEffect, type ReactNode, Suspense } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import { login, logout } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Providers } from "@/redux/provider";
import { store } from "@/redux/store";
import Message from "@/components/message";
import { useSelector } from "react-redux";
import ToastProvider from "@/redux/toastProvider";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Ecommerce web",
//   description: "Ecommerce web",
// };
interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  // const dispatch = useAppDispatch();
  // // check at page load if a user is authenticated
  // useEffect(() => {
  //   onAuthStateChanged(auth, (userAuth) => {
  //     if (userAuth) {
  //       // user is logged in, send the user's details to redux, store the current user in the state
  //       dispatch(
  //         login({
  //           email: userAuth.email,
  //           uid: userAuth.uid,
  //           displayName: userAuth.displayName,
  //           photoUrl: userAuth.photoURL,
  //         })
  //       );
  //     } else {
  //       dispatch(logout());
  //     }
  //   });
  // }, []);

  return (
    <html>
      <OpenGraphTags />
      <body className={inter.className}>
        <Providers>
          <ToastProvider>
            <Suspense fallback="Loading...">
              <MuiTheme>{children}</MuiTheme>
            </Suspense>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
