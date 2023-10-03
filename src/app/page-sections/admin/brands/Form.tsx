import React, { useEffect, useState } from "react";
import { Button, Card, Grid, TextField, styled } from "@mui/material";
import DropZone from "@/components/DropZone";
import { FlexBox } from "@/components/flex-box";
import Image from "@/components/Image";
import { UploadImageBox, StyledClear } from "../styles";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "@/redux/features/messageSlice";
import {
  addBrandSync,
  brandDataForm,
  updateBrandAsync,
} from "@/redux/features/brandSlice";
import { getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storageRef } from "@/firebase";
import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";

// ================================================================

export const ErrorMessage = styled("span")(() => ({
  display: "flex",
  justifyContent: "center",
  color: "red",
  marginBottom: "6px",
  width: "100%",
}));
const schema = yup.object().shape({
  Name: yup.string().required(),
  Type: yup.string().required(),
});

const BrandForm = ({ id = "", brand }: { id?: string; brand?: any }) => {
  const [files, setFiles] = useState<any>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch: any = useDispatch();
  const { error } = useSelector((state: RootState) => state.brands);
  const { user } = useSelector((state: RootState) => state.auth);
  const { status } = useSelector((state: RootState) => state.statusAdmin);
  const router = useRouter();

  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, isValid },
  } = useForm<any>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: { Name: "", Type: "" },
  });

  useEffect(() => {
    // Check if brandData has values
    if (brand) {
      // Set the default values for the form fields
      reset({
        Name: brand.name,
        Type: brand.type,
      });
    }
  }, [brand]);

  // HANDLE UPDATE NEW IMAGE VIA DROP ZONE
  const handleChangeDropZone = (files: any) => {
    files.forEach((file: any) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFiles(files);
  };

  // HANDLE DELETE UPLOAD IMAGE
  const handleFileDelete = (file: any) => () => {
    setFiles((files: any) =>
      files.filter((item: any) => item.name !== file.name)
    );
  };

  const handleBrandForm = async (value: { Name: string; Type: string }) => {
    const { Name, Type } = value;
    if (files[0]?.name) {
      const uploadTask = uploadBytesResumable(
        storageRef(`brands/${files[0]?.name}`),
        files[0]
      );

      uploadTask.on(
        "state_changed",
        () => {
          dispatch(
            setMessage({
              message: "Waiting for loading....",
              type: "success",
            })
          );
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url: string) => {
            const data = {
              name: Name || brand?.name,
              type: Type || brand?.type,
              image: url || brand?.image,
              published: brand?.published,
            };
            if (status === "create") {
              dispatch(addBrandSync(brandDataForm(data, user.docId)));
            }
            if (status === "edit") {
              dispatch(
                updateBrandAsync({
                  updatedBrand: brandDataForm(data, user.docId),
                  id,
                })
              );
            }
            if (error) {
              setErrorMessage("An error occurred! Please try again.");
              dispatch(
                setMessage({
                  message: "An error occurred! Please try again.",
                  type: "error",
                })
              );
              return;
            }
            reset();
            handleFileDelete(files);
            router.push("/admin/brands");
            dispatch(
              setMessage({
                message:
                  status === "create"
                    ? "Add new brand successfully!."
                    : "Update brand successfully!.",
                type: "success",
              })
            );
          });
        }
      );
      return;
    }
    const data = {
      name: Name || brand?.name,
      type: Type || brand?.type,
      image: brand?.image || "",
      published: brand?.published,
    };
    if (status === "create") {
      dispatch(addBrandSync(brandDataForm(data, user.docId)));
    }
    if (status === "edit") {
      dispatch(
        updateBrandAsync({ updatedBrand: brandDataForm(data, user.docId), id })
      );
    }
    if (error) {
      setErrorMessage("An error occurred! Please try again.");
      dispatch(
        setMessage({
          message: "An error occurred! Please try again.",
          type: "error",
        })
      );
      return;
    }
    reset();
    handleFileDelete(files);
    router.push("/admin/brands");
    dispatch(
      setMessage({
        message:
          status === "create"
            ? "Add new brand successfully!."
            : "Update brand successfully!.",
        type: "success",
      })
    );
  };

  return (
    <Card
      sx={{
        p: 6,
      }}
    >
      <form onSubmit={handleSubmit(handleBrandForm)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              name="Name"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  fullWidth
                  name="Name"
                  type="name"
                  variant="outlined"
                  label="Name"
                  placeholder="brands..."
                  onChange={onChange}
                  helperText={!!error ? error.message : ""}
                  error={!!error?.message}
                  value={value || ""}
                  autoFocus={status === "create"}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="Type"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Type"
                  placeholder="type..."
                  onChange={onChange}
                  helperText={!!error ? error.message : ""}
                  error={!!error?.message}
                  value={value || ""}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <DropZone
              title="Drop & drag brand image"
              onChange={handleChangeDropZone}
              imageSize=""
            />

            <FlexBox flexDirection="row" mt={2} flexWrap="wrap" gap={1}>
              {files.map((file: any, index: number) => {
                return (
                  <UploadImageBox size="medium" key={index}>
                    <Image src={file.preview} width="100%" />
                    <StyledClear onClick={handleFileDelete(file)} />
                  </UploadImageBox>
                );
              })}
              {isEmpty(files) && brand?.image && (
                <UploadImageBox size="medium">
                  <Image src={brand?.image} width="100%" />
                </UploadImageBox>
              )}
            </FlexBox>
          </Grid>

          {isDirty && isValid && errorMessage && (
            <ErrorMessage>{errorMessage}</ErrorMessage>
          )}

          <Grid justifyContent="flex-end" container item xs={12}>
            <Button
              disabled={
                (status === "create" && (!isDirty || !isValid)) ||
                (status === "edit" && isEmpty(files) && (!isDirty || !isValid))
              }
              variant="contained"
              color="info"
              type="submit"
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </Card>
  );
};

export default React.memo(BrandForm);
