import React, { Suspense, useEffect, useState } from "react";
import { Button, Card, Grid } from "@mui/material";
import DropZone from "@/components/DropZone";
import { FlexBox } from "@/components/flex-box";
import Image from "@/components/Image";
import { UploadImageBox, StyledClear } from "@/page-sections/admin/styles";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "@/redux/features/messageSlice";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase";
import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/navigation";
import { ErrorMessage, schema } from "./styles";
import { fetchCategories } from "@/redux/features/categorySlice";
import { fetchBrands } from "@/redux/features/brandSlice";
import FiledItem from "./Item";
import { colors, sizes, types } from "@/app/data/data";
import {
  addProductSync,
  productDataForm,
  updateProductAsync,
} from "@/redux/features/productSlice";
import { IProducts } from "@/app/models/Product";
import { currency } from "@/app/utils/lib";
// ================================================================

const ProductForm = ({ id = "", product }: { id?: string; product?: any }) => {
  const [files, setFiles] = useState<any>([]);
  const [filesUpdate, setFilesUpdate] = useState<any>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch: any = useDispatch();

  const { loading } = useSelector((state: any) => state.products);
  const { user } = useSelector((state: any) => state.auth);
  const { status } = useSelector((state: any) => state.statusAdmin);
  const { categories } = useSelector((state: any) => state.categories);
  const { brands } = useSelector((state: any) => state.brands);
  const router = useRouter();

  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, isValid },
  } = useForm<any>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, [dispatch]);

  useEffect(() => {
    if (product) {
      reset({
        description: product.description || "",
        title: product.title || "",
        type: product.type || "",
        categories: product.categories || [],
        price: product.price || 0,
        colors: product.colors || [],
        sizes: product.sizes || [],
        brands: product.brands || "",
        discount: product.discount || 0,
        images: product.images || [],
        indexOfImages: product.indexOfImages || 1,
        stock: product.stock || 0,
        published: product.published || false,
      });
    }
  }, [product, reset]);

  useEffect(() => {
    if (!isEmpty(product?.images)) {
      setFilesUpdate(product?.images);
    }
  }, [product?.images]);

  // HANDLE UPDATE NEW IMAGE VIA DROP ZONE
  const handleChangeDropZone = (files: any) => {
    files.forEach((file: any) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFiles(files);
    setFilesUpdate(files);
  };

  // HANDLE DELETE UPLOAD IMAGE
  const handleFileDelete = (file: any) => () => {
    setFiles((files: any) =>
      files.filter((item: any) => item.name !== file.name)
    );
  };

  const handleFileDeleteByUpdate = (fileParams: any) => () => {
    if (!isEmpty(filesUpdate)) {
      setFilesUpdate(filesUpdate.filter((file: any) => file !== fileParams));
    }
  };

  const handleProductForm = async (value: Partial<IProducts>) => {
    const {
      title,
      description,
      type,
      indexOfImages,
      sizes,
      brands,
      colors,
      price,
      categories,
      discount,
      stock,
    } = value || {};

    try {
      const uploadPromises = files.map((imageUpload: any, index: number) => {
        const storageRef = ref(
          storage,
          `products/${index}_${imageUpload.name}`
        );
        return uploadBytes(storageRef, imageUpload);
      });

      // Wait for all uploads to complete
      const uploadSnapshots = await Promise.all(uploadPromises);

      const downloadUrls = await Promise.all(
        uploadSnapshots.map((snapshot: any) => getDownloadURL(snapshot.ref))
      );

      // Save the download URLs or perform any other action
      const data = {
        description: description || product?.description || "",
        thumbnail:
          downloadUrls[(indexOfImages || 0) - 1 || 0] ||
          product?.images[(indexOfImages || 0) - 1 || 0] ||
          "",
        title: title || product?.title || "",
        type: type || product?.type || "",
        categories: categories || product?.categories || "",
        price: price || product?.price || 0,
        colors: colors || product?.colors || [],
        sizes: sizes || product?.sizes || [],
        brands: brands || product?.brands || "",
        discount: discount || product?.discount || 0,
        images:
          status === "create"
            ? !isEmpty(downloadUrls)
              ? downloadUrls
              : product?.images || []
            : !isEmpty(filesUpdate)
            ? filesUpdate
            : product?.images,
        indexOfImages: indexOfImages || product?.indexOfImages,
        stock: stock || product?.stock,
        published: product?.published || false,
      };

      if (status === "create") {
        const resultAction = await dispatch(
          addProductSync(productDataForm(data, user))
        );
        if (addProductSync.rejected.match(resultAction)) {
          const errorPayload = resultAction.payload;
          setErrorMessage("Product cannot created");
          dispatch(
            setMessage({
              message: `Product cannot created: ${errorPayload}`,
              type: "error",
            })
          );
          router.push("/vendor/products");
        } else {
          dispatch(
            setMessage({
              message: "Product created successfully",
              type: "success",
            })
          );
        }
        return;
      }
      if (status === "edit") {
        const resultAction = await dispatch(
          updateProductAsync({
            updatedProduct: productDataForm(data, user),
            id,
          })
        );
        if (addProductSync.rejected.match(resultAction)) {
          const errorPayload = resultAction.payload;
          setErrorMessage("Product cannot created");
          dispatch(
            setMessage({
              message: `Product cannot updated: ${errorPayload}`,
              type: "error",
            })
          );
          router.push("/vendor/products");
        } else {
          dispatch(
            setMessage({
              message: "Product updated successfully",
              type: "success",
            })
          );
        }
      }
    } catch (error) {
      console.error("Fail, please try again!", error);
    }
  };

  return (
    <Card
      sx={{
        p: 6,
      }}
    >
      <Suspense fallback="Loading...">
        <form onSubmit={handleSubmit(handleProductForm)}>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <Controller
                name="title"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <FiledItem
                    value={value || ""}
                    error={error}
                    label="Title"
                    name="Product title..."
                    onChange={onChange}
                    autoFocus={status === "create"}
                  />
                )}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Controller
                name="price"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <FiledItem
                    value={value || ""}
                    error={error}
                    label={`Price ${value ? currency(value || 0) : ""}`}
                    name="Price..."
                    onChange={onChange}
                    type="number"
                  />
                )}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <Controller
                name="stock"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <FiledItem
                    value={value || ""}
                    error={error}
                    label="Stock"
                    name="Stock..."
                    onChange={onChange}
                    type="number"
                  />
                )}
              />
            </Grid>

            <Grid item sm={6} xs={12}>
              <Controller
                name="categories"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <FiledItem
                    value={value || []}
                    data={categories}
                    error={error}
                    label="Select Category"
                    name="Category"
                    onChange={onChange}
                    isSelect
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <DropZone
                title="Drop & drag maximum 4 products image list"
                onChange={handleChangeDropZone}
              />

              <FlexBox flexDirection="row" mt={2} flexWrap="wrap" gap={1}>
                {(files || product?.images).map((file: any, index: number) => {
                  return (
                    <UploadImageBox size="small" key={index}>
                      <Image alt="Image uploaded" src={file.preview || file} width="100%" />
                      <StyledClear onClick={handleFileDelete(file)} />
                    </UploadImageBox>
                  );
                })}
                {isEmpty(files) &&
                  filesUpdate &&
                  filesUpdate.map((file: any, index: number) => {
                    return (
                      <UploadImageBox size="small" key={index}>
                        <Image alt="Image uploaded" src={file || ""} width="100%" />
                        <StyledClear onClick={handleFileDeleteByUpdate(file)} />
                      </UploadImageBox>
                    );
                  })}
              </FlexBox>
            </Grid>

            <Grid item md={6} xs={12}>
              <Controller
                name="discount"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FiledItem
                    value={value || ""}
                    label={`Discount ${value ? value + "%" : ""}`}
                    name="%"
                    onChange={onChange}
                    type="number"
                  />
                )}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <Controller
                name="indexOfImages"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FiledItem
                    value={value || ""}
                    label="Show thumbnail by index of images"
                    name="Select index thumbnail"
                    onChange={onChange}
                    type="number"
                    isSelect
                    disabled={!filesUpdate}
                    data={Array.from(
                      { length: filesUpdate.length },
                      (_, index) => index + 1
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <Controller
                name="brands"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <FiledItem
                    value={value || []}
                    data={brands}
                    error={error}
                    label="Select brand"
                    name="Brands"
                    onChange={onChange}
                    isSelect
                  />
                )}
              />
            </Grid>

            <Grid item sm={6} xs={12}>
              <Controller
                name="sizes"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FiledItem
                    value={value || []}
                    data={sizes}
                    // error={error}
                    label="Select size"
                    isMultiple
                    name="Sizes"
                    onChange={onChange}
                    isSelect
                  />
                )}
              />
            </Grid>

            <Grid item sm={6} xs={12}>
              <Controller
                name="colors"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <FiledItem
                    value={value || []}
                    data={colors}
                    error={error}
                    label="Select color"
                    isMultiple
                    name="colors"
                    onChange={onChange}
                    isSelect
                  />
                )}
              />
            </Grid>

            <Grid item sm={6} xs={12}>
              <Controller
                name="type"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <FiledItem
                    value={value || []}
                    data={types}
                    error={error}
                    label="Select type"
                    name="Types"
                    onChange={onChange}
                    isSelect
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FiledItem
                    value={value || ""}
                    label="Description"
                    name="Description..."
                    onChange={onChange}
                    rows={4}
                    multiline
                  />
                )}
              />
            </Grid>

            {isDirty && isValid && errorMessage && (
              <ErrorMessage>{errorMessage}</ErrorMessage>
            )}

            <Grid justifyContent="flex-end" container item xs={12}>
              <Button
                variant="contained"
                color="info"
                type="submit"
                disabled={loading}
              >
                Save product
              </Button>
            </Grid>
          </Grid>
        </form>
      </Suspense>
    </Card>
  );
};

export default React.memo(ProductForm);
