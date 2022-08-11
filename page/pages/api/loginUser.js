export default async function loginUser(
  userName,
  password
) {
  console.log(userName);
  console.log(password);
  await new Promise((_) => setTimeout(_, 500));
  return false;
}
