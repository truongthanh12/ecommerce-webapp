import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "../Image";
import { IChat } from "@/app/models/Chat";

const Message = ({ message }: { message: Partial<IChat> }) => {
  const data = useSelector((state: RootState) => state.chat);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

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
        <span>just now</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <Image src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
