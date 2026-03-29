import { ThemeProvider } from 'next-themes';
import Layout from '../components/Layout';
import Head from '../components/Head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <Layout>
        <Head title={`Efthimios Vlahos${pageProps.title ? ` | ${pageProps.title}` : ''}`} />
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;
