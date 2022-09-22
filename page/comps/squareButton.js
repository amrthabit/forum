import { LoadingButton } from "@mui/lab";

export default function SquareButton({ theme, ...props }) {
  return (
    <LoadingButton
      onClick={props.onClick}
      loading={props.loading}
      disableRipple
      sx={{
        margin: 0,
        padding: 0,
        borderRadius: 0,
        minWidth: 0,
        fontSize: 13,
        fontWeight: 600,
        opacity: props.interacting || props.replying ? 1 : 0,
        height: props.replying ? 40 : 17,
        transition: `height 0.2s ease-in-out ${
          props.replying ? "0s" : "0.3s"
        }, line-height 0.2s ease-in-out ${
          props.replying ? "0s" : "0.3s"
        }, background 0.3s, color 0.3s, border-color 0.3s, width 0.3s, opacity 0.1s`,
        zIndex: 2,
        background: theme.palette.background.default,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.background.default}`,
        "&:hover": {
          transition: `height 0.2s ease-in-out ${
            props.replying ? "0s" : "0.3s"
          }, height 0.2s ease-in-out ${
            props.replying ? "0s" : "0.3s"
          }, background 0.15s, border 0.1s, width 0.3s`,
          background: theme.palette.background.hover,
          border: `1px solid ${theme.palette.text.primary}`,
        },
        "&:active": {
          transition: `height 0.2s ease-in-out ${
            props.replying ? "0s" : "0.3s"
          }, height 0.2s ease-in-out ${
            props.replying ? "0s" : "0.3s"
          }, background 0s, width 0.3s`,
          background: theme.palette.background.active,
        },
        // overflow: "hidden",
        textTransform: "none",
        ...props.sx,
      }}
    >
      {props.children}
    </LoadingButton>
  );
}
