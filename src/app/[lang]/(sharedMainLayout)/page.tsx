import { getDictionary } from "../../../../get-dictionary";
import { Locale } from "../../../../next-i18next.config";
import HomePage from "@/pages/home";

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  return <HomePage dictionary={dictionary} />;
}

export const metadata = {
  title: "TapHoa Ecommerce",
  description: "How to do i18n in Next.js 13 within app directory",
};
