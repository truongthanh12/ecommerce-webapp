"use client";

import Message from "@/app/components/message";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage } from "./features/messageSlice";

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

  const { message, type } = useSelector((state: any) => state.message);

  useEffect(() => {
    setTimeout(() => dispatch(clearMessage()), 3000);
  }, [message]);

  return (
    <>
      {children}
      <Message open={!!message} type={type || "success"} message={message} />
    </>
  );
}