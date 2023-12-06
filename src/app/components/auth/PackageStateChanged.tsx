import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { updateUserAsync, updateUserData } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";

const PackageStateChanged = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch: any = useAppDispatch();
  const convertFirestoreTimestampToDate = (timestamp: any) => {
    const { seconds, nanoseconds } = timestamp || {};
    const milliseconds = seconds * 1000 + nanoseconds / 1e6;
    return new Date(milliseconds);
  };

  useEffect(() => {
    const currentDate = new Date();
    const data = {
      expiredPackage: "None",
      userType: "None",
    };
    if (user?.isVendor && (user?.userType !== "None" || !user?.userType)) {
      if (
        currentDate?.getTime() >
          new Date(
            convertFirestoreTimestampToDate(user?.expiredPackage)
          ).getTime() ||
        currentDate?.getTime() > new Date(user?.expiredPackage).getTime()
      ) {
        dispatch(
          updateUserAsync({
            updateUser: updateUserData(data, true, user, true),
            id: user?.docId,
          })
        );
      }
    }
  }, [user, dispatch]);
  return <>{children}</>;
};

export default React.memo(PackageStateChanged);
