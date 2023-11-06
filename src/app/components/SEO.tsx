import Head from "next/head";

// ====================================================================

// ====================================================================
type TypeProps = {
  title: string;
  description: string;
  sitename: string;
};
const SEO = ({
  title,
  description = "TapHoa nextjs 13 directory app",
  sitename = "TapHoa Ecommerce",
}: Partial<TypeProps>) => {
  return (
    <Head>
      <title>{`${title} | ${sitename}`}</title>
      <meta name="description" content={description} />
    </Head>
  );
};
export default SEO;
