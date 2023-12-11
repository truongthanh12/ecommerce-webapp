import SalePage from "@/app/page-sections/sale-page";

interface PageProps {
  searchParams: { [key: string]: string | undefined };
}
export default function SalePageContainer({ searchParams }: PageProps) {
  return <SalePage searchParams={searchParams} />;
}
