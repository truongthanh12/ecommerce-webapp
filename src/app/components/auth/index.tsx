import React, { useCallback, useState } from "react";
import { Card, Box, styled } from "@mui/material";
import Link from "next/link";
import { H6 } from "@/components/Typography";
import SocialButtons from "@/components/auth/SocialButtons";
import { FlexBox, FlexRowCenter } from "@/components/flex-box";
import Form from "@/components/auth/Form";
import db, { auth, providers } from "@/firebase";
import { signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setMessage } from "@/redux/features/messageSlice";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { login, userData } from "@/redux/features/authSlice";
import { useParams } from "next/navigation";
import { clearPopup } from "@/redux/features/popupSlice";

const fbStyle = {
  background: "#3B5998",
  color: "white",
};
const googleStyle = {
  background: "#4285F4",
  color: "white",
};
type TypeWrapper = {
  children: React.ReactNode;
  passwordVisibility: boolean;
  elevation?: number;
};

export const Wrapper = styled(
  ({ children, passwordVisibility, ...rest }: TypeWrapper) => (
    <Card {...rest}>{children}</Card>
  )
)(({ theme, passwordVisibility }) => ({
  width: 500,
  padding: "2rem 3rem",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
  ".passwordEye": {
    color: passwordVisibility
      ? theme.palette.grey[600]
      : theme.palette.grey[400],
  },
  ".facebookButton": {
    marginBottom: 10,
    ...fbStyle,
    "&:hover": fbStyle,
  },
  ".googleButton": {
    ...googleStyle,
    "&:hover": googleStyle,
  },
  ".agreement": {
    marginTop: 12,
    marginBottom: 24,
  },
}));

const AuthComp = () => {
  const [authType, setAuthType] = useState("signin");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const dispatch = useDispatch();
  const params = useParams()

  const toggleAuth = useCallback((state: "signin" | "signup") => {
    setAuthType(state);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithPopup(auth, providers.google);
      const usersCollection = collection(db, "users");

      const q = query(usersCollection, where("uid", "==", user.user.uid));

      // Perform the query
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size === 0) {
        addDoc(collection(db, "users"), userData({data: user}));
      }
      dispatch(setMessage({ message: "Login with Google successfully." }));
      dispatch(login(userData({data: user})));
      dispatch(clearPopup());
      return user;
    } catch (err) {
      throw err;
    }
  };

  const handleFBLogin = async () => {
    try {
      const user = await signInWithPopup(auth, providers.facebook);
      const usersCollection = collection(db, "users");

      const q = query(usersCollection, where("uid", "==", user.user.uid));

      // Perform the query
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size === 0) {
        addDoc(collection(db, "users"), userData({data: user}));
      }
      dispatch(login(userData({data: user})));
      dispatch(setMessage({ message: "Login with Facebook successfully." }));
      dispatch(clearPopup());
      return user;
    } catch (err) {
      throw err;
    }
  };

  return (
    <Wrapper elevation={3} passwordVisibility={passwordVisibility}>
      <Form
        passwordVisibility={passwordVisibility}
        setPasswordVisibility={setPasswordVisibility}
        authType={authType}
      />
      <SocialButtons
        onFBLogin={handleFBLogin}
        onGoogleLogin={handleGoogleLogin}
      />

      <FlexRowCenter mt="1.25rem">
        <Box>
          {authType == "signup"
            ? "Don&apos;t have account?"
            : "You want login ?"}
        </Box>
        <H6 ml={1} borderBottom="1px solid" borderColor="grey.900">
          {authType == "signup" ? (
            <span
              className="fw-normal text-primary pointer"
              onClick={() => toggleAuth("signin")}
              style={{ cursor: "pointer" }}
            >
              Sign in
            </span>
          ) : (
            <span
              className="fw-normal text-primary pointer"
              onClick={() => toggleAuth("signup")}
              style={{ cursor: "pointer" }}
            >
              Sign up now
            </span>
          )}
        </H6>
      </FlexRowCenter>

      <FlexBox
        justifyContent="center"
        bgcolor="grey.200"
        borderRadius="4px"
        py={2.5}
        mt="1.25rem"
      >
        Forgot your password?
        <H6 ml={1} borderBottom="1px solid" borderColor="grey.900">
          <Link href={`/reset-password`} passHref legacyBehavior>
            Reset It
          </Link>
        </H6>
      </FlexBox>
    </Wrapper>
  );
};

export default React.memo(AuthComp);
