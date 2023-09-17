"use client";
import { Box, Container } from "@mui/material";
import appIcons from "@/components/icons";
import { FlexRowCenter } from "@/components/flex-box";
import React from "react";
import { ICategory } from "@/app/models/Category";
import { Title } from "./styles";
import Scrollbar from "@/components/Scrollbar";
import { CategoryIcon } from "@/common";

// Props interface
interface ParentCategoriesProps {
  icon: string;
  title: string;
}
interface PageProps {
  categories: ParentCategoriesProps[];
  selected: string | null;
  onChangeCategory: (slug: string) => void;
}

const SaleNavbar = ({ categories, selected, onChangeCategory }: PageProps) => {
  return (
    <Box bgcolor="background.paper">
      <Container>
        <Scrollbar
          sx={{
            height: "5rem",
            display: "flex",
            backgroundColor: "white",
            justifyContent: "center",
          }}
          autohide=""
        >
          {categories.map((item: ParentCategoriesProps) => {
            const isSelected = item.title === selected;
            return (
              <FlexRowCenter
                key={item.title}
                onClick={() => onChangeCategory(item.title)}
                sx={{
                  cursor: "pointer",
                  minWidth: "120px",
                  flexDirection: "column",
                  background: isSelected ? "primary.light" : "transparent",
                }}
              >
                {item.icon && (
                  <span
                    style={{
                      fontSize: 28,
                      color: isSelected ? "primary" : "secondary",
                    }}
                  >
                    {CategoryIcon.hasOwnProperty(item.icon)
                      ? CategoryIcon[item.icon]
                      : CategoryIcon["default"]}
                  </span>
                )}

                <Title selected={isSelected}>{item.title}</Title>
              </FlexRowCenter>
            );
          })}
        </Scrollbar>
      </Container>
    </Box>
  );
};

export default React.memo(SaleNavbar);
