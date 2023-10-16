import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { usePathname } from "next/navigation";
import useCustomRouter from "@/hooks/usePushRouter";
import { ADMIN_ID } from "@/app/constant";

const AuthStateChanged = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const pathname = usePathname();
  const { pushRouter } = useCustomRouter();

  useEffect(() => {
    if (
      pathname.includes("vendor") ||
      pathname.includes("admin") ||
      pathname.includes("vendor") ||
      pathname.includes("profile") ||
      pathname.includes("order") ||
      pathname.includes("cart") ||
      pathname.includes("checkout") ||
      pathname.includes("wishlist")
    ) {
      if (!user?.uid) {
        pushRouter("/");
        return;
      }
    }
    if (
      (pathname.includes("admin/customer") ||
        pathname.includes("admin/sellers/recharge-requests") ||
        pathname === "/admin/sellers") &&
      user?.uid !== ADMIN_ID
    ) {
      pushRouter("/");
      return;
    }
  }, [user, pathname]);

  return <>{children}</>;
};

export default React.memo(AuthStateChanged);
