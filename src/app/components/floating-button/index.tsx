import React, { useEffect, useRef, useState } from "react";
import { ChatSharp, Close } from "@mui/icons-material";
import {
  Box,
  styled,
  Divider,
  Tooltip,
  IconButton,
  ClickAwayListener,
} from "@mui/material";
import { H6 } from "@/components/Typography";
import { FlexBox } from "@/components/flex-box";
import socketIOClient from "socket.io-client";
import {
  doc,
  setDoc,
  collection,
  serverTimestamp,
  query,
  onSnapshot,
  orderBy,
  DocumentData,
} from "firebase/firestore";
import db from "@/firebase";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

// custom styled components
const MainContainer = styled(Box)(({ theme }) => ({
  top: 50,
  right: 50,
  zIndex: 1501,
  position: "fixed",
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  right: 50,
  zIndex: 99,
  bottom: 50,
  padding: 12,
  color: "#fff",
  position: "fixed",
  borderRadius: "50%",
  boxShadow: theme.shadows[12],
  backgroundColor: theme.palette.primary.main,
  ":hover": {
    backgroundColor: theme.palette.primary.main,
  },
}));
const BodyWrapper = styled(Box, {
  shouldForwardProp: (props) => props !== "showBody",
})(({ theme, showBody }: { theme?: any; showBody: number }) => ({
  overflow: "auto",
  borderRadius: "4px",
  backgroundColor: "white",
  opacity: showBody ? 1 : 0,
  width: showBody ? 300 : 0,
  padding: showBody ? 24 : 0,
  boxShadow: theme.shadows[3],
  transition: "transform 0.4s",
  maxHeight: showBody ? "calc(100vh - 100px)" : 0,
  transform: `translateY(${showBody ? 0 : "10px"})`,
}));

const Chats = () => {
  const [showBody, setShowBody] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  let socketio = socketIOClient("http://localhost:5001");
  const [chats, setChats] = useState<DocumentData[]>([]);
  const avatar = localStorage.getItem("avatar");
  const chatsRef = collection(db, "messages");
  const messagesEndRef = useRef<HTMLElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  useEffect(() => {
    socketio.on("chat", (senderChats) => {
      setChats(senderChats);
    });
  }, [socketio]);

  useEffect(() => {
    const q = query(chatsRef, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const fireChats: DocumentData[] = [];
      querySnapshot.forEach((doc) => {
        fireChats.push(doc.data());
      });
      setChats(fireChats);
    });
    return () => {
      unsub();
    };
  }, []);

  function addToFirrebase(chat: any) {
    const newChat = {
      avatar,
      createdAt: serverTimestamp(),
      user,
      message: chat.message,
    };

    const chatRef = doc(chatsRef);
    setDoc(chatRef, newChat)
      .then(() => console.log("Chat added succesfully"))
      .catch(console.log);
  }

  function sendChatToSocket(chat: any) {
    socketio.emit("chat", chat);
  }

  function addMessage(chat: any) {
    const newChat = { ...chat, user: localStorage.getItem("user"), avatar };
    addToFirrebase(chat);
    setChats([...chats, newChat]);
    sendChatToSocket([...chats, newChat]);
  }

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("avatar");
  }

  return (
    <ClickAwayListener onClickAway={() => setShowBody(false)}>
      <MainContainer>
        <Tooltip title="Chats" placement="left">
          <StyledIconButton onClick={() => setShowBody((state) => !state)}>
            {!showBody && <ChatSharp />}
            {showBody && <Close />}
          </StyledIconButton>
        </Tooltip>

        <BodyWrapper showBody={showBody ? 1 : 0}>
          <FlexBox gap={2}></FlexBox>

          <Divider
            sx={{
              my: 3,
            }}
          />

          <H6 textAlign="center" mb={2}>
            Chats
          </H6>

          <FlexBox gap={2} flexWrap="wrap"></FlexBox>
        </BodyWrapper>
      </MainContainer>
    </ClickAwayListener>
  );
};

export default React.memo(Chats);
