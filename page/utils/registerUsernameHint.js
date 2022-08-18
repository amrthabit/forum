export default function usernameHint(username) {
  if (username.length < 2) {
    return "Enter your username";
  } else if (!/^[A-Za-z]$/.test(username.charAt(0))) {
    return "Username must start with a letter";
  } else if (/^.* .*$/.test(username)) {
    return "No spaces allowed";
  } else if (!/^[A-Za-z_\d]*$/.test(username)) {
    return "The only symbol you can use is underscore";
  } else "Username must be alphanumeric";
}
