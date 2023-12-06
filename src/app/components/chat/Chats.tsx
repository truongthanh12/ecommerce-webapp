import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  doc,
  onSnapshot,
  DocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { RootState } from "@/redux/store";
import db from "@/firebase";
import { changeUser, setChats } from "@/redux/features/chatSlice";
import Image from "../Image";
import { ChatType } from "@/app/models/Chat";
import isEmpty from "lodash/isEmpty";

const Chats: React.FC = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state: RootState) => state.chat.chats);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  // const [chats, setChats] = useState<any>();
  useEffect(() => {
    const getChats = () => {
      if (!currentUser?.uid) {
        return;
      }

      const chatRef = doc(db, "userChats", currentUser.uid);
      const unsub = onSnapshot(
        chatRef,
        (doc: DocumentSnapshot<DocumentData>) => {
          if (doc.exists()) {
            const chatsData: DocumentData | undefined = doc?.data();

            if (chatsData) {
              dispatch(setChats(chatsData));
            }
          }
        }
      );

      return unsub;
    };
    getChats();
  }, [currentUser?.uid, dispatch]);

  useEffect(() => {
    if (!isEmpty(chats)) {
      const firstChatId = Object.keys(chats)[0];
      const firstChat = chats[firstChatId] as ChatType;

      if (firstChat) {
        const data = { ...firstChat.userInfo, currentUserId: currentUser?.uid };
        dispatch(changeUser(data));
      }
    }
  }, [chats, currentUser?.uid, dispatch]);

  const handleSelect = (user: Record<string, any>) => {
    const data = { ...user, currentUserId: currentUser?.uid };
    dispatch(changeUser(data));
  };
  
  return (
    <div className="chats">
      {!isEmpty(chats) &&
        Object.entries(chats)
          ?.sort((a, b) => (b[1] as ChatType).date - (a[1] as ChatType).date)
          .map((chat) => (
            <div
              className="userChat"
              key={chat[0]}
              onClick={() => handleSelect((chat[1] as ChatType)?.userInfo)}
            >
              <Image
                src={
                  (chat[1] as ChatType)?.userInfo?.photoURL ||
                  "/assets/images/avatars/001-man.svg"
                }
                alt="avatar"
              />
              <div className="userChatInfo">
                <span>
                  {(chat[1] as ChatType)?.userInfo?.displayName ||
                    (chat[1] as ChatType)?.userInfo?.email}
                </span>
                <p>{(chat[1] as ChatType)?.lastMessage?.text}</p>
              </div>
            </div>
          ))}
    </div>
  );
};

export default Chats;
