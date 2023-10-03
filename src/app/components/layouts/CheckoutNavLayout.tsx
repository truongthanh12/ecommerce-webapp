"use client";
import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Box, Container, Grid } from "@mui/material";
import Stepper from "@/components/Stepper";
import { useSelector } from "react-redux";
import { selectCartItemsForUser } from "@/redux/features/cartSlice";
import isEmpty from "lodash/isEmpty";
import { RootState } from "@/redux/store";

// ======================================================

const stepperList = [
  {
    title: "Cart",
    disabled: false,
  },
  {
    title: "Payment",
    disabled: false,
  },
  {
    title: "Review",
    disabled: true,
  },
];
const CheckoutNavLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const userCartItems = useSelector(selectCartItemsForUser(user.docId));
  const updatedStepper = useMemo(
    () =>
      stepperList.map((step) => {
        if (step.title === "Details" || step.title === "Payment") {
          return {
            ...step,
            disabled: isEmpty(userCartItems), // Disable if userCartItems is falsy
          };
        }
        return step;
      }),
    [userCartItems]
  );

  const [selectedStep, setSelectedStep] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const handleStepChange = (step: string | number) => {
    switch (step) {
      case 0:
        router.push("/cart");
        break;
      case 1:
        router.push("/checkout");
        break;
      case 2:
        router.push("/orders");
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    switch (pathname) {
      case "/cart":
        setSelectedStep(1);
        break;
      case "/checkout":
        setSelectedStep(2);
        break;
      default:
        break;
    }
  }, [pathname]);

  return (
    <Container
      sx={{
        my: 4,
      }}
    >
      <Box
        mb={3}
        display={{
          sm: "block",
          xs: "none",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stepper
              stepperList={updatedStepper}
              selectedStep={selectedStep}
              onChange={handleStepChange}
            />
          </Grid>
        </Grid>
      </Box>

      {children}
    </Container>
  );
};

export default React.memo(CheckoutNavLayout);
