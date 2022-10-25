import { Box } from "@mui/material";
import { useRouter } from "next/router";

export default function ({ clique, theme, ...props }) {
  const router = useRouter();

  return (
    <Box
      key={clique.id}
      component="strong"
      sx={{
        textDecoration: "underline",
        transition: "background 0.15s, text-decoration 0.15s",
        textDecorationColor: "transparent",
        borderRadius: 1,
        ":hover": {
          textDecorationColor: theme.palette.text.primary,
          background: theme.palette.background.hover,
          cursor: "pointer",
        },
        overflow: "hidden",
        width: "fit-content",
      }}
      onClick={() => router.push(`/clique/${clique.cliqueID}`)}
    >
      {clique.cliqueID}
    </Box>
  );
}
