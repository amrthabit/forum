
// todo: use built in function instead
export default function msToString(time) {
  // time passed since post was created in seconds
  const diff = Math.round((new Date() - time) / 1000);
  for (const [duration, unit] of [
    [60 * 60 * 24 * 365, "year"],
    [60 * 60 * 24 * 30, "month"],
    [60 * 60 * 24, "day"],
    [60 * 60, "hour"],
    [60, "minute"],
    [1, "second"],
  ]) {
    if (diff >= duration) {
      return `${Math.floor(diff / duration)} ${unit}${
        Math.floor(diff / duration) > 1 ? "s" : ""
      }`;
    }
  }
  return "";
}
