import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { usePathname } from "next/navigation";
import useCustomRouter from "@/hooks/usePushRouter";

const AuthStateChanged = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const pathname = usePathname();
  const { pushRouter } = useCustomRouter();

  useEffect(() => {
    if (
      pathname.includes("vendor") ||
      pathname.includes("admin") ||
      pathname.includes("profile") ||
      pathname.includes("order") ||
      pathname.includes("vendor") ||
      pathname.includes("cart") ||
      pathname.includes("checkout") ||
      pathname.includes("wishlist")
    ) {
      if (!user?.uid) {
        pushRouter("/");
      }
    }
  }, [user, pathname]);

  return <>{children}</>;
};

export default React.memo(AuthStateChanged);
