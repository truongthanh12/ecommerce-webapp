"use client"
import { Card, styled } from "@mui/material";
import React from "react";

// ===============================================

// ===============================================
type TypeCard = {
  hoverEffect?: boolean;
  children: React.ReactNode;
  elevation?: number;
  sx?: any;
};
const CardComp: React.FC<TypeCard> = styled(
  ({ hoverEffect, children, ...rest }: TypeCard) => (
    <Card {...rest}>{children}</Card>
  )
)(({ theme, hoverEffect }) => ({
  overflow: "unset",
  borderRadius: "8px",
  transition: "all 250ms ease-in-out",
  "&:hover": {
    ...(hoverEffect && {
      boxShadow: theme.shadows[3],
    }),
  },
}));

export default React.memo(CardComp);
