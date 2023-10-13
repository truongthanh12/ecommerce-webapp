import React, { useCallback, useState } from "react";
import { H1 } from "@/components/Typography";
import TextFieldInput from "@/components/TextField";
import EyeToggleButton from "./EyeToggleButton";
import Image from "next/legacy/image";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  loading,
  login,
  loginError,
  userData,
} from "@/redux/features/authSlice";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import db, { auth } from "@/firebase";
import { setMessage } from "@/redux/features/messageSlice";
import LoadingButton from "@mui/lab/LoadingButton";
import { Checkbox, FormControlLabel, FormGroup, styled } from "@mui/material";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { RootState } from "@/redux/store";

type FormValues = {
  Email: string;
  Password: string;
};
interface FormProps {
  authType: "signin" | "signup" | string;
  onClosePopup: () => void;
  passwordVisibility: "text" | "password" | boolean;
  setPasswordVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

const ErrorMessage = styled("span")(() => ({
  display: "flex",
  justifyContent: "center",
  color: "red",
  marginBottom: "6px",
}));
const schema = yup.object().shape({
  Email: yup.string().email().required(),
  Password: yup.string().min(6).max(32).required(),
});

const FormAuth = ({
  authType,
  onClosePopup,
  passwordVisibility,
  setPasswordVisibility,
}: FormProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isChecked, setChecked] = useState(false);
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const {
    handleSubmit,
    control,
    formState: { isDirty, isValid },
  } = useForm<any>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const toggleChecked = useCallback(() => {
    setChecked((isCheck) => !isCheck);
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisibility((visible) => !visible);
  }, [setPasswordVisibility]);

  const onBlur = useCallback(() => {
    setErrorMessage("");
  }, []);

  const handleFormSubmit = async (value: FormValues) => {
    const { Email, Password } = value || {};
    dispatch(loading());

    try {
      if (authType === "signup") {
        const userAuth = await createUserWithEmailAndPassword(
          auth,
          Email,
          Password
        );

        // Create the document in Firestore with the docId field
        const usersCollection = collection(db, "users");
        const userDataWithOptionalData = userData({
          data: userAuth,
          optionalData: { isVendor: isChecked },
        });

        const docRef = await addDoc(usersCollection, userDataWithOptionalData);

        // Update the local data with the new docId
        userDataWithOptionalData.docId = docRef.id;

        dispatch(login(userDataWithOptionalData));
        onClosePopup();
        dispatch(setMessage({ message: "Register successfully!" }));
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          Email,
          Password
        );
        const user = userCredential.user;

        // Check if the user data already exists in Firestore
        const usersCollection = collection(db, "users");
        const userQuery = query(usersCollection, where("uid", "==", user.uid));
        const userQuerySnapshot = await getDocs(userQuery);
        if (userQuerySnapshot?.empty) {
          dispatch(loginError("User data not found."));
          setErrorMessage("User data not found.")
          dispatch(
            setMessage({ message: "User data not found.", type: "error" })
          );
        } else {
          const userDataSnapshot = userQuerySnapshot.docs[0];
          const userData = userDataSnapshot.data();

          userData.docId = userDataSnapshot.id;

          dispatch(login(userData));

          // Handle successful login
          dispatch(setMessage({ message: "Login successfully!" }));
        }
      }
    } catch (err: any) {
      dispatch(loginError(err.message));
      dispatch(
        setMessage({
          message:
            err.message === "Firebase: Error (auth/email-already-in-use)."
              ? "Email existed, please try login with this email."
              : "An error occurred! Please try again.",
          type: "error",
        })
      );

      setErrorMessage(
        err.message === "Firebase: Error (auth/email-already-in-use)."
          ? "Email existed, please try login with this email."
          : "An error occurred! Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="relative">
        <Image
          width={90}
          height={80}
          alt="hello"
          src="/assets/images/logo2.png"
          style={{ margin: "auto", display: "block" }}
        />
      </div>
      <H1 textAlign="center" mt={1} mb={4} fontSize={16}>
        Welcome To TapHoa
      </H1>

      <Controller
        name="Email"
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextFieldInput
            mb={1.5}
            onBlur={onBlur}
            fullWidth
            size="small"
            type="email"
            variant="outlined"
            label="Email"
            placeholder="exmple@mail.com"
            onChange={onChange}
            helperText={!!error ? error.message : ""}
            error={!!error?.message}
            value={value || ""}
            autoFocus
          />
        )}
      />

      <Controller
        name="Password"
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextFieldInput
            mb={2}
            onBlur={onBlur}
            fullWidth
            size="small"
            label="Password"
            autoComplete="on"
            variant="outlined"
            onChange={onChange}
            helperText={!!error ? error.message : ""}
            error={!!error?.message}
            value={value || ""}
            placeholder="*********"
            type={passwordVisibility ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <EyeToggleButton
                  show={!!passwordVisibility}
                  click={togglePasswordVisibility}
                />
              ),
            }}
          />
        )}
      />
      {authType === "signup" && (
        <FormGroup>
          <FormControlLabel
            control={<Checkbox onChange={toggleChecked} checked={isChecked} />}
            label="Create an account as a vendor"
          />
        </FormGroup>
      )}

      {isDirty && isValid && errorMessage && (
        <ErrorMessage>{errorMessage}</ErrorMessage>
      )}

      <LoadingButton
        fullWidth
        type="submit"
        color="primary"
        variant="contained"
        loading={isLoading && !error.message}
        loadingIndicator="Loading…."
        sx={{
          height: 44,
        }}
        disabled={!isDirty || !isValid || isLoading}
      >
        {!isLoading &&
          !error.message &&
          (authType == "signup" ? "Sign up" : "Sign in")}
      </LoadingButton>
    </form>
  );
};

export default React.memo(FormAuth);
