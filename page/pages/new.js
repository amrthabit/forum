import Home from "./index";

export default function SortedHome(props) {
  return Home({ ...props, sort: "new" });
}
