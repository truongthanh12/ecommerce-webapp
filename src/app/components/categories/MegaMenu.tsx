import CardComp from "@/components/Card";
import React from "react";
import StyledMegaMenu from "./StyledMegaMenu";
import CategoryMenuItem from "./CategoryMenuItem";
import { FlexBox } from "../flex-box";
import { Box, Grid } from "@mui/material";
import { NavLink } from "../nav-link";

type TypeProps = {
  data: any;
};
const MegaMenu: React.FC<TypeProps> = ({ data }) => {
  return (
    <StyledMegaMenu>
      <CardComp
        elevation={2}
        sx={{
          ml: "1rem",
          py: "0.5rem",
        }}
      >
        {(data?.categories || data)?.map((item: any, ind: number) => (
          <CategoryMenuItem
            href={item.href}
            icon={item.icon}
            key={ind}
            title={item.title}
            caret={!!item.menuData}
          >
            {item.menuData && (
              <>
                {item?.categories ? (
                  <StyledMegaMenu>
                    <CardComp
                      sx={{
                        ml: "1rem",
                        minWidth: "560px",
                      }}
                      elevation={2}
                    >
                      <FlexBox px={2.5} py={1.75}>
                        <Box flex="1 1 0">
                          <Grid container spacing={4}>
                            {item?.categories?.map((item: any, ind: number) => (
                              <Grid item md={3} key={ind}>
                                {item.href ? (
                                  <NavLink
                                    className="title-link"
                                    href={item.href}
                                  >
                                    {item.title}
                                  </NavLink>
                                ) : (
                                  <Box className="title-link">{item.title}</Box>
                                )}
                                {item?.subCategories?.map(
                                  (sub: any, ind: number) => (
                                    <NavLink
                                      className="child-link"
                                      href={sub.href}
                                      key={ind}
                                    >
                                      {sub.title}
                                    </NavLink>
                                  )
                                )}
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      </FlexBox>
                    </CardComp>
                  </StyledMegaMenu>
                ) : null}
              </>
            )}
          </CategoryMenuItem>
        ))}
      </CardComp>
    </StyledMegaMenu>
  );
};
export default React.memo(MegaMenu);
