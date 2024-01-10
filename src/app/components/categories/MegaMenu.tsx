import CardComp from "@/components/Card";
import React from "react";
import StyledMegaMenu from "./StyledMegaMenu";
import CategoryMenuItem from "./CategoryMenuItem";
import { removeAccents } from "@/utils/lib";
import { useParams } from "next/navigation";

type TypeProps = {
  data: any;
  parent?: any;
};
const MegaMenu: React.FC<TypeProps> = ({ data }) => {
  const params = useParams();
  const { lang } = params || {};

  return (
    <StyledMegaMenu>
      <CardComp
        elevation={2}
        sx={{
          ml: "1rem",
          py: "0.5rem",
        }}
      >
        {data?.map((item: any, ind: number) => {
          return (
            <CategoryMenuItem
              href={`/${lang}/product/search/cate?${new URLSearchParams({
                subCategory: removeAccents(item.slug),
              })}`}
              key={ind}
              title={item.name}
            ></CategoryMenuItem>
          );
        })}
      </CardComp>
    </StyledMegaMenu>
  );
};
export default React.memo(MegaMenu);
