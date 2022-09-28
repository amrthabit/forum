import Submit from "../submit";

export default function SubmitImage(props) {
  return Submit({ ...props, currentPostType: "image" });
}
