import "../styles/globals.css";

import { createClient, Provider } from "urql";

const client = createClient({
  url: "http://localhost:4000/graphql",

  fetchOptions: {
    credentials: "include",
  },
}); 

function MyApp({ Component, pageProps }) {
  return (
    <Provider value={client}>
      {" "}
      <Component {...pageProps} />{" "}
    </Provider>
  );
}

export default MyApp;
