import { Box } from "@mui/material";
import React, { memo } from "react";

type TypeFlexBetween = {
  children: React.ReactNode;
  width?: string
  mx?: number
  height?: number
  mb?: number | string
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
