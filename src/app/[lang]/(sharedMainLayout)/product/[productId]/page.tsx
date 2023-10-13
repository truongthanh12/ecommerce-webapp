import ProductDetails from "@/pages/product-detail";
interface ProductDetailProps {
  params: { productId: string };
  searchParams: { [key: string]: string | undefined };
}
const ProductDetail = ({ params, searchParams }: ProductDetailProps) => {
  return <ProductDetails params={params} searchParams={searchParams} />;
};

export default ProductDetail;
