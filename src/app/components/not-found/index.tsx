import { Box } from "@mui/material";
import React from "react";
import Image from "../Image";
import NotFoundImage from "../../../../public/assets/images/illustrations/404.svg";

const NotFound = () => {
  return (
    <Box>
      <Image
        src={NotFoundImage}
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
