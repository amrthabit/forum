export default function compact(number) {
  return Intl.NumberFormat("en-GB", {
    notation: "compact",
    compactDisplay: "short",
  }).format(number);
}
