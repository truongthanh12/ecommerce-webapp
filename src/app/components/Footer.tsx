"use client";
import Link from "next/link";
import { Box, Container, Grid, IconButton, styled } from "@mui/material";
import { FlexBox } from "@/components/flex-box";
import { Paragraph } from "@/components/Typography";
import Google from "@/components/icons/Google";
import Twitter from "@/components/icons/Twitter";
import Youtube from "@/components/icons/Youtube";
import Facebook from "@/components/icons/Facebook";
import Instagram from "@/components/icons/Instagram";
import React from "react";
import Image from "next/legacy/image";
import { useParams } from "next/navigation";
import { Ilang } from "../models/Lang";

// styled component
const StyledLink = styled("footer")(({ theme }) => ({
  display: "block",
  borderRadius: 4,
  cursor: "pointer",
  position: "relative",
  padding: "0.3rem 0rem",
  color: theme.palette.grey[500],
  "&:hover": {
    color: theme.palette.grey[100],
  },
}));
const Footer = ({ dictionary }: { dictionary: Ilang }) => {
  const params = useParams();

  const aboutLinks = [
    dictionary.HOME.career,
    dictionary.HOME.store,
    dictionary.HOME.terms,
    dictionary.HOME.privacy,
  ];
  const customerCareLinks = [
    dictionary.HOME.help,
    dictionary.HOME.trackOrder,
    dictionary.HOME.contact,
  ];

  return (
    <footer>
      <Box bgcolor="#222935">
        <Container
          sx={{
            p: "1rem",
            color: "white",
          }}
        >
          <Box py={10} overflow="hidden">
            <Grid container spacing={3}>
              <Grid item lg={4} md={6} sm={6} xs={12}>
                <Link href={"/" + params.lang}>
                  <Image
                    width={205}
                    height={50}
                    style={{ marginBottom: "12px" }}
                    src="/assets/images/logo.png"
                    alt="logo taphoa"
                  />
                </Link>

                <Paragraph mb={2.5} color="grey.500">
                  {dictionary.HOME.footerDesc}
                </Paragraph>

                {/* <AppStore /> */}
              </Grid>

              <Grid item lg={2} md={6} sm={6} xs={12}>
                <Box
                  fontSize="18px"
                  fontWeight="600"
                  mb={1.5}
                  lineHeight="1"
                  color="white"
                >
                  {dictionary.HOME.contact}
                </Box>

                <div>
                  {aboutLinks.map((item, ind) => (
                    <Link href={"/" + params.lang} key={ind} passHref>
                      <StyledLink>{item}</StyledLink>
                    </Link>
                  ))}
                </div>
              </Grid>

              <Grid item lg={3} md={6} sm={6} xs={12}>
                <Box
                  fontSize="18px"
                  fontWeight="600"
                  mb={1.5}
                  lineHeight="1"
                  color="white"
                >
                  {dictionary.HOME.customerCare}
                </Box>

                <div>
                  {customerCareLinks.map((item, ind) => (
                    <Link href={"/" + params.lang} key={ind} passHref>
                      <StyledLink>{item}</StyledLink>
                    </Link>
                  ))}
                </div>
              </Grid>

              <Grid item lg={3} md={6} sm={6} xs={12}>
                <Box
                  fontSize="18px"
                  fontWeight="600"
                  mb={1.5}
                  lineHeight="1"
                  color="white"
                >
                  {dictionary.HOME.contact}
                </Box>

                <Box py={0.6} color="grey.500">
                  {dictionary.HOME.address}
                </Box>

                <Box py={0.6} color="grey.500">
                  Email: taphoa.help@gmail.com
                </Box>

                <Box py={0.6} mb={2} color="grey.500">
                  Phone: +1 1123 456 780
                </Box>

                <FlexBox className="flex" mx={-0.625}>
                  {iconList.map((item, ind) => (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer noopenner"
                      key={ind}
                    >
                      <IconButton
                        sx={{
                          margin: 0.5,
                          fontSize: 12,
                          padding: "10px",
                          backgroundColor: "rgba(0,0,0,0.2)",
                        }}
                      >
                        <item.icon
                          fontSize="inherit"
                          sx={{
                            color: "white",
                          }}
                        />
                      </IconButton>
                    </a>
                  ))}
                </FlexBox>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </footer>
  );
};

const iconList = [
  {
    icon: Facebook,
    url: "https://www.facebook.com/UILibOfficial",
  },
  {
    icon: Twitter,
    url: "https://twitter.com/uilibofficial",
  },
  {
    icon: Youtube,
    url: "https://www.youtube.com/channel/UCsIyD-TSO1wQFz-n2Y4i3Rg",
  },
  {
    icon: Google,
    url: "https://www.google.com/search?q=ui-lib.com",
  },
  {
    icon: Instagram,
    url: "https://www.instagram.com/uilibofficial/",
  },
];
export default React.memo(Footer);
