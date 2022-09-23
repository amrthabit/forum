import { dedupExchange, fetchExchange } from "@urql/core";
import { cacheExchange } from "@urql/exchange-graphcache";
import { MeDocument } from "../src/generated/graphql";
// toto: be more specific with the invalidation
// or use the cacheExchange's updateQuery
function updateQuery(cache, qi, result, fun) {
  return cache.updateQuery(qi, (data) => fun(result, data));
}

function invalidateAllComments(cache) {
  for (let queryName of [
    "getCommentChildren",
    "getPostTopLevelComments",
    "getPostTopComment",
    "getUserVoteOnComment",
    "getCommentVotes",
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
  for (let queryName of [
    "getUserVoteOnComment",
    "getCommentVotes",
    "getCommentScore",
  ]) {
    const allFields = cache.inspectFields("Query");
    const fieldInfos = allFields.filter((info) => info.fieldName === queryName);
    fieldInfos.forEach((fi) => {
      cache.invalidate("Query", queryName, fi.arguments || {});
    });
  }
}

function invalidatePostVotes(cache) {
  for (let queryName of ["getUserVoteOnPost", "getPostVotes", "getPostScore"]) {
    const allFields = cache.inspectFields("Query");
    const fieldInfos = allFields.filter((info) => info.fieldName === queryName);
    fieldInfos.forEach((fi) => {
      cache.invalidate("Query", queryName, fi.arguments || {});
    });
  }
}
const serverURL =
  process.env.NODE_ENV === "sdf"
    ? "https://xo.amrthabit.com/api/graphql"
    : "http://localhost:4000/graphql";

export const createUrqlClient = (ssrExchange) => ({
  url: serverURL,
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

          removeCommentVote: (_result, args, cache, info) => {
            invalidateCommentVotes(cache);
          },

          castVote: (_result, args, cache, info) => {
            invalidatePostVotes(cache);
          },

          changeVote: (_result, args, cache, info) => {
            invalidatePostVotes(cache);
          },

          removeVote: (_result, args, cache, info) => {
            invalidatePostVotes(cache);
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
            invalidateAllPosts(cache);
            invalidateAllPosteds(cache);
            invalidateAllComments(cache);
            invalidatePostVotes(cache);
            invalidateCommentVotes(cache);
            
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
