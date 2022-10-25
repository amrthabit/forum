import { LoadingButton } from "@mui/lab";

export default function SquareButton({ theme, ...props }) {
  return (
    <LoadingButton
      onClick={props.onClick}
      loading={props.loading}
      disableRipple
      sx={{
        margin: 0,
        px: 0.5,
        py:0.3,
        borderRadius: 0,
        minWidth: 0,
        fontWeight: 600,
        transition: `all 0.3s`,
        background: theme.palette.background.default,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.background.default}`,
        borderRadius: 2,
        "&:hover": {
          transition: `all 0s`,
          background: theme.palette.background.hover,
          border: `1px solid ${theme.palette.text.primary}`,
        },
        "&:active": {
          transition: `all 0s`,
          background: theme.palette.background.active,
        },
        textTransform: "none",
        ...props.sx,
      }}
    >
      {props.children}
    </LoadingButton>
  );
}
