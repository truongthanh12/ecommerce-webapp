import { Box } from "@mui/material";
import React from "react";
import Image from "../Image";

const NotFound = () => {
  return (
    <Box>
      <Image
        src='/assets/images/illustrations/404.svg'
        sx={{
          display: "block",
          width: "100%",
          marginLeft: "auto",
          marginRight: "auto",
          my: 3,
        }}
        alt="404-Not-Found"
      />
    </Box>
  );
};

export default React.memo(NotFound);
