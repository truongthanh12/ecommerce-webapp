import React, { useCallback, useState } from "react";
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
import { objectToQueryString } from "@/utils/lib";
import { useParams, useRouter } from "next/navigation";

const sortOptions = [
  {
    label: "Default",
    value: "Default",
  },
  {
    label: "Rating",
    value: "Rating",
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

interface PageProps {
  setView: (view: any) => void;
  view: "grid" | "list" | string;
  productsLength: number;
}
const ProductsNavbar = ({
  setView,
  view,
  productsLength,
}: PageProps) => {
  const downMd = useMediaQuery((theme: any) => theme.breakpoints.down("md"));
  const toggleView = useCallback((v: any) => () => setView(v), [setView]);
  const searchParams = useParams()
  const { query, orderBy, category, subcategory } = searchParams || {};
  const [selectedValue, setSelectedValue] = useState(
    orderBy || sortOptions[0].value
  );
  const router = useRouter();

  const handleSortChange = (event: any) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);

    let updatedQuery: any = { ...searchParams };

    if (newValue !== sortOptions[0].value) {
      updatedQuery.orderBy = newValue;
    } else {
      delete updatedQuery.orderBy;
    }

    // Serialize the updated query object into a query string
    router.push(`?${objectToQueryString(updatedQuery)}`);
  };

  const showFilter =
    query || category || subcategory ? (
      <Box>
        {query && <H5>Searching for “ {query} ”</H5>}
        {category && <H5>Searching for “ {category} ”</H5>}
        {subcategory && <H5>Searching for “ {subcategory} ”</H5>}
        <Paragraph color="grey.600">{productsLength} results found</Paragraph>
      </Box>
    ) : (
      "Filter"
    );

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
      {showFilter}

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
            value={selectedValue}
            onChange={handleSortChange}
            sx={{
              flex: "1 1 0",
              minWidth: "150px",
            }}
          >
            {sortOptions.map((item) => (
              <MenuItem key={item.value} value={item.value}>
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

export default React.memo(ProductsNavbar);
