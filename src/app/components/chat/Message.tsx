import React, { useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "../Image";
import { IChat } from "@/app/models/Chat";
import { formatMessageTime } from "@/app/utils/lib";

const Message = ({ message }: { message: Partial<IChat> }) => {
  const data = useSelector((state: RootState) => state.chat);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);
  const messageDate = useMemo(() => {
    if (message.date instanceof Date) {
      // If message.date is already a Date object, use it directly
      return message.date;
    } else if (message.date?.toDate) {
      // If message.date has a toDate method (Firestore Timestamp), convert it
      return message.date.toDate();
    } else if (message.date?.seconds) {
      // If message.date is a Timestamp object, construct a Date from it
      return new Date(message.date.seconds * 1000 + (message.date.nanoseconds || 0) / 1e6);
    }
    // If message.date is undefined or not recognized, return null
    return null;
  }, [message.date]);

  // Format the message time using useMemo
  const formattedTime = useMemo(() => {
    if (messageDate) {
      return formatMessageTime(messageDate);
    }
    return "";
  }, [messageDate]);

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <Image
          src={
            (message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL) || "/assets/images/avatars/001-man.svg"
          }
          alt=""
        />
        <span>{formattedTime}</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <Image src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
