import Head from "next/head";

// ====================================================================

// ====================================================================
type TypeProps = {
  title: string;
  description?: string;
  sitename?: string;
};
const SEO = ({
  title,
  description,
  sitename = "Taphoa Ecommerce",
}: TypeProps) => {
  return (
    <Head>
      <title>{`${title} | ${sitename}`}</title>
      <meta name="description" content={description} />
    </Head>
  );
};
export default SEO;
