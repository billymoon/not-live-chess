import { Fragment } from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import getConfig from "next/config";
import createEmotionServer from "@emotion/server/create-instance";
import { cache } from "@emotion/css";

const { publicRuntimeConfig } = getConfig();
const { font } = publicRuntimeConfig;

const consoleWarnScript = `
void (() => {
  const consoleWarn = console.warn
  console.warn = (...args) => {
    if(args[0].startsWith("Warning: componentWillReceiveProps has been renamed")) {
      // do nothing
    } else {
      consoleWarn.call(this, ...args)
    }
  };
})()
`;

const renderStatic = async (html) => {
  if (html === undefined) {
    throw new Error("did you forget to return html from renderToString?");
  }
  const { extractCritical } = createEmotionServer(cache);
  const { ids, css } = extractCritical(html);

  return { html, ids, css };
};

export default class AppDocument extends Document {
  static async getInitialProps(ctx) {
    const page = await ctx.renderPage();
    const { css, ids } = await renderStatic(page.html);
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: (
        <Fragment>
          {initialProps.styles}
          <style
            data-emotion={`css ${ids.join(" ")}`}
            dangerouslySetInnerHTML={{ __html: css }}
          />
        </Fragment>
      ),
    };
  }

  render() {
    return (
      <Html>
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
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
