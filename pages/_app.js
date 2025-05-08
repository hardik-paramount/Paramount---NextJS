// pages/_app.js
import '../styles/globals.css';
import Breadcrumbs from '../components/Breadcrumbs';
import Menu from '../components/Menu';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Menu />
      <Breadcrumbs />
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
