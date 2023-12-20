import { H3, H5, Paragraph } from "@/app/components/Typography";
import { currency } from "@/app/utils/lib";
import React from "react";
import { IUser } from "@/app/models/User";

const Info = ({ user }: { user: Partial<IUser> }) => {
  return (
    <>
      <H5 color="info.main" mb={0.5}>
        Good Morning, {user.displayName || user.email}!
      </H5>
      <Paragraph color="grey.600">
        Here's what happening with your store today!
      </Paragraph>

      <H3 mt={3}>15,350.25</H3>
      <Paragraph color="grey.600">Today's Visit</Paragraph>

      <H3 mt={1.5}>{currency(10360.66)}</H3>
      <Paragraph color="grey.600">Today's total sales</Paragraph>
    </>
  );
};

export default Info;
