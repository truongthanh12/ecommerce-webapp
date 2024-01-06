import { Call, InfoRounded, Place } from "@mui/icons-material";
import { Avatar, Box, Button, Card, Rating } from "@mui/material";
import { FlexBetween, FlexBox } from "@/components/flex-box";
import FacebookFilled from "@/components/icons/FacebookFilled";
import InstagramFilled from "@/components/icons/InstagramFilled";
import TwitterFilled from "@/components/icons/TwitterFilled";
import YoutubeFilled from "@/components/icons/YoutubeFilled";
import { H3, Small, Span } from "@/components/Typography";
import React from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { changeUser, openChat } from "@/redux/features/chatSlice";
import { RootState } from "@/redux/store";
import {
  DocumentSnapshot,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import db from "@/firebase";

// =======================================================

interface CardShops {
  name: string;
  address: string;
  phone: string;
  coverPicture: string;
  profilePicture: string;
  description: string;
  facebook: string;
  youtube: string;
  email: string;
  uid: string;
}
const ShopIntroCard = ({
  name,
  phone,
  address,
  coverPicture,
  profilePicture,
  description,
  facebook,
  youtube,
  uid,
}: CardShops) => {
  const params = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const handleClickContact = async () => {
    if (!user?.uid && uid) return;
    dispatch(openChat());
    const combinedId = user.uid > uid ? user.uid + uid : uid + user.uid;

    try {
      const res: DocumentSnapshot = await getDoc(
        doc(db, "messages", combinedId)
      );

      if (!res.exists()) {
        await setDoc(doc(db, "messages", combinedId), { messages: [] });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid,
            displayName: name,
            photoURL: profilePicture,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }

      dispatch(
        changeUser({
          uid,
          displayName: name,
          photoURL: profilePicture,
          currentUserId: user.uid,
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const socialLinks = [
    {
      icon: FacebookFilled,
      url: facebook,
    },
    {
      icon: YoutubeFilled,
      url: youtube,
    },
  ];

  return (
    <Card
      sx={{
        mb: 4,
        pb: 2.5,
      }}
    >
      <Box
        height="202px"
        sx={{
          background: `url(${coverPicture}) center/cover`,
        }}
      />

      <FlexBox mt={-8} px={3.75} flexWrap="wrap">
        <Avatar
          src={profilePicture}
          sx={{
            mr: "37px",
            width: "120px",
            height: "120px",
            border: "4px solid",
            borderColor: "grey.100",
          }}
        />

        <Box
          sx={{
            flex: "1 1 0",
            minWidth: "250px",
            "@media only screen and (max-width: 500px)": {
              marginLeft: 0,
            },
          }}
        >
          <FlexBetween flexWrap="wrap" mt={0.375} mb={3}>
            <Box
              my={1}
              p="4px 16px"
              borderRadius="4px"
              display="inline-block"
              bgcolor="secondary.main"
            >
              <H3 fontWeight="600" color="grey.100">
                {name}
              </H3>
            </Box>

            <FlexBox my={1} gap={1.5}>
              {socialLinks.map((item, ind) => (
                <a
                  href={`${item.url}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  key={ind}
                >
                  <item.icon
                    sx={{
                      fontSize: 27,
                    }}
                  />
                </a>
              ))}
            </FlexBox>
          </FlexBetween>

          <FlexBetween flexWrap="wrap">
            <Box>
              <FlexBox alignItems="center" gap={1} mb={2}>
                <Rating
                  color="warn"
                  size="small"
                  value={5}
                  precision={0.5}
                  readOnly
                />
                <Small color="grey.600" display="block">
                  (45)
                </Small>
              </FlexBox>

              <FlexBox color="grey.600" gap={1} mb={1} maxWidth={270}>
                <InfoRounded
                  fontSize="small"
                  sx={{
                    fontSize: 18,
                    mt: "3px",
                  }}
                />
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      description
                        ?.substring(0, 100)
                        .replace(/(?:\r\n|\r|\n)/g, "<br />") + "...",
                  }}
                />
              </FlexBox>
              <FlexBox color="grey.600" gap={1} mb={1} maxWidth={270}>
                <Place
                  fontSize="small"
                  sx={{
                    fontSize: 18,
                    mt: "3px",
                  }}
                />
                <Span color="grey.600">{address}</Span>
              </FlexBox>

              <FlexBox color="grey.600" gap={1} mb={1}>
                <Call
                  fontSize="small"
                  sx={{
                    fontSize: 18,
                    mt: "2px",
                  }}
                />
                <Span color="grey.600">
                  <a href={`tel:${phone}`}>{phone}</a>
                </Span>
              </FlexBox>
            </Box>

            <Button
              variant="outlined"
              color="primary"
              sx={{
                my: 1.5,
              }}
              onClick={handleClickContact}
            >
              Contact Vendor
            </Button>
          </FlexBetween>
        </Box>
      </FlexBox>
    </Card>
  );
};

export default React.memo(ShopIntroCard);
