import React, { useState } from "react";
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
