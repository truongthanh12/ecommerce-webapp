import { Ilang } from "@/app/models/Lang";
import Main from "@/components/layouts/main-dashboard";
import { getDictionary } from "@/dictionary";
import { Locale } from "../../../../next-i18next.config";

const MainLayout = async ({
  params,
  children,
}: {
  params: { lang: Locale };
  children: React.ReactNode;
}) => {
  const dictionary: Ilang = await getDictionary(params.lang);
  return <Main dictionary={dictionary}>{children}</Main>;
};

export default MainLayout;
