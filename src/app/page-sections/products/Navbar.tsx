import React, { useCallback } from "react";
import { Apps, FilterList, ViewList } from "@mui/icons-material";
import {
  Box,
  Card,
  IconButton,
  MenuItem,
  TextField,
  useMediaQuery,
} from "@mui/material";
import Sidenav from "@/components/Sidenav";
import { FlexBox } from "@/components/flex-box";
import { H5, Paragraph } from "@/components/Typography";
import ProductFilterCard from "@/components/products/ProductFilterCard";

interface PageProps {
  params: { slug: string };
  setView: (view: any) => void;
  view: "grid" | "list" | string;
}
const ProductsNavbar = ({ params, setView, view }: PageProps) => {
  const downMd = useMediaQuery((theme: any) => theme.breakpoints.down("md"));
  const toggleView = useCallback((v: any) => () => setView(v), [setView]);
  return (
    <Card
      elevation={1}
      sx={{
        mb: "55px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        p: {
          sm: "1rem 1.25rem",
          md: "0.5rem 1.25rem",
          xs: "1.25rem 1.25rem 0.25rem",
        },
      }}
    >
      <Box>
        <H5>Searching for “ {params.slug} ”</H5>
        <Paragraph color="grey.600">48 results found</Paragraph>
      </Box>

      <FlexBox alignItems="center" columnGap={4} flexWrap="wrap" my="0.5rem">
        <FlexBox alignItems="center" gap={1} flex="1 1 0">
          <Paragraph color="grey.600" whiteSpace="pre">
            Short by:
          </Paragraph>

          <TextField
            select
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Short by"
            defaultValue={sortOptions[0].value}
            sx={{
              flex: "1 1 0",
              minWidth: "150px",
            }}
          >
            {sortOptions.map((item) => (
              <MenuItem value={item.value} key={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        </FlexBox>

        <FlexBox alignItems="center" my="0.25rem">
          <Paragraph color="grey.600" mr={1}>
            View:
          </Paragraph>

          <IconButton onClick={toggleView("grid")}>
            <Apps
              color={view === "grid" ? "primary" : "inherit"}
              fontSize="small"
            />
          </IconButton>

          <IconButton onClick={toggleView("list")}>
            <ViewList
              color={view === "list" ? "primary" : "inherit"}
              fontSize="small"
            />
          </IconButton>

          {/* SHOW IN THE SMALL DEVICE */}
          {downMd && (
            <Sidenav
              handle={
                <IconButton>
                  <FilterList fontSize="small" />
                </IconButton>
              }
            >
              <ProductFilterCard />
            </Sidenav>
          )}
        </FlexBox>
      </FlexBox>
    </Card>
  );
};

const sortOptions = [
  {
    label: "Relevance",
    value: "Relevance",
  },
  {
    label: "Date",
    value: "Date",
  },
  {
    label: "Price Low to High",
    value: "Price Low to High",
  },
  {
    label: "Price High to Low",
    value: "Price High to Low",
  },
];
export default React.memo(ProductsNavbar);
