import { Fragment, useEffect } from "react";
import getConfig from "next/config";
import { ChakraProvider } from "@chakra-ui/react";
import { theme, extendTheme } from "@chakra-ui/react";
import api from "../api/api";
import { lichess } from "../utils/nextjs-lichess";
import { Chess } from "chess.js";

const { publicRuntimeConfig } = getConfig();
const { dev, font } = publicRuntimeConfig;

const emotionTheme = extendTheme({
  fonts: {
    body: `${font}, Sans-Serif`,
    heading: `${font}, Sans-Serif`,
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

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (dev) {
      globalThis.publicRuntimeConfig = publicRuntimeConfig;
      globalThis.emotionTheme = emotionTheme;
      globalThis.log = (x) => console.log(x) || x;
      globalThis.api = api;
      globalThis.chess = new Chess();
      globalThis.Chess = Chess;
      globalThis.lichess = lichess;
    }
  }, []);

  return (
    <Fragment>
      <ChakraProvider theme={emotionTheme}>
        {/* <Stack><Link href="/seek">Seek</Link></Stack> */}
        <Component {...pageProps} />
      </ChakraProvider>
      {/* <Layout>
      </Layout> */}
    </Fragment>
  );
}

export default MyApp;
