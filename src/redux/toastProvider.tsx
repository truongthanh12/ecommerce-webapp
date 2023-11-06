"use client";

import Message from "@/components/message";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage } from "./features/messageSlice";
import { RootState } from "./store";
interface MessageProps {
  message: string | null;
  type: "success" | "error";
}
export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const timerRef = useRef<NodeJS.Timeout | undefined>();

  const { message, type } = useSelector((state: RootState) => state.message);

  useEffect(() => {
    if (message) {
      timerRef.current = setTimeout(() => dispatch(clearMessage()), 3000);
    }
    return () => {
      // Clear the timeout when the component unmounts
      clearTimeout(timerRef.current);
    };
  }, [dispatch, message]);

  return (
    <>
      {children}
      <Message open={!!message} type={type || "success"} message={message} />
    </>
  );
}
