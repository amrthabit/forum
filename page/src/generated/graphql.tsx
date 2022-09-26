import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Comment = {
  __typename?: 'Comment';
  commenterID: Scalars['Float'];
  content: Scalars['String'];
  createdAt: Scalars['String'];
  downvoteCount: Scalars['Float'];
  id: Scalars['Float'];
  isDeleted: Scalars['Boolean'];
  level: Scalars['Float'];
  parentCommentID?: Maybe<Scalars['Float']>;
  rootPostID: Scalars['Float'];
  updatedAt: Scalars['String'];
  upvoteCount: Scalars['Float'];
  viewCount: Scalars['Float'];
};

export type CommentVote = {
  __typename?: 'CommentVote';
  commentID: Scalars['Float'];
  id: Scalars['Float'];
  voteType: Scalars['Float'];
  voterID: Scalars['Float'];
};

export type LoginStatus = {
  __typename?: 'LoginStatus';
  message: Scalars['String'];
  status: Scalars['String'];
  user?: Maybe<User>;
};

export type Mutation = {
  __typename?: 'Mutation';
  castCommentVote: Scalars['Boolean'];
  castVote: Scalars['Boolean'];
  changeCommentVote: Scalars['Boolean'];
  changeVote: Scalars['Boolean'];
  createComment: Comment;
  createPost: Post;
  createPosted: Scalars['Boolean'];
  deleteAllComments: Scalars['Boolean'];
  deleteAllPosteds: Array<Posted>;
  deleteAllPosts: Scalars['Boolean'];
  deleteAllUsers: Array<User>;
  deleteComment: Scalars['Boolean'];
  deletePost: Scalars['Boolean'];
  deletePosted: Scalars['Boolean'];
  deleteUser: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  login: LoginStatus;
  logout: Scalars['Boolean'];
  register: LoginStatus;
  removeCommentVote: Scalars['Boolean'];
  removeVote: Scalars['Boolean'];
  updatePost?: Maybe<Post>;
  updateUser?: Maybe<User>;
  viewPost: Scalars['Boolean'];
};


export type MutationCastCommentVoteArgs = {
  commentID: Scalars['Int'];
  voteType: Scalars['Int'];
  voterID: Scalars['Int'];
};


export type MutationCastVoteArgs = {
  postID: Scalars['Int'];
  voteType: Scalars['Int'];
  voterID: Scalars['Int'];
};


export type MutationChangeCommentVoteArgs = {
  commentID: Scalars['Int'];
  voteType: Scalars['Int'];
  voterID: Scalars['Int'];
};


export type MutationChangeVoteArgs = {
  postID: Scalars['Int'];
  voteType: Scalars['Int'];
  voterID: Scalars['Int'];
};


export type MutationCreateCommentArgs = {
  commenterID: Scalars['Float'];
  content: Scalars['String'];
  parentCommentID: Scalars['Int'];
  rootPostID: Scalars['Float'];
};


export type MutationCreatePostArgs = {
  content: Scalars['String'];
  posterID: Scalars['Float'];
  title: Scalars['String'];
};


export type MutationCreatePostedArgs = {
  postID: Scalars['Float'];
  posterID: Scalars['Float'];
};


export type MutationDeleteCommentArgs = {
  id: Scalars['Float'];
};


export type MutationDeletePostArgs = {
  id: Scalars['Float'];
};


export type MutationDeletePostedArgs = {
  postedID: Scalars['Float'];
};


export type MutationDeleteUserArgs = {
  userID: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  userID: Scalars['String'];
  userPassword: Scalars['String'];
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  userID: Scalars['String'];
};


export type MutationRemoveCommentVoteArgs = {
  commentID: Scalars['Int'];
  voterID: Scalars['Int'];
};


export type MutationRemoveVoteArgs = {
  postID: Scalars['Int'];
  voterID: Scalars['Int'];
};


