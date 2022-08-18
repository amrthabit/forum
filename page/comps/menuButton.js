import Button from "@mui/material/Button";
import { useState } from "react";

export default function MenuButton({ children, theme, ...props }) {
  // css's `:active` selector doesn't include keyboard's interactions
  // check https://github.com/w3c/csswg-drafts/issues/4787 for fix
  // for now we'll have to use onKeyDown

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
        transition: keyDown ? "all 0.05s" : "all 0.3s",
        color: theme.palette.text.primary,
        fontFamily: "inherit",
        whiteSpace: "nowrap",
        ":hover, :focus-visible": {
          background: theme.palette.background.hover,
          boxShadow: `0px ${keyDown ? "1px 3px" : "4px 10px"} ${theme.palette.background.shadow}`,
          transform: keyDown ? "translateY(0.5px)" : "translateY(-1px)",
          scale: "1.04",
          mx: 0.2,
        },
        ":active": {
          transition: "all 0.05s",
          boxShadow: `0px 1px 3px ${theme.palette.background.shadow}`,
          transform: "translateY(0.5px)",
        },
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
