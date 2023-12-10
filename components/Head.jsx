import Head from 'next/head';

const CustomHead = ({ title }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta
        name="description"
        content="Efthimios Vlahos's Profolio."
      />
      <meta
        name="keywords"
        content="Efthimios Vlahos, Efthimios, vlahos, data scientist portfolio, machine learning engineer, efthimios vlahos portfolio, vscode-portfolio"
      />
      <meta property="og:title" content="Efthimios Vlahos's Portfolio" />
      <meta
        property="og:description"
        content="Efthimios Vlahos's Profolio."
      />
      <meta property="og:image" content="/Users/Vlahonator/Desktop/Efthimios.github.io-main/public/Screenshot 2023-12-09 at 12.46.45 PM.png" />
      <meta property="og:url" content="https://efthimiosvlahos-github-io.vercel.app/" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
};

export default CustomHead;

CustomHead.defaultProps = {
  title: 'Efthimios Vlahos',
};
