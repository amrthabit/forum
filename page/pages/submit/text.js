import Submit from "../submit";

export default function SubmitText(props) {
  return Submit({ ...props, currentPostType: "text" });
}