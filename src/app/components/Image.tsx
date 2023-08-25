import { compose, display, spacing, styled } from "@mui/system";
import { memo } from "react";
const Image = styled("img")(compose(spacing, display));

export default memo(Image);
