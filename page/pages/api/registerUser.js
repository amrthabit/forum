
export default async function registerUser(
  firstName,
  lastName,
  userName,
  password
) {
  await register({ userName: userName, password: password });

  console.log(firstName);
  console.log(lastName);
  console.log(userName);
  console.log(password);
  await new Promise((_) => setTimeout(_, 500));
  return (<></>)
  return true;

}
