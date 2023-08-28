"use client";
import { Container, alpha, styled } from "@mui/material";
import React from "react";
// import SimpleBar from "simplebar-react";
const StyledScrollBar = styled(Container)(({ theme }) => ({
  maxHeight: "100%",
  "& .simplebar-scrollbar": {
    "&.simplebar-visible:before": {
      opacity: 1,
    },
    "&:before": {
      backgroundColor: alpha(theme.palette.grey[400], 0.6),
    },
  },
  "& .simplebar-track.simplebar-vertical": {
    width: 9,
  },
  "& .simplebar-track.simplebar-horizontal .simplebar-scrollbar": {
    height: 6,
  },
  "& .simplebar-mask": {
    zIndex: "inherit",
  },
}));

// =============================================================

// =============================================================
type TypeScrollbar = {
  children?: React.ReactNode;
  sx?: any;
  autoHide?: boolean;
};
const Scrollbar: React.FC<TypeScrollbar> = ({ children, sx, ...props }) => {
  return (
    <StyledScrollBar sx={sx} {...props}>
      {children}
    </StyledScrollBar>
  );
};
export default React.memo(Scrollbar);
