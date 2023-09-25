"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import OpenGraphTags from "@/utils/OpenGraphTags";
import MuiTheme from "@/components/theme";
import { type ReactNode, Suspense } from "react";
import { Providers } from "@/redux/provider";
import ToastProvider from "@/redux/toastProvider";
import React from "react";
import PackageStateChanged from "@/components/auth/PackageStateChanged";
import BackdropLoading from "@/components/backdrop"

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
          <PackageStateChanged>
            <ToastProvider>
              <Suspense fallback={<BackdropLoading />}>
                <MuiTheme>{children}</MuiTheme>
              </Suspense>
            </ToastProvider>
          </PackageStateChanged>
        </Providers>
      </body>
    </html>
  );
}
