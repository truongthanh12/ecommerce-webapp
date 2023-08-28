import Link from "next/link";
import { Button, Container, styled } from "@mui/material";
import SEO from "@/components/SEO";
import Image from "@/components/Image";
import Card from "@/components/Card";
import { H1, Paragraph } from "@/components/Typography";
import React from "react";

// custom styled components
const Wrapper = styled(Card)({
  margin: "auto",
  padding: "3rem",
  maxWidth: "630px",
  textAlign: "center",
});
const StyledButton = styled(Button)({
  marginTop: "2rem",
  padding: "11px 24px",
});
const OrderConfirmation = () => {
  return (
    <>
      <SEO title="Order Confirmation" />

      <Container
        sx={{
          mt: 4,
          mb: 20,
        }}
      >
        <Wrapper>
          <Image
            width={116}
            height={116}
            alt="complete"
            src="/assets/images/illustrations/party-popper.svg"
          />
          <H1 lineHeight={1.1} mt="1.5rem">
            Your order is completed!
          </H1>

          <Paragraph color="grey.800" mt="0.3rem">
            You will be receiving confirmation email with order details.
          </Paragraph>

          <Link href="/market-1" passHref>
            <StyledButton
              color="primary"
              disableElevation
              variant="contained"
              className="button-link"
            >
              Browse products
            </StyledButton>
          </Link>
        </Wrapper>
      </Container>
    </>
  );
};
export default React.memo(OrderConfirmation);
