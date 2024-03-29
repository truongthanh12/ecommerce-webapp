import { Close } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { IProducts } from "@/models/Product";
import { ContentWrapperView } from "./styles";
import ProductIntro from "./ProductIntro";
import { useEffect, useState } from "react";
import { getCommentsByProductId } from "@/redux/features/productSlice";

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
  const downXs = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));
  const downMd = useMediaQuery((theme: any) => theme.breakpoints.down("md"));
  const downLg = useMediaQuery((theme: any) => theme.breakpoints.down("lg"));
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (product.id) {
      getCommentsByProductId(product.id)
        .then((res: any) => {
          setComments(res);
        })
        .catch((error: any) => {
          throw error;
        });
    }
  }, [product.id]);

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
          maxWidth: 1200,
          width: downXs ? 375 : downMd ? 600 : downLg ? 800 : 1200,
        }}
      >
        <ContentWrapperView>
          <ProductIntro comments={comments} product={product} searchParams={{}} />
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
