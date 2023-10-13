import { Locale } from "../../../next-i18next.config";
import HomePage from "@/pages/home";

export default async function Home({ params }: { params: { lang: Locale } }) {
  console.log(params)
  return <HomePage params={params} />;
}

export const metadata = {
  title: "TapHoa Ecommerce",
  description: "How to do i18n in Next.js 13 within app directory",
};
