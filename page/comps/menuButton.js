import Button from "@mui/material/Button";
import { useState } from "react";

export default function MenuButton({ children, theme, sx, ...props }) {
  // css's `:active` selector doesn't include keyboard's interactions
  // check https://github.com/w3c/csswg-drafts/issues/4787 for fix
  // for now we'll have to use onKeyDown and set a state

  const [keyDown, setKeyDown] = useState(false);
  const handleKeyUp = (e) => {
    if ([" ", "Enter"].includes(e.key)) {
      setKeyDown(false);
    }
  };

  return (
    <Button
      disableRipple
      onKeyDown={(e) => {
        [" ", "Enter"].includes(e.key) && setKeyDown(true);
      }}
      onKeyUp={handleKeyUp}
      onBlur={handleKeyUp}
      sx={{
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: keyDown ? theme.palette.primary.main : "transparent",
        transition: keyDown ? "all 0s" : "all 0.3s",
        color: theme.palette.text.primary,

        whiteSpace: "nowrap",
        ":hover, :focus-visible": {
          background: theme.palette.background.hover,
          borderColor: theme.palette.text.primary,
        },
        ":active": {
          transition: "all 0s",
          background: theme.palette.background.focus,
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
