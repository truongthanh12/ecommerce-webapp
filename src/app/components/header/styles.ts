import { layoutConstant } from "@/app/utils/constants";
import { Box, keyframes, styled } from "@mui/material";
import Container from "@mui/material/Container";

const slideFromTop = keyframes`
from { top: -${layoutConstant.headerHeight}px; }
to { top: 0; }`;

export const HeaderWrapper = styled(Box)(
  ({ theme, isfixed }: { theme?: any; isfixed: any }) => ({
    zIndex: 3,
    position: "relative",
    height: layoutConstant.headerHeight,
    transition: "height 250ms ease-in-out",
    background: theme.palette.background.paper,
    "&.fixedHeader": {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 99,
      background: "white",
      height: layoutConstant.headerHeight,
      boxShadow: theme.shadows[2],
      animation: `${slideFromTop} 250ms ease-in-out`,
      "& .link": {
        color: "inherit",
      },
    },
    "& + .section-after-sticky, & ~ .section-after-sticky": {
      paddingTop: isfixed === "fixed" ? 80 : 0,
    },
    [theme.breakpoints.down("sm")]: {
      height: layoutConstant.mobileHeaderHeight,
      "& + .section-after-sticky, & ~ .section-after-sticky": {
        paddingTop: isfixed === "fixed" ? 64 : 0,
      },
    },
  })
);
export const StyledContainer = styled(Container)({
  gap: 2,
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});
