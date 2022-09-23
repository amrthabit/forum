export default function isServer() {
  typeof window === "undefined";
}
