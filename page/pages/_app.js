import { ThemeProvider } from "@mui/material";
import { useMemo } from "react";
import Header from "../comps/headerV2";
import { GlobalCSS, useTheme } from "../comps/themes";
import "../styles/globals.css";
import useDeviceSize from "../comps/useDeviceSize";

function MyApp({ Component, pageProps }) {
  const [theme] = useTheme();
  const [displaySize] = useDeviceSize();

  return (
    <ThemeProvider theme={theme}>
      <GlobalCSS theme={theme} />
      <Header theme={theme} />
      <Component displaySize={displaySize} theme={theme} {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
