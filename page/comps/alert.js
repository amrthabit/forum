import { Alert as MuiAlert, AlertTitle } from "@mui/material";

export default function Alert(props) {
  const displaySize = props.displaySize;
  return (
    <MuiAlert
      style={{
        zIndex: "-1",
        paddingTop: 0,
        height: 30,
        scroll: "false",
        width: `calc(100% - ${
          displaySize === `xs` ? "70" : displaySize === "sm" ? "130" : "70"
        }px)`,
        margin: "auto",
        // marginTop: -10,
        paddingTop: ["xs", "sm"].includes(displaySize) ? 0 : 5,
        transform: `translateY(${
          ["xs", "sm"].includes(displaySize) ? "0" : "-5"
        }px)`,
        // height: ["xs", "sm"].includes(displaySize) ? 30 : 30,
        transition: "all 0.3s ease-in-out",
      }}
      severity={props.severity}
    >
      <AlertTitle style={{ height: 0 }}>{props.message}</AlertTitle>
    </MuiAlert>
  );
}
