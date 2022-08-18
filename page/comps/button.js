import { Collapse } from "@mui/material";
import { LoadingButton as MuiButton } from "@mui/lab";
import { TransitionGroup } from "react-transition-group";

export default function Button(props) {
  return (
    <MuiButton
      variant="contained"
      sx={{ mt: 1 }}
      style={{
        marginTop: 15,
        marginLeft: "auto",
        width: 140,
        transition: "all 0.3s",
      }}
      disabled={props.buttonStatus !== "enabled"}
      color={props.color}
      onClick={props.onClick}
      loading={props.buttonStatus === "sending"}
      loadingPosition="end"
      endIcon={<></>}
    >
      <TransitionGroup
        style={{
          fontSize: 16,
          margin: -3,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Collapse orientation="horizontal">{props.text}</Collapse>
        {/* {props.buttonStatus === "sending" && (
          <Collapse orientation="horizontal">
            Registering
          </Collapse>
        )} */}
        {/* todo!: fix this vvv */}
        {props.lastSend === "warning" && (
          <Collapse component="span" orientation="horizontal">
            &nbsp;Anyway
          </Collapse>
        )}
      </TransitionGroup>
    </MuiButton>
  );
}
