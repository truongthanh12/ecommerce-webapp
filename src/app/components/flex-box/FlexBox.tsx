import { Box } from "@mui/material";
import React from "react";
type TypeFlexbox = {
  children: React.ReactNode;
  className?: string;
  alignItems?: string;
  gap?: number;
  justifyContent?: string;
  mt?: number | string;
  ml?: number | string;
  mr?: number;
  bgcolor?: string;
  borderRadius?: string;
  py?: number;
  px?: number;
  color?: string;
  flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  height?: string;
  borderBottom?: any;
  flex?: string | number;
  minWidth?: string;
  position?: "relative" | "absolute" | "fixed";
  sx?: any;
  mx?: number;
  width?: string;
};
const FlexBox: React.FC<TypeFlexbox> = ({ children, ...props }) => (
  <Box display="flex" {...props}>
    {children}
  </Box>
);
export default React.memo(FlexBox);
