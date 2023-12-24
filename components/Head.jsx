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
        content="Efthimios Vlahos,efthimos vlahos, Efthimios, vlahos, data scientist portfolio, machine learning engineer, efthimios vlahos portfolio, vscode-portfolio"
      />
      <meta property="og:title" content="Efthimios Vlahos's Portfolio" />
      <meta
        property="og:description"
        content="Efthimios Vlahos's Profolio."
      />
      <meta property="og:image" content="https://private-user-images.githubusercontent.com/56899588/289312582-40739a54-6701-496d-b62c-67f0ce6bd3e0.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTEiLCJleHAiOjE3MDM0NDM2MDQsIm5iZiI6MTcwMzQ0MzMwNCwicGF0aCI6Ii81Njg5OTU4OC8yODkzMTI1ODItNDA3MzlhNTQtNjcwMS00OTZkLWI2MmMtNjdmMGNlNmJkM2UwLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFJV05KWUFYNENTVkVINTNBJTJGMjAyMzEyMjQlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjMxMjI0VDE4NDE0NFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTlhYmQ4OTE3NzQwMjMxNmY4ODBmMWZhZWU1OGRmNjVkZDc0MDEwMWMwNWE0MTcwZjliZGM5MjIzNTJhMTFkODYmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.U8d4yZ0mwTnkgjrb56VlNO1hEwCoM8gQCq5LTYm5Dj8" />
      <meta property="og:url" content="https://efthimiosvlahos-github-io.vercel.app/" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
};

export default CustomHead;

CustomHead.defaultProps = {
  title: 'Efthimios Vlahos',
};
