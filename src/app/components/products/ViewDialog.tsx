import { Add, Close, Remove } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
} from "@mui/material";
import { FlexBox } from "@/components/flex-box";
// import Image from "@/components/Image";
import Rating from "@/components/Rating";
import Carousel from "@/components/carousel/Carousel";
import { H1, H2, H3, H6, Paragraph } from "@/components/Typography";
import { calculateDiscount, currency } from "@/utils/lib";
import { IProducts } from "@/app/models/Product";
import Image from "../Image";
import { useState } from "react";
import { ContentWrapperView } from "./styles";

// =====================================================
interface TypeProps {
  product: Partial<IProducts>;
  openDialog: boolean;
  handleCloseDialog: () => void;
}
const ProductViewDialog = ({
  product,
  openDialog,
  handleCloseDialog,
}: TypeProps) => {
  const [qty, setQty] = useState(0);
  const handleCartAmountChange = (type: "add" | "minus") => () => {
    if (type === "add") {
      setQty(qty + 1);
      return;
    }
    if (qty === 0) return;
    setQty(qty - 1);
  };

  return (
    <Dialog
      open={openDialog}
      maxWidth={false}
      onClose={handleCloseDialog}
      sx={{
        zIndex: 1501,
      }}
    >
      <DialogContent
        sx={{
          maxWidth: 900,
          width: "100%",
        }}
      >
        <ContentWrapperView>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <Carousel visibleSlides={1}>
                {(product.images || []).map((item, index) => (
                  <Image
                    key={index}
                    src={item}
                    sx={{
                      mx: "auto",
                      width: "100%",
                      objectFit: "contain",
                      height: {
                        sm: 400,
                        xs: 250,
                      },
                    }}
                    alt={"image " + item}
                  />
                ))}
              </Carousel>
            </Grid>

            <Grid item md={6} xs={12} alignSelf="center">
              <H2>{product.title}</H2>

              <Paragraph py={1} color="grey.500" fontWeight={600} fontSize={13}>
                CATEGORY: Cosmetic
              </Paragraph>

              {product.discount ? (
                <Grid
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <H3 color="grey.600">
                    <del>{currency(product.price || 0)}</del>
                  </H3>
                  <H2 color="primary.main" pl={2}>
                    {calculateDiscount(product.price, product.discount)}
                  </H2>
                </Grid>
              ) : (
                ""
              )}

              <FlexBox alignItems="center" gap={1}>
                <Rating color="warn" fontSize="1.25rem" value={4} readOnly />
                <H6 lineHeight="1">(50)</H6>
              </FlexBox>

              <Paragraph my={2}>
                Sed egestas, ante et vulputate volutpat, eros pede semper est,
                vitae luctus metus libero eu augue. Morbi purus liberpuro ate
                vol faucibus adipiscing.
              </Paragraph>

              <Divider
                sx={{
                  mb: 2,
                }}
              />
              {!qty ? (
                <Button
                  size="large"
                  color="primary"
                  variant="contained"
                  onClick={handleCartAmountChange("add")}
                  sx={{
                    height: 45,
                  }}
                >
                  Add to Cart
                </Button>
              ) : (
                <FlexBox alignItems="center">
                  <Button
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{
                      p: ".6rem",
                      height: 45,
                    }}
                    onClick={handleCartAmountChange("minus")}
                  >
                    <Remove fontSize="small" />
                  </Button>

                  <H3 fontWeight="600" mx={2.5}>
                    {qty.toString().padStart(2, "0")}
                  </H3>

                  <Button
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{
                      p: ".6rem",
                      height: 45,
                    }}
                    onClick={handleCartAmountChange("add")}
                  >
                    <Add fontSize="small" />
                  </Button>
                </FlexBox>
              )}
            </Grid>
          </Grid>
        </ContentWrapperView>

        <IconButton
          sx={{
            position: "absolute",
            top: 3,
            right: 3,
          }}
          onClick={handleCloseDialog}
        >
          <Close fontSize="small" color="secondary" />
        </IconButton>
      </DialogContent>
    </Dialog>
  );
};
export default ProductViewDialog;
