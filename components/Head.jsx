import Head from 'next/head';

const CustomHead = ({ title }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content="Efthimios Vlahos — Machine Learning Engineer. Portfolio showcasing AI/ML projects, professional experience, and skills." />
      <meta name="keywords" content="Efthimios Vlahos, Machine Learning Engineer, AI, MLOps, Data Science, Portfolio" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content="Efthimios Vlahos — Machine Learning Engineer at Con Edison." />
      <meta property="og:url" content="https://evlahos.netlify.app/" />
      <meta name="twitter:card" content="summary" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    </Head>
  );
};

export default CustomHead;

CustomHead.defaultProps = {
  title: 'Efthimios Vlahos',
};
