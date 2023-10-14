import React from "react";
import Topbar from "@/components/Topbar";
import Header from "@/components/header";
import SearchInputWithCategory from "@/components/search-box/SearchInputWithCategory";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import MobileNavigationBar from "@/components/navbar/MobileNavigationBar";

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
