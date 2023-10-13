import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { usePathname, useRouter } from "next/navigation";

const AuthStateChanged = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const pathname = usePathname();
  const router = useRouter();

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
        router.push("/");
      }
    }
  }, [user, pathname]);

  return <>{children}</>;
};

export default React.memo(AuthStateChanged);
