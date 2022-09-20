import { CssBaseline, ThemeProvider } from "@mui/material";
import Header from "../comps/headerV2";
import { GlobalCSS, useTheme } from "../comps/themes";
import "../styles/globals.css";
import useDeviceSize from "../comps/useDeviceSize";
import { useMeQuery } from "../src/generated/graphql";
import { isServer } from "../utils/isServer";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import getMe from "../comps/getMe";

function MyApp({ Component, pageProps }) {
  const [theme] = useTheme();
  const [displaySize] = useDeviceSize();
  // const [meQuery] = getMe();
  // console.log("...", meQuery);
  return (
    <ThemeProvider theme={theme}>
      <GlobalCSS theme={theme} />
      <Header theme={theme} displaySize={displaySize} />
      <Component displaySize={displaySize} theme={theme} {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
