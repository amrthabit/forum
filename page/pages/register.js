import { withUrqlClient } from "next-urql";
import RegisterForm from "../comps/registerForm";
import { createUrqlClient } from "../utils/createUrqlClient";

function Register(props) {
  return <RegisterForm {...props} />;
}

export default withUrqlClient(createUrqlClient)(Register);
