import { createTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { Global, css } from "@emotion/react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ffdac5",
      contrastText: "rgb(0 0 0)",
    },
    background: {
      default: "#171717",
      paper: "rgb(30, 30, 30)",
      border: "rgb(81, 81, 81)",
      shadow: "#0c0c0cff",
      hover: "#444444ff",
      focus: "#bcbcbc",
      commentArea: "#292828",
      myCommentArea: "#414141",
      active: "#bcbcbc",
    },
    action: {
      selected: "rgb(200 0 0)",
    },
    text: {
      primary: "rgb(220 220 220)",
      accent: "#ffdac5",
    },
    scrollbar: {
      track: "#aaaaaa",
      thumb: "#868686",
      thumbhover: "#a5a5a5",
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    primary: {
      main: "#004299",
    },
    mode: "light",
    text: {
      primary: "rgb(0 0 0)",
      accent: "#004299",
    },
    background: {
      default: "#f5f5f5",
      border: "#dadada",
      paper: "#fcfcfc",
      shadow: "#40404047",
      hover: "#dce0e5fe",
      focus: "#757575",
      commentArea: "#ebebeb",
      myCommentArea: "#d6d6d6",
      active: "#4c4c4c",
    },
    scrollbar: {
      track: "#dbdbdb",
      thumb: "#868686",
      thumbhover: "#7b7b7b",
    },
  },
  other: darkTheme,
});

darkTheme.other = lightTheme;

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

export function GlobalCSS({ theme, ...props }) {
  return (
    <Global
      styles={css`
        html {
          background: ${theme.palette.background.default};
          transition: all 0.3s;
          scrollbar-color: #666 #201c29;
          overflow-y: scroll;
        }
        body {
          margin: 0;
          border-color: rgba(0, 0, 0, 0.1);
          transition: border-color 0.3s linear;
        }

        // workaround to add transition to scrollbar
        ::-webkit-scrollbar,
        ::-webkit-scrollbar-thumb,
        ::-webkit-scrollbar-corner {
          /* add border to act as background-color */
          border-right-style: inset;
          /* sum viewport dimensions to guarantee border will fill scrollbar */
          border-right-width: calc(100vw + 100vh);
          /* inherit border-color to inherit transitions */
          border-color: inherit;
        }

        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          border-color: ${theme.palette.scrollbar.track};
        }

        ::-webkit-scrollbar-thumb {
          border-color: ${theme.palette.scrollbar.thumb};
        }

        ::-webkit-scrollbar-thumb:hover {
          border-color: ${theme.palette.scrollbar.thumbhover};
        }
      `}
    />
  );
}
