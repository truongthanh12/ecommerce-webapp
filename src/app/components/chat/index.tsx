import React, { useEffect } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Image from "../Image";
import { Box, styled } from "@mui/material";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import db from "@/firebase";
import { setMessages } from "@/redux/features/chatSlice";
import { channelChatroom, pusher } from "../pusher/pusher";

const Avatar = styled(Box)(() => ({
  width: 32,
  height: 32,
  borderRadius: "50%",
  overflow: "hidden",
  objectFit: "cover",
  objectPosition: "center",
  "& + span": {
    paddingLeft: 8,
  },
}));
const Chat = () => {
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.auth);
  const messages = useSelector((state: RootState) => state.chat.messages);
  
  useEffect(() => {
    channelChatroom.bind("pusher:subscription_succeeded", () => {
      console.log("pusher:subscription_succeeded");
    });

    channelChatroom.bind("pusher:subscription_error", (error: never) => {
      console.error("pusher:subscription_error", error);
    });

    channelChatroom.bind('client-message', (data: unknown) => {
      console.log('message', data)
    })
  }, []);



  useEffect(() => {
    const fetchData = async () => {
      if (user?.uid && data?.chatId) {
        try {
          const docSnap = await getDoc(doc(db, "messages", data.chatId));
          if (docSnap.exists()) {
            dispatch(setMessages(docSnap.data().messages));
          }

          const unSub = onSnapshot(doc(db, "messages", data.chatId), (doc) => {
            doc.exists() && dispatch(setMessages(doc.data().messages));
          });

          return () => {
            unSub();
          };
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    fetchData();
  }, [data.chatId, dispatch, user?.uid]);

  return (
    <div className="chat">
      <div className="chatInfo">
        <Avatar>
          <Image
            style={{ width: "100%" }}
            src={user?.photoURL || "/assets/images/avatars/001-man.svg"}
            alt={user?.displayName}
          />
        </Avatar>
        <span>{user?.displayName}</span>
      </div>
      <Messages messages={messages} />
      <Input />
    </div>
  );
};

export default Chat;
