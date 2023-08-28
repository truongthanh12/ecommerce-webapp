import { Box, styled } from "@mui/material";
import React from "react";
const HoverBox = styled(Box)({
  position: "relative",
  overflow: "hidden",
  "&:after": {
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    bottom: 0,
    content: '" "',
    position: "absolute",
    transition: "all 250ms ease-in-out",
  },
  "&:hover:after": {
    background: "rgba(0, 0, 0, 0.3)",
  },
});

export default React.memo(HoverBox);
