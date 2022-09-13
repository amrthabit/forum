import { cacheExchange } from "@urql/exchange-graphcache";
import { dedupExchange, fetchExchange } from "@urql/core";
import {
  MeDocument,
  MeQuery,
  CastVoteDocument,
} from "../src/generated/graphql";

function updateQuery(cache, qi, result, fun) {
  return cache.updateQuery(qi, (data) => fun(result, data));
}

function invalidateAllPosts(cache) {
  const allFields = cache.inspectFields("Query");
  const fieldInfos = allFields.filter((info) => info.fieldName === "comments");
  fieldInfos.forEach((fi) => {
    cache.invalidate("Query", "comments", fi.arguments || {});
  });
}

export const createUrqlClient = (ssrExchange) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      // optimistic: {
      //   createComment(args, cache, info) {
      //     return {
      //       __typename: "Mutation",
      //       id: -1,
      //     };
      //   },
      // },

      updates: {
        Mutation: {
          // castVote: (_result, args, cache, info) => {
          //   cache.invalidate({
          //     __typename: "Vote",
          //     voterID: args.voterID,
          //     postID: args.postID,
          //   });
          // },
          createComment: (_result, args, cache, info) => {
            invalidateAllPosts(cache);
          },

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
