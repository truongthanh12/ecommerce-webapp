import React from "react";
import TableRow from "@/components/TableRow";
import { FlexBox } from "@/components/flex-box";
import { Avatar, Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { capitalizeStr, currency, formatToSlug } from "@/utils/lib";
import { H6 } from "@/components/Typography";
import Card from "@/components/Card";
import { IOrder } from "@/models/Order";

const OrderedProductList = ({
  order,
  formattedDate,
  futureDate,
  params,
}: {
  order: Partial<IOrder>;
  formattedDate: string;
  futureDate?: string;
  params: { id: string };
}) => {
  return (
    <Card
      sx={{
        p: 0,
        mb: "30px",
      }}
    >
      <TableRow
        sx={{
          p: "12px",
          borderRadius: 0,
          boxShadow: "none",
          bgcolor: "grey.200",
        }}
      >
        <FlexBox className="pre" m={0.75} alignItems="center">
          <Typography fontSize={14} color="grey.600" mr={0.5}>
            Order ID:
          </Typography>

          <Typography fontSize={14}>
            #{params.id || (Math.random() * 9999997).toFixed(0)}
          </Typography>
        </FlexBox>

        <FlexBox className="pre" m={0.75} alignItems="center">
          <Typography fontSize={14} color="grey.600" mr={0.5}>
            Placed on:
          </Typography>

          <Typography fontSize={14}>{formattedDate}</Typography>
        </FlexBox>
        {futureDate && order.status !== "cancelled" ? (
          <FlexBox className="pre" m={0.75} alignItems="center">
            <Typography fontSize={14} color="grey.600" mr={0.5}>
              Delivered on:
            </Typography>

            <Typography fontSize={14}>{futureDate}</Typography>
          </FlexBox>
        ) : (
          <FlexBox className="pre" m={0.75} alignItems="center">
            Status:
            <Typography fontSize={14} color="primary" ml={0.5} mr={0.5}>
              {capitalizeStr(order.status)}
            </Typography>
          </FlexBox>
        )}
      </TableRow>

      <Box py={1}>
        {order?.cartList?.map((item: any, ind: number) => (
          <FlexBox px={2} py={1} flexWrap="wrap" alignItems="center" key={ind}>
            <FlexBox flex="2 2 260px" m={0.75} alignItems="center">
              <Avatar
                alt={item.product.title}
                src={item.product.thumbnail}
                sx={{
                  height: 64,
                  width: 64,
                }}
              />
              <Box ml={2.5}>
                <H6 my="0px">{item.product.title}</H6>

                <Typography fontSize="14px" color="grey.600">
                  {currency(item.product.price)} x {item.quantity}
                </Typography>
              </Box>
            </FlexBox>

            <FlexBox flex="1 1 260px" m={0.75} alignItems="center">
              <Typography fontSize="14px" color="grey.600">
                Product properties: {item.product.color}, {item.product.size}
              </Typography>
            </FlexBox>

            <FlexBox flex="160px" m={0.75} alignItems="center">
              {order.status === "cancelled" ? (
                <a href={`mailto:${item.product.shop.email}`}>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{
                      my: 1.5,
                    }}
                  >
                    Contact Vendor
                  </Button>
                </a>
              ) : (
                <Link href={`/product/${formatToSlug(item.product.title)}`}>
                  <Button variant="text" color="primary">
                    <Typography fontSize="14px">Write a Review</Typography>
                  </Button>
                </Link>
              )}
            </FlexBox>
          </FlexBox>
        ))}
      </Box>
    </Card>
  );
};

export default React.memo(OrderedProductList);
