import { withUrqlClient } from "next-urql";
import LoginForm from "../comps/loginForm";
import { createUrqlClient } from "../utils/createUrqlClient";

function Login(props) {
  return <LoginForm {...props} />;
}

export default withUrqlClient(createUrqlClient)(Login);
