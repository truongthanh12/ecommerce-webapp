import Link from "next/link";
import { East } from "@mui/icons-material";
import { Box, Chip, IconButton, Typography } from "@mui/material";
import TableRow from "@/components/TableRow";
import { H5 } from "@/components/Typography";
import { capitalizeStr, currency, tryFormatDate } from "@/utils/lib";
import { IOrder } from "@/models/Order";
import { useParams } from "next/navigation";
// =================================================

const OrderRow = ({
  order,
  isSeller,
}: {
  order: IOrder;
  isSeller?: boolean;
}) => {
  const params = useParams()
  const getColor = (status: string) => {
    switch (status) {
      case "processing":
        return "secondary";
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "";
    }
  };

  const formattedDate = order?.createdAt ? tryFormatDate(order?.createdAt) : "";

  return (
    <Link href={`${isSeller ? "/vendor" : ""}/orders/${order.id}`} passHref>
      <TableRow
        sx={{
          my: "1rem",
          padding: "6px 18px",
        }}
      >
        <H5 m={0.75} textAlign="left">
          {(order.id ||"").split("-")[0].substring(0, 10)}
        </H5>

        <Box m={0.75}>
          <Chip
            size="small"
            label={capitalizeStr(order.status)}
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
            />
          </IconButton>
        </Typography>
      </TableRow>
    </Link>
  );
};
export default OrderRow;
