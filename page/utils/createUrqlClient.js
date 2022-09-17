import { dedupExchange, fetchExchange } from "@urql/core";
import { cacheExchange } from "@urql/exchange-graphcache";
import { MeDocument } from "../src/generated/graphql";

function updateQuery(cache, qi, result, fun) {
  return cache.updateQuery(qi, (data) => fun(result, data));
}

function invalidateAllComments(cache) {
  for (let queryName of [
    "getCommentChildren",
    "getPostTopLevelComments",
    "getPostTopComment",
  ]) {
    const allFields = cache.inspectFields("Query");
    const fieldInfos = allFields.filter((info) => info.fieldName === queryName);
    fieldInfos.forEach((fi) => {
      cache.invalidate("Query", queryName, fi.arguments || {});
    });
  }
}

function invalidateAllPosts(cache) {
  for (let queryName of ["getPosts"]) {
    const allFields = cache.inspectFields("Query");
    const fieldInfos = allFields.filter((info) => info.fieldName === queryName);
    fieldInfos.forEach((fi) => {
      cache.invalidate("Query", fi.fieldName);
    });
  }
}

function invalidateAllPosteds(cache) {
  for (let queryName of ["getUserPosteds"]) {
    const allFields = cache.inspectFields("Query");
    const fieldInfos = allFields.filter((info) => info.fieldName === queryName);
    fieldInfos.forEach((fi) => {
      cache.invalidate("Query", queryName, fi.arguments || {});
    });
  }
}

function invalidateCommentVotes(cache) {
  for (let queryName of ["getUserVoteOnComment", "getCommentVotes"]) {
    const allFields = cache.inspectFields("Query");
    const fieldInfos = allFields.filter((info) => info.fieldName === queryName);
    fieldInfos.forEach((fi) => {
      cache.invalidate("Query", queryName, fi.arguments || {});
    });
  }
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
          castCommentVote: (_result, args, cache, info) => {
            invalidateCommentVotes(cache);
          },

          changeCommentVote: (_result, args, cache, info) => {
            invalidateCommentVotes(cache);
          },

          RemoveCommentVote: (_result, args, cache, info) => {
            invalidateCommentVotes(cache);
          },

          createComment: (_result, args, cache, info) => {
            invalidateAllComments(cache);
          },

          createPost: (_result, args, cache, info) => {
            invalidateAllPosts(cache);
          },

          createPosted: (_result, args, cache, info) => {
            invalidateAllPosteds(cache);
          },

          deletePost: (_result, args, cache, info) => {
            invalidateAllPosts(cache);
            invalidateAllPosteds(cache);
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
