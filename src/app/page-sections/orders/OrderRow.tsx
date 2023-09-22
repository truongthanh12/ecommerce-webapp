import Link from "next/link";
import { format } from "date-fns";
import { East } from "@mui/icons-material";
import { Box, Chip, IconButton, Typography } from "@mui/material";
import TableRow from "@/components/TableRow";
import { H5 } from "@/components/Typography";
import { currency, tryFormatDate } from "@/utils/lib";
// =================================================

const OrderRow = ({ order }: any) => {
  console.log(order);
  const getColor = (status: "Pending" | "Delivered" | "Cancelled") => {
    switch (status) {
      case "Pending":
        return "secondary";
      case "Delivered":
        return "success";
      case "Cancelled":
        return "error";
      default:
        return "";
    }
  };

  const formattedDate = order?.createdAt ? tryFormatDate(order?.createdAt) : "";

  return (
    <Link href={`/orders/${order.id}`} passHref>
      <TableRow
        sx={{
          my: "1rem",
          padding: "6px 18px",
        }}
      >
        <H5 m={0.75} textAlign="left">
          {order.id.split("-")[0].substring(0, 10)}
        </H5>

        <Box m={0.75}>
          <Chip
            size="small"
            label={order.status}
            sx={{
              p: "0.25rem 0.5rem",
              fontSize: 12,
              color: !!getColor(order.status)
                ? `${getColor(order.status)}.900`
                : "inherit",
              backgroundColor: !!getColor(order.status)
                ? `${getColor(order.status)}.100`
                : "none",
            }}
          />
        </Box>

        <Typography className="pre" m={0.75} textAlign="left">
          {formattedDate}
        </Typography>

        <Typography m={0.75} textAlign="left">
          {currency(order.total)}
        </Typography>

        <Typography
          color="grey.600"
          textAlign="center"
          sx={{
            flex: "0 0 0 !important",
            display: {
              xs: "none",
              md: "block",
            },
          }}
        >
          <IconButton>
            <East
              fontSize="small"
              color="inherit"
              sx={{
                transform: `rotate("0deg")`,
              }}
            />
          </IconButton>
        </Typography>
      </TableRow>
    </Link>
  );
};
export default OrderRow;
