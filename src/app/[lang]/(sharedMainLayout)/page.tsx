import { getDictionary } from "@/dictionary";
import { Locale } from "../../../../next-i18next.config";
import HomePage from "@/pages/home";
import { Ilang } from "@/app/models/Lang";

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary: Ilang = await getDictionary(lang);

  return <HomePage lang={lang} dictionary={dictionary} />;
}

export const metadata = {
  title: "TapHoa Ecommerce",
  description: "How to do i18n in Next.js 13 within app directory",
};
