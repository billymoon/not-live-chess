import { Fragment, useEffect } from "react";
import Head from "next/head";
import getConfig from "next/config";
// import "./_app.css";
// import Layout from "../components/Layout";

const { publicRuntimeConfig } = getConfig();

const { dev, theme, font } = publicRuntimeConfig;

if (dev) {
  global.publicRuntimeConfig = publicRuntimeConfig;
}

const consoleWarnScript = `
const consoleWarn = console.warn
console.warn = (...args) => {
  if(args[0].startsWith("Warning: componentWillReceiveProps has been renamed")) {
    // do nothing
  } else {
    consoleWarn.call(this, ...args)
  }
};
`;

function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <Head>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="stylesheet"
          href={`https://cdn.jsdelivr.net/npm/bootswatch@5.1.0/dist/${theme}/bootstrap.min.css`}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=${font}&display=swap`}
        />
        <script dangerouslySetInnerHTML={{ __html: consoleWarnScript }} />
      </Head>
      <Component {...pageProps} />
      {/* <Layout>
      </Layout> */}
    </Fragment>
  );
}

export default MyApp;
