import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { updateUserAsync, updateUserData } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";

const PackageStateChanged = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSelector((state: any) => state.auth);
  const dispatch: any = useAppDispatch();
  const currentDate = new Date();
  const data = {
    expiredPackage: "None",
    userType: "None",
  };

  useEffect(() => {
    if (user.expiredPackage !== "None") {
      if (currentDate?.getTime() > new Date(user?.expiredPackage).getTime()) {
        dispatch(
          updateUserAsync({
            updateUser: updateUserData(data, true, user, true),
            id: user?.docId,
          })
        );
      }
    }
  }, [user.expiredPackage, dispatch]);
  return <>{children}</>;
};

export default React.memo(PackageStateChanged);
