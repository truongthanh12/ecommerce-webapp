import React from "react";
import Topbar from "@/components/Topbar";
import Header from "@/app/components/header";
import SearchInputWithCategory from "@/components/search-box/SearchInputWithCategory";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import MobileNavigationBar from "@/components/navbar/MobileNavigationBar";
// import { i18n } from "../../../../../next-i18next.config";

// // export async function generateStaticParams() {
// //   return i18n.locales.map((locale) => ({ lang: locale }))
// // }

const MainLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <React.Fragment>
      <Topbar />

      <Header searchInput={<SearchInputWithCategory />} />

      <Navbar />

      <main className="section-after-sticky">{children}</main>

      <MobileNavigationBar />
      <Footer />
    </React.Fragment>
  );
};

export default React.memo(MainLayout);
