"use client";
import { Button, Grid, styled } from "@mui/material";
import Image from "@/components/Image";
import { FlexBetween } from "@/components/flex-box";
import { Paragraph } from "@/components/Typography";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// styled component
const StyledBox = styled(FlexBetween)(({ theme }) => ({
  ".title": {
    fontSize: 50,
    marginTop: 0,
    lineHeight: 1.2,
    marginBottom: "1.35rem",
    color: "#2B3445",
  },
  [theme.breakpoints.up("sm")]: {
    ".grid-item": {
      minHeight: 424,
      display: "flex",
      alignItems: "baseline",
      flexDirection: "column",
      justifyContent: "center",
    },
  },
  [theme.breakpoints.down("sm")]: {
    marginLeft: 0,
    paddingLeft: 0,
    ".title": {
      fontSize: 32,
    },
  },
  [theme.breakpoints.down("xs")]: {
    ".title": {
      fontSize: 16,
    },
    ".title + *": {
      fontSize: 13,
    },
    ".button-link": {
      height: 36,
      padding: "0 1.5rem",
      fontSize: 13,
    },
  },
}));

// ==================================================

interface TypeCarouselCardProps {
  title?: string;
  imgUrl?: string;
  buttonLink?: string;
  buttonText?: string;
  description?: string;
  buttonColor?: "primary";
}
const CarouselCard = ({
  title,
  imgUrl,
  buttonLink,
  buttonText,
  description,
  buttonColor = "primary",
}: TypeCarouselCardProps) => {
  const params = useParams();
  return (
    <StyledBox>
      <Grid container spacing={3} alignItems="center" justifyContent="center">
        <Grid item className="grid-item" sm={5} xs={12}>
          <h1 className="title">{title}</h1>
          <Paragraph color="secondary.main" mb={2.7}>
            {description}
          </Paragraph>

          <Link href={`/${params.lang}/${buttonLink}`}>
            <Button
              size="large"
              color={buttonColor}
              disableElevation
              variant="contained"
              className="button-link"
              sx={{
                height: 44,
                borderRadius: "4px",
              }}
            >
              {buttonText}
            </Button>
          </Link>
        </Grid>

        <Grid item sm={5} xs={12}>
          <Image
            src={imgUrl}
            alt={title}
            sx={{
              mx: "auto",
              maxHeight: 400,
              display: "block",
              maxWidth: "100%",
            }}
          />
        </Grid>
      </Grid>
    </StyledBox>
  );
};
export default React.memo(CarouselCard);
