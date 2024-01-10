"use client";
import Link from "next/link";
import { Box, Button } from "@mui/material";
import SEO from "@/components/SEO";
import { FlexBox, FlexRowCenter } from "@/components/flex-box";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import NotFound from "@/components/not-found";

const Error404 = () => {
  const router = useRouter();
  const handleGoBack = () => router.back();
  const params = useParams();

  return (
    <FlexRowCenter px={2} minHeight="100vh" flexDirection="column">
      <SEO title="Nothing found" />
      <Box sx={{ maxWidth: "50%", mx: "auto" }}>
        <NotFound />
      </Box>

      <FlexBox flexWrap="wrap">
        <Button
          variant="outlined"
          color="primary"
          sx={{
            m: 1,
          }}
          onClick={handleGoBack}
        >
          Go Back
        </Button>

        <Link href={"/" + params.lang} passHref legacyBehavior>
          <Button
            variant="contained"
            color="primary"
            sx={{
              m: 1,
            }}
          >
            Go to Home
          </Button>
        </Link>
      </FlexBox>
    </FlexRowCenter>
  );
};
export default React.memo(Error404);
