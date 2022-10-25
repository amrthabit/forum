import { ThemeProvider } from "@mui/material";
import Header from "../comps/headerV2";
import { GlobalCSS, useTheme } from "../comps/themes";
import useDeviceSize from "../comps/useDeviceSize";
import "../styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  const [theme] = useTheme();
  const [displaySize] = useDeviceSize();
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Forum</title>
        <meta name="viewport" description="Forum" />
      </Head>
      <GlobalCSS theme={theme} />
      <Header theme={theme} displaySize={displaySize} />
      <Component displaySize={displaySize} theme={theme} {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
