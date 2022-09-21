import { ThemeProvider } from "@mui/material";
import Header from "../comps/headerV2";
import { GlobalCSS, useTheme } from "../comps/themes";
import useDeviceSize from "../comps/useDeviceSize";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const [theme] = useTheme();
  const [displaySize] = useDeviceSize();
  return (
    <ThemeProvider theme={theme}>
      <GlobalCSS theme={theme} />
      <Header theme={theme} displaySize={displaySize} />
      <Component displaySize={displaySize} theme={theme} {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
