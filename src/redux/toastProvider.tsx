"use client";

import Message from "@/app/components/message";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage } from "./features/messageSlice";
import { RootState } from "./store";
interface MessageProps {
  message: string | null;
  type: "success" | "error";
};
export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  const { message, type } = useSelector((state: RootState) => state.message);

  useEffect(() => {
    setTimeout(() => dispatch(clearMessage()), 3000);
  }, [dispatch, message]);

  return (
    <>
      {children}
      <Message open={!!message} type={type || "success"} message={message} />
    </>
  );
}
