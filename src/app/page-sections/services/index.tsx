import React from "react";
import { Container, Grid, IconButton } from "@mui/material";
import appIcons from "@/components/icons";
import Card from "@/components/Card";
import { H4, Span } from "@/components/Typography";
import { Ilang } from "@/app/models/Lang";
const CARD_STYLE = {
  p: "3rem",
  height: "100%",
  display: "flex",
  borderRadius: "8px",
  alignItems: "center",
  flexDirection: "column",
};

// ==================================================
interface TypeService {
  id: string;
  icon: keyof typeof appIcons;
  title: string;
  description: string | null;
}
type TypeProps = {
  serviceList: TypeService[];
  dictionary: Ilang;
};
const Services: React.FC<TypeProps> = ({ serviceList, dictionary }) => {
  return (
    <Container
      sx={{
        mb: "70px",
      }}
    >
      <Grid container spacing={3}>
        {(serviceList || []).map((item) => {
          const Icon = appIcons[item.icon || "AlarmClock"];

          return (
            <Grid item lg={3} md={6} xs={12} key={item.id}>
              <Card hoverEffect sx={CARD_STYLE}>
                <IconButton
                  sx={{
                    width: 64,
                    height: 64,
                    fontSize: "1.75rem",
                    backgroundColor: "grey.200",
                  }}
                >
                  <Icon key={null} type={undefined} props={undefined} />
                </IconButton>

                <H4 mt={2.5} mb={1.25} textAlign="center">
                  {item.title}
                </H4>

                <Span textAlign="center" color="grey.600">
                  {item.description}
                </Span>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};
export default React.memo(Services);
