import NextImage from "next/legacy/image";
import { Box, Card } from "@mui/material";
import React from "react";
import Info from "./Info";
import { IUser } from "@/app/models/User";
const WishCard = ({ user }: { user: Partial<IUser> }) => {
  return (
    <Card
      sx={{
        p: 3,
        height: "100%",
        display: "flex",
        position: "relative",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Info user={user} />
      <Box
        sx={{
          right: 24,
          bottom: 0,
          position: "absolute",
          display: {
            xs: "none",
            sm: "block",
          },
        }}
      >
        <NextImage
          src="/assets/images/illustrations/dashboard/welcome.svg"
          width={195}
          height={171}
          alt="Welcome"
        />
      </Box>
    </Card>
  );
};
export default React.memo(WishCard);
