import { CameraAlt } from "@mui/icons-material";
import { Button } from "@mui/material";
import React, { Fragment } from "react";

const UploadButton = ({
  id,
  style = {},
  onChange,
}: {
  id: string;
  style?: any;
  onChange: any;
}) => {
  return (
    <Fragment>
      <label htmlFor={id}>
        <Button
          size="small"
          component="span"
          color="secondary"
          sx={{
            p: "6px",
            height: "auto",
            borderRadius: "50%",
            bgcolor: "info.100",
            ...style,
            ":hover": {
              backgroundColor: "grey.300",
            },
          }}
        >
          <CameraAlt fontSize="small" color="info" />
        </Button>
      </label>

      <input
        onChange={onChange}
        id={id}
        type="file"
        accept="image/*"
        className="hidden"
        style={{
          display: "none",
        }}
      />
    </Fragment>
  );
};

export default React.memo(UploadButton);