export type MutationUpdatePostArgs = {
  id: Scalars['Float'];
  newTitle?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateUserArgs = {
  updatedEmail: Scalars['String'];
  updatedUserID: Scalars['String'];
  updatedUserPassword: Scalars['String'];
  userID: Scalars['String'];
};


export type MutationViewPostArgs = {
  postID: Scalars['Int'];
};

export type Post = {
  __typename?: 'Post';
  content: Scalars['String'];
  createdAt: Scalars['String'];
  downvoteCount: Scalars['Float'];
  id: Scalars['Float'];
  posterID: Scalars['Float'];
  title: Scalars['String'];
  updatedAt: Scalars['String'];
  upvoteCount: Scalars['Float'];
  viewCount: Scalars['Float'];
};

export type Posted = {
  __typename?: 'Posted';
  id: Scalars['Float'];
  postID: Scalars['Float'];
  posterID: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  comment?: Maybe<Comment>;
  comments: Array<Comment>;
  getAllCommentVotes: Array<CommentVote>;
  getAllVotes: Array<Vote>;
  getCommentChildren: Array<Comment>;
  getCommentScore: Scalars['Int'];
  getCommentVotes: Array<CommentVote>;
  getPostScore: Scalars['Int'];
  getPostTopComment?: Maybe<Comment>;
  getPostTopLevelComments: Array<Comment>;
  getPostViews?: Maybe<Scalars['Int']>;
  getPostVotes: Array<Vote>;
  getPosts: Array<Post>;
  getUserCommentVotes: Array<CommentVote>;
  getUserFromUsername?: Maybe<User>;
  getUserPosteds: Array<Post>;
  getUserVoteOnComment?: Maybe<CommentVote>;
  getUserVoteOnPost?: Maybe<Vote>;
  getUserVotes: Array<Vote>;
  hello: Scalars['String'];
  me?: Maybe<User>;
  post?: Maybe<Post>;
  posted?: Maybe<Posted>;
  posteds: Array<Posted>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QueryCommentArgs = {
  id: Scalars['Int'];
};


export type QueryGetCommentChildrenArgs = {
  commentID: Scalars['Float'];
};


export type QueryGetCommentScoreArgs = {
  commentID: Scalars['Int'];
};


export type QueryGetCommentVotesArgs = {
  commentID: Scalars['Int'];
};


export type QueryGetPostScoreArgs = {
  postID: Scalars['Int'];
};


export type QueryGetPostTopCommentArgs = {
  postID: Scalars['Float'];
};


export type QueryGetPostTopLevelCommentsArgs = {
  postID: Scalars['Float'];
};


export type QueryGetPostViewsArgs = {
  postID: Scalars['Int'];
};


export type QueryGetPostVotesArgs = {
  postID: Scalars['Int'];
};


export type QueryGetPostsArgs = {
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryGetUserCommentVotesArgs = {
  voterID: Scalars['Int'];
};


export type QueryGetUserFromUsernameArgs = {
  username: Scalars['String'];
};


export type QueryGetUserPostedsArgs = {
  posterID: Scalars['Int'];
};


export type QueryGetUserVoteOnCommentArgs = {
  commentID: Scalars['Int'];
  voterID: Scalars['Int'];
};


export type QueryGetUserVoteOnPostArgs = {
  postID: Scalars['Int'];
  voterID: Scalars['Int'];
};


export type QueryGetUserVotesArgs = {
  voterID: Scalars['Int'];
};


export type QueryPostArgs = {
  id: Scalars['Int'];
};


export type QueryPostedArgs = {
  id: Scalars['Int'];
};


export type QueryUserArgs = {
  id: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['Float'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  updatedAt: Scalars['String'];
  userID: Scalars['String'];
};

export type Vote = {
  __typename?: 'Vote';
  id: Scalars['Float'];
  postID: Scalars['Float'];
  voteType: Scalars['Float'];
  voterID: Scalars['Float'];
};

export type CastCommentVoteMutationVariables = Exact<{
  commentID: Scalars['Int'];
  voterID: Scalars['Int'];
  voteType: Scalars['Int'];
}>;


export type CastCommentVoteMutation = { __typename?: 'Mutation', castCommentVote: boolean };

export type CastVoteMutationVariables = Exact<{
  postID: Scalars['Int'];
  voterID: Scalars['Int'];
  voteType: Scalars['Int'];
}>;


export type CastVoteMutation = { __typename?: 'Mutation', castVote: boolean };

export type ChangeCommentVoteMutationVariables = Exact<{
  commentID: Scalars['Int'];
  voterID: Scalars['Int'];
  voteType: Scalars['Int'];
}>;


export type ChangeCommentVoteMutation = { __typename?: 'Mutation', changeCommentVote: boolean };

export type ChangeVoteMutationVariables = Exact<{
  postID: Scalars['Int'];
  voterID: Scalars['Int'];
  voteType: Scalars['Int'];
}>;


export type ChangeVoteMutation = { __typename?: 'Mutation', changeVote: boolean };

export type CreateCommentMutationVariables = Exact<{
  rootPostID: Scalars['Float'];
  parentCommentID: Scalars['Int'];
  commenterID: Scalars['Float'];
  content: Scalars['String'];
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', createComment: { __typename?: 'Comment', id: number } };

export type CreatePostMutationVariables = Exact<{
  title: Scalars['String'];
  content: Scalars['String'];
  posterID: Scalars['Float'];
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'Post', id: number } };

export type CreatePostedMutationVariables = Exact<{
  postID: Scalars['Float'];
  posterID: Scalars['Float'];
}>;


export type CreatePostedMutation = { __typename?: 'Mutation', createPosted: boolean };

export type DeletePostMutationVariables = Exact<{
  postID: Scalars['Float'];
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: boolean };

export type LoginMutationVariables = Exact<{
  userName: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginStatus', status: string, message: string, user?: { __typename?: 'User', id: number, userID: string } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  userName: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'LoginStatus', status: string, message: string, user?: { __typename?: 'User', id: number, userID: string } | null } };

export type RemoveCommentVoteMutationVariables = Exact<{
  commentID: Scalars['Int'];
  voterID: Scalars['Int'];
}>;


export type RemoveCommentVoteMutation = { __typename?: 'Mutation', removeCommentVote: boolean };

export type RemoveVoteMutationVariables = Exact<{
  postID: Scalars['Int'];
  voterID: Scalars['Int'];
}>;


export type RemoveVoteMutation = { __typename?: 'Mutation', removeVote: boolean };

export type ViewPostMutationVariables = Exact<{
  postID: Scalars['Int'];
}>;


export type ViewPostMutation = { __typename?: 'Mutation', viewPost: boolean };

export type GetCommentByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetCommentByIdQuery = { __typename?: 'Query', comment?: { __typename?: 'Comment', id: number, createdAt: string, updatedAt: string, content: string, commenterID: number, upvoteCount: number, downvoteCount: number, viewCount: number, rootPostID: number, parentCommentID?: number | null, level: number, isDeleted: boolean } | null };

export type GetCommentChildrenQueryVariables = Exact<{
  commentID: Scalars['Float'];
}>;


export type GetCommentChildrenQuery = { __typename?: 'Query', getCommentChildren: Array<{ __typename?: 'Comment', id: number, createdAt: string, updatedAt: string, content: string, commenterID: number, upvoteCount: number, downvoteCount: number, viewCount: number, rootPostID: number, parentCommentID?: number | null, level: number, isDeleted: boolean }> };

export type GetCommentScoreQueryVariables = Exact<{
  commentID: Scalars['Int'];
}>;


export type GetCommentScoreQuery = { __typename?: 'Query', getCommentScore: number };

export type GetCommentVotesQueryVariables = Exact<{
  commentID: Scalars['Int'];
}>;


export type GetCommentVotesQuery = { __typename?: 'Query', getCommentVotes: Array<{ __typename?: 'CommentVote', id: number, voteType: number }> };

export type GetPostQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetPostQuery = { __typename?: 'Query', post?: { __typename?: 'Post', id: number, createdAt: string, updatedAt: string, title: string, content: string, posterID: number, upvoteCount: number, downvoteCount: number, viewCount: number } | null };

export type GetPostScoreQueryVariables = Exact<{
  postID: Scalars['Int'];
}>;


export type GetPostScoreQuery = { __typename?: 'Query', getPostScore: number };

export type GetPostTopCommentQueryVariables = Exact<{
  postID: Scalars['Float'];
}>;


export type GetPostTopCommentQuery = { __typename?: 'Query', getPostTopComment?: { __typename?: 'Comment', id: number, createdAt: string, updatedAt: string, content: string, commenterID: number, upvoteCount: number, downvoteCount: number, viewCount: number, rootPostID: number, parentCommentID?: number | null, level: number, isDeleted: boolean } | null };

export type GetPostTopLevelCommentsQueryVariables = Exact<{
  postID: Scalars['Float'];
}>;


export type GetPostTopLevelCommentsQuery = { __typename?: 'Query', getPostTopLevelComments: Array<{ __typename?: 'Comment', id: number, createdAt: string, updatedAt: string, content: string, commenterID: number, upvoteCount: number, downvoteCount: number, viewCount: number, rootPostID: number, parentCommentID?: number | null, level: number, isDeleted: boolean }> };

export type GetPostViewsQueryVariables = Exact<{
  postID: Scalars['Int'];
}>;


export type GetPostViewsQuery = { __typename?: 'Query', getPostViews?: number | null };

export type GetPostVotesQueryVariables = Exact<{
  postID: Scalars['Int'];
}>;


export type GetPostVotesQuery = { __typename?: 'Query', getPostVotes: Array<{ __typename?: 'Vote', id: number, voteType: number }> };

export type GetPostsQueryVariables = Exact<{
  sort: Scalars['String'];
}>;


export type GetPostsQuery = { __typename?: 'Query', getPosts: Array<{ __typename?: 'Post', id: number, title: string, content: string, posterID: number, upvoteCount: number, downvoteCount: number, viewCount: number, createdAt: string, updatedAt: string }> };

export type GetUserCommentVotesQueryVariables = Exact<{
  voterID: Scalars['Int'];
}>;


export type GetUserCommentVotesQuery = { __typename?: 'Query', getUserCommentVotes: Array<{ __typename?: 'CommentVote', id: number, voteType: number }> };

export type GetUserFromUsernameQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type GetUserFromUsernameQuery = { __typename?: 'Query', getUserFromUsername?: { __typename?: 'User', id: number, userID: string, firstName: string, lastName: string, createdAt: string } | null };

export type GetUserPostedsQueryVariables = Exact<{
  posterID: Scalars['Int'];
}>;


export type GetUserPostedsQuery = { __typename?: 'Query', getUserPosteds: Array<{ __typename?: 'Post', id: number, title: string, content: string, posterID: number, upvoteCount: number, downvoteCount: number, viewCount: number, createdAt: string, updatedAt: string }> };

export type GetUserVoteOnCommentQueryVariables = Exact<{
  commentID: Scalars['Int'];
  voterID: Scalars['Int'];
}>;


export type GetUserVoteOnCommentQuery = { __typename?: 'Query', getUserVoteOnComment?: { __typename?: 'CommentVote', id: number, voteType: number } | null };

export type GetUserVoteOnPostQueryVariables = Exact<{
  postID: Scalars['Int'];
  voterID: Scalars['Int'];
}>;


export type GetUserVoteOnPostQuery = { __typename?: 'Query', getUserVoteOnPost?: { __typename?: 'Vote', id: number, voteType: number } | null };

export type GetUserVotesQueryVariables = Exact<{
  voterID: Scalars['Int'];
}>;


export type GetUserVotesQuery = { __typename?: 'Query', getUserVotes: Array<{ __typename?: 'Vote', id: number, voteType: number }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, userID: string } | null };

export type UserQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type UserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: number, userID: string, firstName: string, lastName: string, createdAt: string } | null };


export const CastCommentVoteDocument = gql`
    mutation CastCommentVote($commentID: Int!, $voterID: Int!, $voteType: Int!) {
  castCommentVote(commentID: $commentID, voterID: $voterID, voteType: $voteType)
}
    `;

export function useCastCommentVoteMutation() {
  return Urql.useMutation<CastCommentVoteMutation, CastCommentVoteMutationVariables>(CastCommentVoteDocument);
};
export const CastVoteDocument = gql`
    mutation CastVote($postID: Int!, $voterID: Int!, $voteType: Int!) {
  castVote(postID: $postID, voterID: $voterID, voteType: $voteType)
}
    `;

export function useCastVoteMutation() {
  return Urql.useMutation<CastVoteMutation, CastVoteMutationVariables>(CastVoteDocument);
};
export const ChangeCommentVoteDocument = gql`
    mutation ChangeCommentVote($commentID: Int!, $voterID: Int!, $voteType: Int!) {
  changeCommentVote(commentID: $commentID, voterID: $voterID, voteType: $voteType)
}
    `;

export function useChangeCommentVoteMutation() {
  return Urql.useMutation<ChangeCommentVoteMutation, ChangeCommentVoteMutationVariables>(ChangeCommentVoteDocument);
};
export const ChangeVoteDocument = gql`
    mutation ChangeVote($postID: Int!, $voterID: Int!, $voteType: Int!) {
  changeVote(postID: $postID, voterID: $voterID, voteType: $voteType)
}
    `;

export function useChangeVoteMutation() {
  return Urql.useMutation<ChangeVoteMutation, ChangeVoteMutationVariables>(ChangeVoteDocument);
};
export const CreateCommentDocument = gql`
    mutation CreateComment($rootPostID: Float!, $parentCommentID: Int!, $commenterID: Float!, $content: String!) {
  createComment(
    rootPostID: $rootPostID
    parentCommentID: $parentCommentID
    commenterID: $commenterID
    content: $content
  ) {
    id
  }
}
    `;

export function useCreateCommentMutation() {
  return Urql.useMutation<CreateCommentMutation, CreateCommentMutationVariables>(CreateCommentDocument);
};
export const CreatePostDocument = gql`
    mutation CreatePost($title: String!, $content: String!, $posterID: Float!) {
  createPost(title: $title, content: $content, posterID: $posterID) {
    id
  }
}
    `;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const CreatePostedDocument = gql`
    mutation CreatePosted($postID: Float!, $posterID: Float!) {
  createPosted(postID: $postID, posterID: $posterID)
}
    `;

export function useCreatePostedMutation() {
  return Urql.useMutation<CreatePostedMutation, CreatePostedMutationVariables>(CreatePostedDocument);
};
export const DeletePostDocument = gql`
    mutation DeletePost($postID: Float!) {
  deletePost(id: $postID)
}
    `;

export function useDeletePostMutation() {
  return Urql.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument);
};
export const LoginDocument = gql`
    mutation Login($userName: String!, $password: String!) {
  login(userID: $userName, userPassword: $password) {
    status
    message
    user {
      id
      userID
    }
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($firstName: String!, $lastName: String!, $userName: String!, $email: String!, $password: String!) {
  register(
    userID: $userName
    email: $email
    password: $password
    firstName: $firstName
    lastName: $lastName
  ) {
    status
    message
    user {
      id
      userID
    }
  }
}
    `;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const RemoveCommentVoteDocument = gql`
    mutation RemoveCommentVote($commentID: Int!, $voterID: Int!) {
  removeCommentVote(commentID: $commentID, voterID: $voterID)
}
    `;

export function useRemoveCommentVoteMutation() {
  return Urql.useMutation<RemoveCommentVoteMutation, RemoveCommentVoteMutationVariables>(RemoveCommentVoteDocument);
};
export const RemoveVoteDocument = gql`
    mutation RemoveVote($postID: Int!, $voterID: Int!) {
  removeVote(postID: $postID, voterID: $voterID)
}
    `;

export function useRemoveVoteMutation() {
  return Urql.useMutation<RemoveVoteMutation, RemoveVoteMutationVariables>(RemoveVoteDocument);
};
export const ViewPostDocument = gql`
    mutation ViewPost($postID: Int!) {
  viewPost(postID: $postID)
}
    `;

export function useViewPostMutation() {
  return Urql.useMutation<ViewPostMutation, ViewPostMutationVariables>(ViewPostDocument);
};
export const GetCommentByIdDocument = gql`
    query GetCommentByID($id: Int!) {
  comment(id: $id) {
    id
    createdAt
    updatedAt
    content
    commenterID
    upvoteCount
    downvoteCount
    viewCount
    rootPostID
    parentCommentID
    level
    isDeleted
  }
}
    `;

export function useGetCommentByIdQuery(options: Omit<Urql.UseQueryArgs<GetCommentByIdQueryVariables>, 'query'>) {
  return Urql.useQuery<GetCommentByIdQuery, GetCommentByIdQueryVariables>({ query: GetCommentByIdDocument, ...options });
};
export const GetCommentChildrenDocument = gql`
    query GetCommentChildren($commentID: Float!) {
  getCommentChildren(commentID: $commentID) {
    id
    createdAt
    updatedAt
    content
    commenterID
    upvoteCount
    downvoteCount
    viewCount
    rootPostID
    parentCommentID
    level
    isDeleted
  }
}
    `;

export function useGetCommentChildrenQuery(options: Omit<Urql.UseQueryArgs<GetCommentChildrenQueryVariables>, 'query'>) {
  return Urql.useQuery<GetCommentChildrenQuery, GetCommentChildrenQueryVariables>({ query: GetCommentChildrenDocument, ...options });
};
export const GetCommentScoreDocument = gql`
    query GetCommentScore($commentID: Int!) {
  getCommentScore(commentID: $commentID)
}
    `;

export function useGetCommentScoreQuery(options: Omit<Urql.UseQueryArgs<GetCommentScoreQueryVariables>, 'query'>) {
  return Urql.useQuery<GetCommentScoreQuery, GetCommentScoreQueryVariables>({ query: GetCommentScoreDocument, ...options });
};
export const GetCommentVotesDocument = gql`
    query GetCommentVotes($commentID: Int!) {
  getCommentVotes(commentID: $commentID) {
    id
    voteType
  }
}
    `;

export function useGetCommentVotesQuery(options: Omit<Urql.UseQueryArgs<GetCommentVotesQueryVariables>, 'query'>) {
  return Urql.useQuery<GetCommentVotesQuery, GetCommentVotesQueryVariables>({ query: GetCommentVotesDocument, ...options });
};
export const GetPostDocument = gql`
    query GetPost($id: Int!) {
  post(id: $id) {
    id
    createdAt
    updatedAt
    title
    content
    posterID
    upvoteCount
    downvoteCount
    viewCount
  }
}
    `;

export function useGetPostQuery(options: Omit<Urql.UseQueryArgs<GetPostQueryVariables>, 'query'>) {
  return Urql.useQuery<GetPostQuery, GetPostQueryVariables>({ query: GetPostDocument, ...options });
};
export const GetPostScoreDocument = gql`
    query GetPostScore($postID: Int!) {
  getPostScore(postID: $postID)
}
    `;

export function useGetPostScoreQuery(options: Omit<Urql.UseQueryArgs<GetPostScoreQueryVariables>, 'query'>) {
  return Urql.useQuery<GetPostScoreQuery, GetPostScoreQueryVariables>({ query: GetPostScoreDocument, ...options });
};
export const GetPostTopCommentDocument = gql`
    query GetPostTopComment($postID: Float!) {
  getPostTopComment(postID: $postID) {
    id
    createdAt
    updatedAt
    content
    commenterID
    upvoteCount
    downvoteCount
    viewCount
    rootPostID
    parentCommentID
    level
    isDeleted
  }
}
    `;

export function useGetPostTopCommentQuery(options: Omit<Urql.UseQueryArgs<GetPostTopCommentQueryVariables>, 'query'>) {
  return Urql.useQuery<GetPostTopCommentQuery, GetPostTopCommentQueryVariables>({ query: GetPostTopCommentDocument, ...options });
};
export const GetPostTopLevelCommentsDocument = gql`
    query GetPostTopLevelComments($postID: Float!) {
  getPostTopLevelComments(postID: $postID) {
    id
    createdAt
    updatedAt
    content
    commenterID
    upvoteCount
    downvoteCount
    viewCount
    rootPostID
    parentCommentID
    level
    isDeleted
  }
}
    `;

export function useGetPostTopLevelCommentsQuery(options: Omit<Urql.UseQueryArgs<GetPostTopLevelCommentsQueryVariables>, 'query'>) {
  return Urql.useQuery<GetPostTopLevelCommentsQuery, GetPostTopLevelCommentsQueryVariables>({ query: GetPostTopLevelCommentsDocument, ...options });
};
export const GetPostViewsDocument = gql`
    query GetPostViews($postID: Int!) {
  getPostViews(postID: $postID)
}
    `;

export function useGetPostViewsQuery(options: Omit<Urql.UseQueryArgs<GetPostViewsQueryVariables>, 'query'>) {
  return Urql.useQuery<GetPostViewsQuery, GetPostViewsQueryVariables>({ query: GetPostViewsDocument, ...options });
};
export const GetPostVotesDocument = gql`
    query GetPostVotes($postID: Int!) {
  getPostVotes(postID: $postID) {
    id
    voteType
  }
}
    `;

export function useGetPostVotesQuery(options: Omit<Urql.UseQueryArgs<GetPostVotesQueryVariables>, 'query'>) {
  return Urql.useQuery<GetPostVotesQuery, GetPostVotesQueryVariables>({ query: GetPostVotesDocument, ...options });
};
export const GetPostsDocument = gql`
    query GetPosts($sort: String!) {
  getPosts(sort: $sort) {
    id
    title
    content
    posterID
    upvoteCount
    downvoteCount
    viewCount
    createdAt
    updatedAt
  }
}
    `;

export function useGetPostsQuery(options: Omit<Urql.UseQueryArgs<GetPostsQueryVariables>, 'query'>) {
  return Urql.useQuery<GetPostsQuery, GetPostsQueryVariables>({ query: GetPostsDocument, ...options });
};
export const GetUserCommentVotesDocument = gql`
    query GetUserCommentVotes($voterID: Int!) {
  getUserCommentVotes(voterID: $voterID) {
    id
    voteType
  }
}
    `;

export function useGetUserCommentVotesQuery(options: Omit<Urql.UseQueryArgs<GetUserCommentVotesQueryVariables>, 'query'>) {
  return Urql.useQuery<GetUserCommentVotesQuery, GetUserCommentVotesQueryVariables>({ query: GetUserCommentVotesDocument, ...options });
};
export const GetUserFromUsernameDocument = gql`
    query GetUserFromUsername($username: String!) {
  getUserFromUsername(username: $username) {
    id
    userID
    firstName
    lastName
    createdAt
  }
}
    `;

export function useGetUserFromUsernameQuery(options: Omit<Urql.UseQueryArgs<GetUserFromUsernameQueryVariables>, 'query'>) {
  return Urql.useQuery<GetUserFromUsernameQuery, GetUserFromUsernameQueryVariables>({ query: GetUserFromUsernameDocument, ...options });
};
export const GetUserPostedsDocument = gql`
    query GetUserPosteds($posterID: Int!) {
  getUserPosteds(posterID: $posterID) {
    id
    title
    content
    posterID
    upvoteCount
    downvoteCount
    viewCount
    createdAt
    updatedAt
  }
}
    `;

export function useGetUserPostedsQuery(options: Omit<Urql.UseQueryArgs<GetUserPostedsQueryVariables>, 'query'>) {
  return Urql.useQuery<GetUserPostedsQuery, GetUserPostedsQueryVariables>({ query: GetUserPostedsDocument, ...options });
};
export const GetUserVoteOnCommentDocument = gql`
    query GetUserVoteOnComment($commentID: Int!, $voterID: Int!) {
  getUserVoteOnComment(commentID: $commentID, voterID: $voterID) {
    id
    voteType
  }
}
    `;

export function useGetUserVoteOnCommentQuery(options: Omit<Urql.UseQueryArgs<GetUserVoteOnCommentQueryVariables>, 'query'>) {
  return Urql.useQuery<GetUserVoteOnCommentQuery, GetUserVoteOnCommentQueryVariables>({ query: GetUserVoteOnCommentDocument, ...options });
};
export const GetUserVoteOnPostDocument = gql`
    query GetUserVoteOnPost($postID: Int!, $voterID: Int!) {
  getUserVoteOnPost(postID: $postID, voterID: $voterID) {
    id
    voteType
  }
}
    `;

export function useGetUserVoteOnPostQuery(options: Omit<Urql.UseQueryArgs<GetUserVoteOnPostQueryVariables>, 'query'>) {
  return Urql.useQuery<GetUserVoteOnPostQuery, GetUserVoteOnPostQueryVariables>({ query: GetUserVoteOnPostDocument, ...options });
};
export const GetUserVotesDocument = gql`
    query GetUserVotes($voterID: Int!) {
  getUserVotes(voterID: $voterID) {
    id
    voteType
  }
}
    `;

export function useGetUserVotesQuery(options: Omit<Urql.UseQueryArgs<GetUserVotesQueryVariables>, 'query'>) {
  return Urql.useQuery<GetUserVotesQuery, GetUserVotesQueryVariables>({ query: GetUserVotesDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    id
    userID
  }
}
    `;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery, MeQueryVariables>({ query: MeDocument, ...options });
};
export const UserDocument = gql`
    query User($id: Int!) {
  user(id: $id) {
    id
    userID
    firstName
    lastName
    createdAt
  }
}
    `;

export function useUserQuery(options: Omit<Urql.UseQueryArgs<UserQueryVariables>, 'query'>) {
  return Urql.useQuery<UserQuery, UserQueryVariables>({ query: UserDocument, ...options });
};