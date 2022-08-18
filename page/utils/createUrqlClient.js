import { cacheExchange } from "@urql/exchange-graphcache";
import { dedupExchange, fetchExchange } from "@urql/core";
import { MeDocument, MeQuery } from "../src/generated/graphql";

function updateQuery(cache, qi, result, fun) {
  return cache.updateQuery(qi, (data) => fun(result, data));
}

export const createUrqlClient = (ssrExchange) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          logout: (_result, args, cache, info) => {
            updateQuery(cache, { query: MeDocument }, _result, () => ({
              me: null,
            }));
          },

          login: (_result, args, cache, info) => {
            updateQuery(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
          },
          register: (_result, args, cache, info) => {
            updateQuery(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
});
