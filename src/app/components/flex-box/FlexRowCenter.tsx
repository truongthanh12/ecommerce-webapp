import { Box } from "@mui/material";
import React from "react";
type TypeFlexRowCenter = {
  children: React.ReactNode;
  mt?: string;
  alignItems?: string
  gap?: string | number
};
const FlexRowCenter: React.FC<TypeFlexRowCenter> = ({ children, ...props }) => (
  <Box display="flex" justifyContent="center" alignItems="center" {...props}>
    {children}
  </Box>
);
export default React.memo(FlexRowCenter);
