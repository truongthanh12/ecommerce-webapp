import Link from "next/link";
import { Box, MenuItem, styled } from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import React from "react";
import { CategoryIcon } from "@/common";

//styled component
const Wrapper = styled(Box)(({ theme }) => ({
  "& .category-dropdown-link": {
    height: 40,
    display: "flex",
    minWidth: "278px",
    cursor: "pointer",
    whiteSpace: "pre",
    padding: "0px 1rem",
    alignItems: "center",
    transition: "all 250ms ease-in-out",
    "& .title": {
      flexGrow: 1,
      paddingLeft: "0.75rem",
    },
  },
  "&:hover": {
    "& > .category-dropdown-link": {
      color: theme.palette.primary.main,
      background: theme.palette.action.hover,
    },
    "& > .mega-menu": {
      display: "block",
    },
  },
}));

// =============================================================

const CategoryMenuItem = ({ href, title, caret, children, ...rest }: any) => {

  return (
    <Wrapper>
      <Link href={href || ""}>
        <MenuItem className="category-dropdown-link">
          {rest.icon && <>{CategoryIcon[rest.icon]}</>}
          <span className="title">{title}</span>
          {caret && <ChevronRight fontSize="small" />}
        </MenuItem>
      </Link>

      {children}
    </Wrapper>
  );
};

export default React.memo(CategoryMenuItem);
