import Topbar from "@/components/Topbar";
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/header/Header";
import SearchInputWithCategory from "@/components/search-box/SearchInputWithCategory";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Head from "next/head";
import OpenGraphTags from "@/utils/OpenGraphTags";
import MuiTheme from "@/components/theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ecommerce web",
  description: "Ecommerce web",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="React Next.js ecommerce template. Build SEO friendly Online store, delivery app and Multivendor store"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <OpenGraphTags />
        <title>Bazaar - Next.js Ecommerce Template</title>
      </Head>
      <body className={inter.className}>
        <MuiTheme>
          <Topbar />

          <Header searchInput={<SearchInputWithCategory />} />

          <Navbar />

          <main>{children}</main>

          <Footer />
        </MuiTheme>
      </body>
    </html>
  );
}
