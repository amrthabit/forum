import {useMeQuery} from "../src/generated/graphql";

export default function Test() {
  const  [{ data, fetching, error }] = useMeQuery();
  console.log(data)
  return (

    <div>
      <h1>{data} {fetching}</h1>
    </div>
  );
}