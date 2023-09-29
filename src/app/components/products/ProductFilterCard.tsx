import {
  Box,
  Card,
  Checkbox,
  Divider,
  FormControlLabel,
  Rating,
  TextField,
} from "@mui/material";
import { FlexBetween, FlexBox } from "@/components/flex-box";
import { H5, H6, Span } from "@/components/Typography";
import React, { useEffect, useMemo, useState } from "react";
import { currency, objectToQueryString } from "@/app/utils/lib";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";
import { useSelector } from "react-redux";
import { IBrand } from "@/app/models/Brand";
import { colors } from "@/app/data/data";

type TypeProps = {
  searchParams: { [key: string]: string | undefined };
};
const ProductFilterCard = ({ searchParams }: TypeProps) => {
  const { minPrice, maxPrice, brand, options, ratings, color } =
    searchParams || {};
  const { brands } = useSelector((state: any) => state.brands);
  const router = useRouter();

  const arrayOfStringBrands = useMemo(() => {
    if (brand) {
      return brand.split(",");
    }
  }, [brand]);

  const arrayOfStringOptions = useMemo(() => {
    if (options) {
      return options.split(",");
    }
  }, [options]);

  const arrayOfStringRating = useMemo(() => {
    if (ratings) {
      return ratings.split(",");
    }
  }, [ratings]);

  const [formValues, setFormValues] = useState({
    minPrice: Number(minPrice) || 0,
    maxPrice: Number(maxPrice) || 0,
  });
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number[]>([]);
  const [selectedColor, setSelectedColor] = useState(color || "");

  const handleChangeColor = (colorName: string) => {
    let updatedQuery: any = { ...searchParams };

    if (selectedColor === colorName) {
      setSelectedColor("");
      delete updatedQuery.color;
    } else {
      setSelectedColor(colorName);
      updatedQuery.color = colorName;
    }

    const debouncedFunction = debounce(() => {
      router.push(`?${objectToQueryString(updatedQuery)}`);
    }, 400);

    debouncedFunction();
  };

  const handleChangePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (value.length < 10) {
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
    if (
      formValues.minPrice !== undefined &&
      formValues.maxPrice !== undefined
    ) {
      const debouncedFunction = debounce(() => {
        let updatedQuery: any = { ...searchParams };

        if (value) {
          updatedQuery[name] = value;
        } else {
          delete updatedQuery[name];
        }

        // Serialize the updated query object into a query string
        router.push(`?${objectToQueryString(updatedQuery)}`);
      }, 50);

      // Call the debounced function
      debouncedFunction();
    }
  };

  // Define the change handler for brands
  const handleChangeBrands = (event: React.ChangeEvent<HTMLInputElement>) => {
    const brandName = event.target.name;

    setSelectedBrands((prevSelectedBrands) => {
      if (event.target.checked) {
        return [...prevSelectedBrands, brandName];
      } else {
        return prevSelectedBrands.filter((brand) => brand !== brandName);
      }
    });
  };

  // Define the change handler for options
  const handleChangeOptions = (event: React.ChangeEvent<HTMLInputElement>) => {
    const optiopnName = event.target.name;

    setSelectedOptions((prevSelectedOptions) => {
      if (event.target.checked) {
        return [...prevSelectedOptions, optiopnName];
      } else {
        return prevSelectedOptions.filter((option) => option !== optiopnName);
      }
    });
  };
  // Define the change handler for rating
  const handleChangeRating = (event: React.ChangeEvent<HTMLInputElement>) => {
    const ratings = Number(event.target.name);

    setSelectedRating((prevSelectedRating) => {
      if (event.target.checked) {
        return [...prevSelectedRating, ratings];
      } else {
        return prevSelectedRating.filter((rating) => rating !== ratings);
      }
    });
  };

  useEffect(() => {
    if (arrayOfStringBrands && arrayOfStringBrands.length > 0) {
      setSelectedBrands(arrayOfStringBrands);
    }
    if (arrayOfStringOptions && arrayOfStringOptions.length > 0) {
      setSelectedOptions(arrayOfStringOptions);
    }
    if (arrayOfStringRating && arrayOfStringRating.length > 0) {
      setSelectedOptions(arrayOfStringRating);
    }
  }, [arrayOfStringRating, arrayOfStringOptions, arrayOfStringBrands]);

  useEffect(
    debounce(() => {
      let updatedQuery: any = { ...searchParams };

      if (selectedBrands.length !== 0) {
        updatedQuery.brand = selectedBrands;
      } else {
        delete updatedQuery.brand;
      }

      router.push(`?${objectToQueryString(updatedQuery, true)}`);
    }, 400),
    [selectedBrands]
  );

  useEffect(
    debounce(() => {
      let updatedQuery: any = { ...searchParams };

      if (selectedOptions.length !== 0) {
        updatedQuery.options = selectedOptions;
      } else {
        delete updatedQuery.options;
      }

      router.push(`?${objectToQueryString(updatedQuery, true)}`);
    }, 400),
    [selectedOptions]
  );

  useEffect(
    debounce(() => {
      let updatedQuery: any = { ...searchParams };

      if (selectedRating.length !== 0) {
        updatedQuery.ratings = selectedRating;
      } else {
        delete updatedQuery.ratings;
      }

      router.push(`?${objectToQueryString(updatedQuery, true)}`);
    }, 400),
    [selectedRating]
  );

  return (
    <Card
      sx={{
        p: "18px 27px",
        overflow: "auto",
      }}
      elevation={1}
    >
      {/* PRICE VARIANT FILTER */}
      <H6 mb={2}>Price Range</H6>
      <FlexBetween>
        <div>
          <div>{currency(formValues.minPrice)}</div>
          <TextField
            name="minPrice"
            placeholder="0"
            type="number"
            size="small"
            fullWidth
            value={formValues.minPrice !== 0 ? formValues.minPrice : ""}
            onChange={handleChangePrice}
          />
        </div>
        <H5 color="grey.600" px={1}>
          -
        </H5>
        <div>
          <div>{currency(formValues.maxPrice)}</div>
          <TextField
            name="maxPrice"
            placeholder="2000000"
            type="number"
            size="small"
            fullWidth
            value={formValues.maxPrice !== 0 ? formValues.maxPrice : ""}
            onChange={handleChangePrice}
          />
        </div>
      </FlexBetween>

      <Divider
        sx={{
          my: 3,
        }}
      />

      {/* BRAND VARIANT FILTER */}
      <H6 mb={2}>Brands</H6>
      {brands.map((item: IBrand) => (
        <FormControlLabel
          key={item.id}
          sx={{
            display: "flex",
          }}
          label={<Span color="inherit">{item.name}</Span>}
          control={
            <Checkbox
              name={item.name}
              checked={selectedBrands.includes(item.name)} // Check if the brand is selected
              onChange={handleChangeBrands}
              size="small"
              color="secondary"
            />
          }
        />
      ))}

      <Divider
        sx={{
          my: 3,
        }}
      />

      {otherOptions.map((item) => (
        <FormControlLabel
          key={item}
          sx={{
            display: "flex",
          }}
          label={<Span color="inherit">{item}</Span>}
          control={
            <Checkbox
              name={item}
              checked={selectedOptions.includes(item)}
              onChange={handleChangeOptions}
              size="small"
              color="secondary"
            />
          }
        />
      ))}

      <Divider
        sx={{
          my: 3,
        }}
      />

      {/* RATINGS FILTER */}
      <H6 mb={2}>Ratings</H6>
      {[5, 4, 3, 2, 1].map((item) => (
        <FormControlLabel
          control={
            <Checkbox
              disabled
              size="small"
              name={String(item)}
              checked={selectedRating.includes(item)}
              onChange={handleChangeRating}
              color="secondary"
            />
          }
          label={<Rating size="small" value={item} color="warn" readOnly />}
          sx={{
            display: "flex",
          }}
          key={item}
        />
      ))}

      <Divider
        sx={{
          my: 3,
        }}
      />

      {/* COLORS VARIANT FILTER */}
      <H6 mb={2}>Colors</H6>
      <FlexBox mb={2} flexWrap="wrap" gap={1}>
        {colors.map((item) => (
          <Box
            className={`css-color ${
              selectedColor === item.name ? "css-color-active" : ""
            }`}
            key={item.id}
            flexShrink={0}
            sx={{
              width: 25,
              height: 25,
              bgcolor: item.color,
              cursor: "pointer",
              borderRadius: "50%",
              boxShadow: "2px 2px 2px 2px #cecece",
            }}
            onClick={() => handleChangeColor(item.name)}
          />
        ))}
      </FlexBox>
    </Card>
  );
};

const otherOptions = ["On Sale", "In Stock"];
export default React.memo(ProductFilterCard);
