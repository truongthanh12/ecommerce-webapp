"use client"
import Link from "next/link";
import { memo } from "react";
import {
  Add,
  ExpandMore,
  Facebook,
  Instagram,
  Remove,
  Twitter,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  Container,
  IconButton,
  MenuItem,
  styled,
} from "@mui/material";
import TouchRipple from "@mui/material/ButtonBase";
import { Span } from "@/components/Typography";
import { FlexBetween, FlexBox } from "@/components/flex-box";
import Menu from "@/components/Menu";
import { layoutConstant } from "@/utils/constants";
// import { useTranslation } from "react-i18next";

// styled component
const TopbarWrapper = styled(Box, {
  shouldForwardProp: (props) => props !== "bgColor",
})(({ theme, bgColor, expand }: any) => ({
  fontSize: 12,
  height: layoutConstant.topbarHeight,
  color: theme.palette.secondary.contrastText,
  background: bgColor || theme.palette.grey[900],
  transition: "height 300ms ease",
  "& .menuItem": {
    minWidth: 100,
  },
  "& .marginRight": {
    marginRight: "1.25rem",
  },
  "& .expand": {
    display: "none",
    padding: 0,
  },
  "& .handler": {
    height: layoutConstant.topbarHeight,
  },
  "& .menuTitle": {
    fontSize: 12,
    marginLeft: "0.5rem",
    fontWeight: 600,
  },
  [theme.breakpoints.down("sm")]: {
    height: expand ? 80 : layoutConstant.topbarHeight,
    "& .topbarRight": {
      display: expand ? "flex" : "none",
      paddingBottom: 5,
    },
    "& .expand": {
      display: "block",
      height: layoutConstant.topbarHeight,
    },
    "& .MuiSvgIcon-root": {
      color: "white",
    },
  },
}));
const StyledContainer = styled(Container)(({ theme }) => ({
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  [theme.breakpoints.down("sm")]: {
    alignItems: "start",
    flexDirection: "column",
  },
}));

// ===========================================

// ===========================================
type TypePropsTopbar = {
  bgColor?: string;
};
const Topbar: React.FC<TypePropsTopbar> = ({ bgColor }) => {

  const handleLanguageClick = (lang: string) => () => {
    //
  };

  return (
    <TopbarWrapper bgcolor={bgColor} >
      <StyledContainer>
        <FlexBetween width="100%">
          <FlexBox alignItems="center" gap={1}>
            <Chip
              label="HOT"
              size="small"
              sx={{
                color: "white",
                fontWeight: 700,
                backgroundColor: "primary.main",
                "& .MuiChip-label": {
                  pl: ".8rem",
                  pr: ".8rem",
                },
              }}
            />
            <Span className="title">Free Express Shipping</Span>
          </FlexBox>

          <IconButton
            disableRipple
            className="expand"
          >
            {/* {expand ? <Remove /> : <Add />} */}
          </IconButton>
        </FlexBetween>

        <FlexBox className="topbarRight" alignItems="center">
          <Menu
            handler={
              <TouchRipple className="handler marginRight">
                {/* <Span className="menuTitle">
                  {language === "en" ? "EN" : "DE"}
                </Span> */}
                <ExpandMore fontSize="inherit" />
              </TouchRipple>
            }
          >
            {languageList.map((item) => (
              <MenuItem
                key={item.title}
                className="menuItem"
                onClick={handleLanguageClick(item.value)}
              >
                <Span className="menuTitle">{item.title}</Span>
              </MenuItem>
            ))}
          </Menu>

          <FlexBox alignItems="center" gap={1.5}>
            {socialLinks.map(({ id, Icon, url }) => (
              <Link href={url} key={id}>
                  <Icon
                    sx={{
                      fontSize: 16,
                    }}
                  />
              </Link>
            ))}
          </FlexBox>
        </FlexBox>
      </StyledContainer>
    </TopbarWrapper>
  );
};
const socialLinks = [
  {
    id: 1,
    Icon: Twitter,
    url: "#",
  },
  {
    id: 2,
    Icon: Facebook,
    url: "#",
  },
  {
    id: 3,
    Icon: Instagram,
    url: "#",
  },
];
const languageList = [
  {
    title: "EN",
    value: "en",
  },
  {
    title: "VI",
    value: "vi",
  },
];
export default memo(Topbar);
