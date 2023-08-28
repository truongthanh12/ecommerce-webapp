import { Box } from "@mui/material";
import React, { memo } from "react";

type TypeFlexBetween = {
  children: React.ReactNode;
  width?: string;
  mx?: number;
  px?: number;
  py?: number;
  height?: number;
  mb?: number | string;
  flexWrap?: "nowrap" | "wrap" | "wrap-reverse";
  mt?: number;
  pl?: number;
  pr?: number;
  maxHeight?: string | number;
  justifyContent?: "center" | "space-between";
  p?: number;
};
const FlexBetween: React.FC<TypeFlexBetween> = ({ children, ...props }) => (
  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    {...props}
  >
    {children}
  </Box>
);
export default memo(FlexBetween);
