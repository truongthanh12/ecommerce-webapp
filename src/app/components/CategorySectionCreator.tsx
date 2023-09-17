"use client";
import { Box, Container } from "@mui/material";
import CategorySectionHeader from "./CategorySectionHeader";
import React from "react";

// ==============================================================
interface TypeProps {
  icon: React.JSX.Element;
  title: string;
  children: React.ReactNode;
  seeMoreLink: string;
  length?: number;
}
const CategorySectionCreator = ({
  icon,
  title,
  children,
  seeMoreLink,
  length,
  ...rest
}: TypeProps) => {
  return (
    <Box mb={7.5} {...rest}>
      <Container
        sx={{
          pb: "1rem",
        }}
      >
        {title ? (
          <CategorySectionHeader
            title={title}
            seeMoreLink={seeMoreLink}
            icon={icon}
            length={length || 0}
          />
        ) : (
          ""
        )}

        {children}
      </Container>
    </Box>
  );
};
export default React.memo(CategorySectionCreator);
