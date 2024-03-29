import React, { Fragment, useState } from "react";
import { Clear, ExpandMore, Menu } from "@mui/icons-material";
import {
  Accordion,
  AccordionSummary,
  Box,
  Drawer,
  IconButton,
} from "@mui/material";
import { H6 } from "@/components/Typography";
import Scrollbar from "@/components/Scrollbar";
import { NavLink } from "@/components/nav-link";
import navbarNavigations from "@/data/navbarNavigations";
import { useParams } from "next/navigation";
import first from "lodash/first";

const MobileMenu = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const params = useParams();
  const lang = ((Array.isArray(params.lang)
    ? first(params.lang)
    : params.lang) || "vi") as "en" | "vi";

  // MODIFY THE NAVIGATION WITH NEW STRUCTURE
  const updateNavigations = navbarNavigations[lang].reduce(
    (prev: any, curr: any) => {
      const newArr: any = [...prev];

      if (!curr.child) {
        newArr.push({
          ...curr,
          extLink: true,
        });
      } else if (curr.megaMenu || curr.megaMenuWithSub) {
        const flated = curr.child.flat();
        newArr.push({
          title: curr.title,
          child: flated,
        });
      } else {
        newArr.push(curr);
      }

      return newArr;
    },
    []
  );

  const toggleOpenMenu = () => {
    setOpenDrawer(!openDrawer);
  };

  const renderLevels = (data: any) => {
    return data.map((item: any, index: any) => {
      if (item.child) {
        return (
          <Accordion
            square
            key={index}
            elevation={0}
            disableGutters
            sx={{
              "&:not(:last-child)": {
                borderBottom: 0,
              },
              "&:before": {
                display: "none",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                padding: 0,
                minHeight: 48,
                boxShadow: "none",
                "& .Mui-expanded": {
                  color: "primary.main",
                  margin: 0,
                },
                "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                  margin: 0,
                  "& .MuiSvgIcon-root": {
                    color: "primary.main",
                  },
                },
              }}
            >
              <H6>{item.title}</H6>
            </AccordionSummary>

            <Box mx={2}>{renderLevels(item.child)}</Box>
          </Accordion>
        );
      }
      if (item.extLink) {
        return (
          <H6 key={index} py={1}>
            <NavLink href={`/${lang}${item.url}`}>{item.title}</NavLink>
          </H6>
        );
      }
      return (
        <Box key={index} py={1}>
          <NavLink href={`/${lang}${item.url}`}>{item.title}</NavLink>
        </Box>
      );
    });
  };

  return (
    <Fragment>
      <IconButton
        onClick={toggleOpenMenu}
        sx={{
          flexShrink: 0,
          color: "grey.600",
        }}
      >
        <Menu />
      </IconButton>

      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={toggleOpenMenu}
        sx={{
          zIndex: 15001,
        }}
      >
        <Box
          sx={{
            width: "100vw",
            height: "100%",
            position: "relative",
          }}
        >
          <Scrollbar
            sx={{
              height: "100vh",
            }}
          >
            <Box
              maxWidth={500}
              margin="auto"
              position="relative"
              height="100%"
              px={5}
              py={8}
            >
              <IconButton
                onClick={() => setOpenDrawer(false)}
                sx={{
                  position: "absolute",
                  right: 30,
                  top: 15,
                }}
              >
                <Clear fontSize="small" />
              </IconButton>

              {renderLevels(updateNavigations)}
            </Box>
          </Scrollbar>
        </Box>
      </Drawer>
    </Fragment>
  );
};
export default React.memo(MobileMenu);
