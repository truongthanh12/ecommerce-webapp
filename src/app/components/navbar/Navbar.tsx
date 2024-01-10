"use client";
import { Box, Button, Container, MenuItem, styled } from "@mui/material";
import ArrowRight from "@mui/icons-material/ArrowRight";
import { ChevronRight, KeyboardArrowDown } from "@mui/icons-material";
import { NavLink } from "@/components/nav-link";
import { FlexBox } from "@/components/flex-box";
import Card from "@/components/Card";
import Category from "@/components/icons/Category";
import { Paragraph } from "@/components/Typography";
import CategoryMenu from "@/components/categories/CategoryMenu";
import MegaMenu from "@/components/categories/MegaMenu";
import navbarNavigations from "@/data/navbarNavigations";
import { useParams } from "next/navigation";
import first from "lodash/first";

// const common css style
const navLinkStyle = {
  cursor: "pointer",
  transition: "color 150ms ease-in-out",
  "&:hover": {
    color: "primary.main",
  },
  "&:last-child": {
    marginRight: 0,
  },
};
// style components
const StyledNavLink = styled(NavLink)({
  ...navLinkStyle,
});
const ParentNav = styled(Box)(({ theme }) => ({
  "&:hover": {
    color: theme.palette.primary.main,
    "& > .parent-nav-item": {
      display: "block",
    },
  },
}));
const ParentNavItem = styled(Box)(({ theme }) => ({
  top: 0,
  zIndex: 5,
  left: "100%",
  paddingLeft: 8,
  display: "none",
  position: "absolute",
  [theme.breakpoints.down(1640)]: {
    right: "100%",
    left: "auto",
    paddingRight: 8,
  },
}));
const NavBarWrapper = styled(Card)(({ theme, border }: any) => ({
  height: "60px",
  display: "block",
  borderRadius: "0px",
  position: "relative",
  ...(border && {
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
  }),
  [theme.breakpoints.down(1150)]: {
    display: "none",
  },
}));
const InnerContainer = styled(Container)({
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});
const CategoryMenuButton = styled(Button)(({ theme }) => ({
  width: "278px",
  height: "40px",
  backgroundColor: theme.palette.grey[100],
  position: "relative",
}));
const ChildNavsWrapper = styled(Box)({
  zIndex: 5,
  left: "50%",
  top: "100%",
  display: "none",
  position: "absolute",
  transform: "translate(-50%, 0%)",
});

// ==========================================================
type TypeNavbar = {
  navListOpen?: boolean;
  elevation?: number;
};
const Navbar: React.FC<TypeNavbar> = ({ navListOpen, elevation }) => {
  type TypeProps = {
    list: any;
    isRoot?: boolean;
  };
  const params = useParams()
  const lang = ((Array.isArray(params.lang)
    ? first(params.lang)
    : params.lang) || "en") as "en" | "vi";
  const renderNestedNav = ({ list = [], isRoot = false }: TypeProps) => {
    return list[lang].map((nav: any) => {
      if (isRoot) {
        if (nav.megaMenu2) {
          return <MegaMenu key={nav.title} data={nav.child} />;
        }

        if (nav.url) {
          return (
            <StyledNavLink href={`/${lang}${nav.url}`} key={nav.title}>
              {nav.title}
            </StyledNavLink>
          );
        }
        if (nav.child) {
          return (
            <FlexBox
              key={nav.title}
              alignItems="center"
              position="relative"
              flexDirection="column"
              sx={{
                "&:hover": {
                  "& > .child-nav-item": {
                    display: "block",
                  },
                },
              }}
            >
              <FlexBox alignItems="flex-end" gap={0.3} sx={navLinkStyle}>
                {nav.title}
                <KeyboardArrowDown
                  sx={{
                    color: "grey.500",
                    fontSize: "1.1rem",
                  }}
                />
              </FlexBox>

              <ChildNavsWrapper className="child-nav-item">
                <Card
                  elevation={3}
                  sx={{
                    mt: 2.5,
                    py: 1,
                    minWidth: 200,
                  }}
                >
                  {renderNestedNav({ list: nav.child })}
                </Card>
              </ChildNavsWrapper>
            </FlexBox>
          );
        }
      } else {
        if (nav.url) {
          return (
            <NavLink href={`${lang}/${nav.url}`} key={nav.title}>
              <MenuItem>{nav.title}</MenuItem>
            </NavLink>
          );
        }
        if (nav.child) {
          return (
            <ParentNav position="relative" minWidth="230px" key={nav.title}>
              <MenuItem color="grey.700">
                <Box flex="1 1 0" component="span">
                  {nav.title}
                </Box>

                <ArrowRight fontSize="small" />
              </MenuItem>

              <ParentNavItem className="parent-nav-item">
                <Card
                  sx={{
                    py: "0.5rem",
                    minWidth: "230px",
                  }}
                  elevation={3}
                >
                  {renderNestedNav({ list: nav.child })}
                </Card>
              </ParentNavItem>
            </ParentNav>
          );
        }
      }
    });
  };
  return (
    <NavBarWrapper hoverEffect={false} elevation={elevation}>
      <InnerContainer>
        {/* Category megamenu */}
        <CategoryMenu open={navListOpen || false}>
          <CategoryMenuButton sx={{ height: "40px" }} variant="text">
            <Category fontSize="small" />
            <Paragraph
              fontWeight="600"
              textAlign="left"
              flex="1 1 0"
              ml={1.25}
              color="grey.600"
            >
              Categories
            </Paragraph>

            <ChevronRight className="dropdown-icon" fontSize="small" />
          </CategoryMenuButton>
        </CategoryMenu>

        {/* Horizontal menu */}
        <FlexBox gap={4}>
          {renderNestedNav({ list: navbarNavigations, isRoot: true })}
        </FlexBox>
      </InnerContainer>
    </NavBarWrapper>
  );
};

export default Navbar;
