// get mequery 
import { withUrqlClient } from "next-urql";
import { useMeQuery } from "../src/generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

function getMe() {
  const meQuery = useMeQuery();
  return [meQuery];
}

export default withUrqlClient(createUrqlClient)(getMe);