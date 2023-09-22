import React, { Suspense, useEffect, useState } from "react";
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
import { getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storageRef } from "@/firebase";
import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/navigation";
import {
  addBannerAsync,
  bannerDataForm,
  updateBannerAsync,
} from "@/redux/features/bannerSlice";

// ================================================================

export const ErrorMessage = styled("span")(() => ({
  display: "flex",
  justifyContent: "center",
  color: "red",
  marginBottom: "6px",
  width: "100%",
}));
const schema = yup.object().shape({
  Title: yup.string().required(),
  Type: yup.string().required(),
  Description: yup.string().max(255, "Max 255 chars").required(),
  ButtonText: yup.string().required(),
});

const BannerForm = ({ id = "", banner }: { id?: string; banner?: any }) => {
  const [files, setFiles] = useState<any>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch: any = useDispatch();
  const { error } = useSelector((state: any) => state.banners);
  const { status } = useSelector((state: any) => state.statusAdmin);
  const router = useRouter();

  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, isValid },
  } = useForm<any>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (banner) {
      reset({
        Title: banner.title,
        Type: banner.type,
        Description: banner.description,
        ButtonText: banner.buttonText,
      });
    }
  }, [reset, banner]);

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

  const handleBannerForm = async (value: {
    Title: string;
    Type: string;
    Description: string;
    ButtonText: string;
  }) => {
    const { Title, Type, Description, ButtonText } = value;
    if (files[0]?.name) {
      const uploadTask = uploadBytesResumable(
        storageRef(`banners/${files[0]?.name}`),
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
              title: Title || banner?.title,
              type: Type || banner?.type,
              imgUrl: url || banner?.imgUrl,
              description: Description || banner?.description,
              buttonText: ButtonText || banner?.buttonText,
            };
            if (status === "create") {
              dispatch(addBannerAsync(bannerDataForm(data)));
            }
            if (status === "edit") {
              dispatch(
                updateBannerAsync({ updateBanner: bannerDataForm(data), id })
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
            router.push("/admin/banners");
            dispatch(
              setMessage({
                message:
                  status === "create"
                    ? "Add new banner successfully!."
                    : "Update banner successfully!.",
                type: "success",
              })
            );
          });
        }
      );
      return;
    }
    const data = {
      title: Title || banner?.title,
      type: Type || banner?.type,
      imgUrl: banner?.imgUrl || "",
      description: Description || banner?.description,
      buttonText: ButtonText || banner?.buttonText,
    };
    if (status === "create") {
      dispatch(addBannerAsync(bannerDataForm(data)));
    }
    if (status === "edit") {
      dispatch(updateBannerAsync({ updateBanner: bannerDataForm(data), id }));
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
    router.push("/admin/banners");
    dispatch(
      setMessage({
        message:
          status === "create"
            ? "Add new banner successfully!."
            : "Update banner successfully!.",
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
      <Suspense fallback="Loading...">
        <form onSubmit={handleSubmit(handleBannerForm)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="Title"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    fullWidth
                    type="title"
                    variant="outlined"
                    label="Title"
                    placeholder="banners...."
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
              <Controller
                name="ButtonText"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Button text"
                    placeholder="Button text..."
                    onChange={onChange}
                    helperText={!!error ? error.message : ""}
                    error={!!error?.message}
                    value={value || ""}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="Description"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Description"
                    placeholder="Description..."
                    onChange={onChange}
                    helperText={!!error ? error.message : ""}
                    error={!!error?.message}
                    value={value || ""}
                    multiline
                    rows={3}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <DropZone
                title="Drop & drag banner image"
                onChange={handleChangeDropZone}
                imageSize=""
              />

              <FlexBox flexDirection="row" mt={2} flexWrap="wrap" gap={1}>
                {files.map((file: any, index: number) => {
                  return (
                    <UploadImageBox size="medium" key={index}>
                      <Image alt="Image uploaded" src={file.preview} width="100%" />
                      <StyledClear onClick={handleFileDelete(file)} />
                    </UploadImageBox>
                  );
                })}
                {isEmpty(files) && banner?.imgUrl && (
                  <UploadImageBox size="medium">
                    <Image alt="Image uploaded" src={banner?.imgUrl} width="100%" />
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
                  (status === "edit" &&
                    isEmpty(files) &&
                    (!isDirty || !isValid))
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
      </Suspense>
    </Card>
  );
};

export default React.memo(BannerForm);
