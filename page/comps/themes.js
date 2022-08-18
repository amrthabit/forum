import { createTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { Global, css } from "@emotion/react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "rgb(231, 231, 231)",
      contrastText: "rgb(0 0 0)",
    },
    background: {
      default: "#171717",
      paper: "rgb(30, 30, 30)",
      border: "rgb(18, 18, 18)",
      shadow: "#000000ff",
      hover: "#6b757f1e",
      focus: "#bcbcbc",
    },
    action: {
      selected: "rgb(200 0 0)",
    },
    text: {
      primary: "rgb(220 220 220)",
      accent: "rgb(200 200 200)",
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
    text: {
      accent: "#1a73e8",
    },
    background: {
      border: "#fff",
      shadow: "#40404047",
      hover: "#fffffffe",
      focus: "#bcbcbc",
    },
  },
});

export function useTheme() {
  const [theme, setTheme] = useState(darkTheme);

  const handleSwitchTheme = () => {
    if (theme.palette.mode === "light") {
      localStorage.setItem("theme", "dark");
      setTheme(darkTheme);
    } else {
      localStorage.setItem("theme", "light");
      setTheme(lightTheme);
    }
  };

  lightTheme.switchTheme = handleSwitchTheme;
  darkTheme.switchTheme = handleSwitchTheme;
  // need to get current theme - if any -
  // from client-side local storage
  useEffect(() => {
    const themeOnStorage = localStorage.getItem("theme");
    if (typeof themeOnStorage === null) {
      localStorage.setItem("theme", "light");
    }
    if (themeOnStorage === "dark") {
      setTheme(darkTheme);
    } else {
      setTheme(lightTheme);
    }
  }, []);

  return [theme];
}

export function GlobalCSS(props) {
  return (
    <Global
      styles={css`
        html {
          background: ${props.theme.palette.background.default};
          transition: all 0.3s;
        }
        body {
          margin: 0;
        }
      `}
    />
  );
}
