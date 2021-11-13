import { Fragment, useEffect } from "react";
import Head from "next/head";
import getConfig from "next/config";
import { ChakraProvider } from "@chakra-ui/react";
import { theme, extendTheme } from "@chakra-ui/react";

// import "./_app.css";
// import Layout from "../components/Layout";

const { publicRuntimeConfig } = getConfig();

const { dev, font } = publicRuntimeConfig;

const emotionTheme = extendTheme({
  fonts: {
    body: `${publicRuntimeConfig.font}, Sans-Serif`,
    heading: `${publicRuntimeConfig.font}, Sans-Serif`,
    mono: "Courier, Sans-Serif",
  },
  styles: {
    global: ({ colorMode }) => ({
      body: {
        bg: `lichess.${colorMode}.buttonGradientEnd`,
        color: `lichess.${colorMode}.buttonTextColor`,
      },
    }),
  },
  radii: {
    ...theme.radii,
    lichessButton: "3px",
  },
  components: {
    Button: {
      baseStyle: ({ colorMode, theme }) => ({
        color: `lichess.${colorMode}.buttonTextColor`,
        borderRadius: "lichessButton",
        textTransform: "uppercase",
        fontWeight: "normal",
        bg: `lichess.${colorMode}.buttonGradientStart`,
        bgGradient: theme.gradients.lichess[colorMode].button,
        boxShadow: "md",
        _hover: {
          color: `lichess.${colorMode}.buttonTextColorHover`,
          bg: `lichess.${colorMode}.buttonGradientStart`,
          bgGradient: theme.gradients.lichess[colorMode].buttonHover,
          boxShadow: "lg",
        },
        _active: {
          color: `lichess.${colorMode}.buttonTextColorHover`,
          bg: `lichess.${colorMode}.buttonGradientStart`,
          bgGradient: theme.gradients.lichess[colorMode].buttonHover,
          boxShadow: "sm",
        },
        _focus: {
          boxShadow: "none",
        },
      }),
    },
  },
  gradients: {
    lichess: {
      light: {
        button:
          "linear(to-b, lichess.light.buttonGradientStart, lichess.light.buttonGradientEnd)",
        buttonHover:
          "linear(to-b, lichess.light.buttonGradientStartHover, lichess.light.buttonGradientEndHover)",
      },
      dark: {
        button:
          "linear(to-b, lichess.dark.buttonGradientStart, lichess.dark.buttonGradientEnd)",
        buttonHover:
          "linear(to-b, lichess.dark.buttonGradientStartHover, lichess.dark.buttonGradientEndHover)",
      },
    },
  },
  colors: {
    lichess: {
      light: {
        buttonTextColor: "#787878",
        buttonTextColorHover: "#787878",
        buttonGradientStart: "#f5f5f5",
        buttonGradientEnd: "#ededed",
        buttonGradientStartHover: "#fafafa",
        buttonGradientEndHover: "#f2f2f2",
      },
      dark: {
        buttonTextColor: "#999",
        buttonTextColorHover: "#ccc",
        buttonGradientStart: "#3c3934",
        buttonGradientEnd: "#33312e",
        buttonGradientStartHover: "#44413b",
        buttonGradientEndHover: "#3b3935",
      },
    },
  },
});

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

if (dev) {
  global.publicRuntimeConfig = publicRuntimeConfig;
  global.emotionTheme = emotionTheme;
  global.log = (x) => console.log(x) || x;
}

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
      <ChakraProvider theme={emotionTheme}>
        <Component {...pageProps} />
      </ChakraProvider>
      {/* <Layout>
      </Layout> */}
    </Fragment>
  );
}

export default MyApp;
