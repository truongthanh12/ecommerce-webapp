import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import AuthPopup from "./AuthPopup";
import { popupName } from "@/utils/constants";

const Popup = () => {
  const { popup } = useSelector((state: RootState) => state.popup);
  if (!popup) return null;

  switch (popup) {
    case popupName:
      // return <UpdatePost />;
      return
    default:
      return <AuthPopup />;
  }
};

export default React.memo(Popup);
