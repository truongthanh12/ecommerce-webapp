import React from "react";
import Message from "./Message";
import { IChat } from "@/app/models/Chat";

const Messages = ({ messages }: { messages: any }) => {
  return (
    <div className="messages">
      {messages.map((m: IChat) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
