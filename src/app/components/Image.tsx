import { compose, display, spacing, styled } from "@mui/system";
import { memo } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const CustomImage = styled(LazyLoadImage)(compose(spacing, display));

export default memo(CustomImage);
