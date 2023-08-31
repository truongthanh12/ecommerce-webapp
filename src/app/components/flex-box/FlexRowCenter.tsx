import { Box } from "@mui/material";
import React from "react";
type TypeFlexRowCenter = {
  children: React.ReactNode;
  mt: string;
  alignItems: string;
  gap: string | number;
  mb: number;
  width: number | string;
  minWidth: number;
  height: number;
  bgcolor: string;
  border: string;
  borderRadius: string;
  ml: any;
  my: string;
  style: any;
  mr: string;
  onClick: () => void;
  borderColor: string;
  px: number;
  minHeight: string;
  flexDirection: "row" | "column";
  flexWrap: "wrap" | "nowrap";
  justifyContent: "flex-start" | "center" | "flex-end";
};
const FlexRowCenter: React.FC<Partial<TypeFlexRowCenter>> = ({ children, ...props }) => (
  <Box display="flex" justifyContent="center" alignItems="center" {...props}>
    {children}
  </Box>
);
export default React.memo(FlexRowCenter);
