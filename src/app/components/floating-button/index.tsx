import React, { useEffect, useState } from "react";
import { ChatSharp, Close } from "@mui/icons-material";
import {
  Box,
  styled,
  Divider,
  Tooltip,
  IconButton,
  ClickAwayListener,
  Grid,
} from "@mui/material";
import { H6 } from "@/components/Typography";
import Sidebar from "../chat/Sidebar";
import { closeChat, openChat } from "@/redux/features/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Chat from "../chat";

// custom styled components
const MainContainer = styled(Box)(({ theme }) => ({
  bottom: 120,
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
  width: showBody ? 600 : 0,
  padding: showBody ? 24 : 0,
  boxShadow: theme.shadows[3],
  transition: "transform 0.4s",
  maxHeight: showBody ? "calc(100vh - 100px)" : 0,
  transform: `translateY(${showBody ? 0 : "10px"})`,
  height: 620,
}));

const StyledHeader = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "sticky",
  top: 0,
  backgroundColor: "white",
  zIndex: 1,
  width: "100%",
});

const StyledSearch = styled("div")({
  display: "flex",
  alignItems: "center",
  padding: "15px",
  borderRadius: "2px",
  border: "1px solid whitesmoke",
  marginTop: "12px",
  width: "100%",
});

const StyledSearchInput = styled("input")({
  outline: "none",
  border: "none",
  width: "100%",
  flex: 1,
});

const Chats = () => {
  const { isOpen } = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const handleOpenChat = () => {
    dispatch(openChat());
  };
  const handleClickAway = () => {
    if (isOpen) {
      setTimeout(() => {
        openChat();
      }, 100);
    }
  };

  useEffect(() => {
    return () => {
      if (isOpen) {
        dispatch(closeChat());
      }
    };
  }, [dispatch, isOpen]);

  if (!user?.uid) return null;
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <MainContainer>
        <Tooltip title="Chats" placement="left">
          <StyledIconButton onClick={() => handleOpenChat()}>
            {!isOpen && <ChatSharp />}
            {isOpen && <Close />}
          </StyledIconButton>
        </Tooltip>

        {isOpen && (
          <BodyWrapper showBody={isOpen ? 1 : 0}>
            <H6 textAlign="center" mb={2}>
              Chats
            </H6>
            <Divider />
            {/* <StyledHeader>
            <StyledSearch>
              <SearchIcon style={{ marginRight: "8px" }} />
              <StyledSearchInput placeholder="Search in conversations" />
            </StyledSearch>
          </StyledHeader>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={3} borderRight={"1px solid whitesmoke"}>
              <Sidebar setUserSelected={setUserSelected} />
            </Grid>
            <Grid item xs={9} px={1}>
              <ConversationScreen userSelected={userSelected} />
            </Grid>
          </Grid> */}
            <article className="home">
              <div className="container">
                <Sidebar />
                <Chat />
              </div>
            </article>
          </BodyWrapper>
        )}
      </MainContainer>
    </ClickAwayListener>
  );
};

export default React.memo(Chats);
