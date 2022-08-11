
import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "rgb(200 200 200)",
      contrastText: "rgb(0 0 0)",
    },
    background: {
      paper: "rgb(18, 18, 18)",
      border: "rgb(18, 18, 18)",
      shadow: "#000000ff",
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

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    text: {
      accent: "#1a73e8",
    },
    background: {
      border: "#fff",
      shadow: "#40404074",
    },
  },
});

