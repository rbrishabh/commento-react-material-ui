import { getAxiosInstance } from './axios'
import { CommentDetails, UserDetails } from '../interfaces'
import _axios from 'axios'
import turndownService from './turndown'

export const ssoAuth = async (
  commentoOrigin: string,
  ssoToken: string,
  ssoIdToken: string
): Promise<{
  commenterToken?: string
  success: boolean
  userDetails?: UserDetails
}> => {
  const { commenterToken, success: authenticationSucess } = await _axios
    .post(
      `${commentoOrigin}/api/oauth/sso`,
      {
        userIdToken: ssoIdToken
      },
      {
        headers: {
          Authorization: `Bearer ${ssoToken}`
        }
      }
    )
    .then(res => res.data)

  const {
    commenter,
    email: userSecrets,
    success: selfGetSuccess
  } = await _axios
    .post(`${commentoOrigin}/api/commenter/self`, { commenterToken })
    .then(res => res.data)
  if (authenticationSucess && selfGetSuccess)
    return {
      commenterToken,
      success: true,
      userDetails: { ...commenter, ...userSecrets }
    }
  return { success: false }
}

export const getSelfDetails = async (commenterToken: string) => {
  const { commenter, success } = await getAxiosInstance()
    .post('/api/commenter/self', {
      commenterToken
    })
    .then(res => res.data)
  if (success) return { commenter, success }
  return { success }
}

export interface CommentsPageResponse {
  comments: CommentDetails[]
  commenters: UserDetails[]
  totalUndeletedComments: number
}

export const fetchComments = async (
  pageId: string
): Promise<CommentsPageResponse> => {
  const axios = getAxiosInstance()

  const response = await axios.post('/api/comment/list', {
    path: pageId,
    ...axios.defaults.data
  })

  const { comments, commenters } = response.data
  return {
    commenters,
    comments,
    totalUndeletedComments: comments.filter(
      (comment: CommentDetails) => !comment.deleted
    ).length
  }
}

export interface CommentCountResponse {
  success: boolean
  commentCount: number
}

export const getCommentCount = async (
  pageId: string
): Promise<CommentCountResponse | { success: boolean }> => {
  const axios = getAxiosInstance()

  const { commentCount, success } = await axios
    .post('/api/comment/count-single', {
      path: pageId,
      ...axios.defaults.data
    })
    .then(res => res.data)

  if (!success) {
    return { success }
  }

  return { success, commentCount: commentCount }
}

export interface CommentsCountsResponse {
  success: boolean
  commentCounts: { [pageId: string]: number }
}

export const getCommentsCounts = async (
  pageIds: string[]
): Promise<CommentsCountsResponse> => {
  const axios = getAxiosInstance()

  const { commentCounts, success } = await axios
    .post('/api/comment/count', {
      paths: pageIds,
      ...axios.defaults.data
    })
    .then(res => res.data)

  if (!success) {
    return { success, commentCounts: {} }
  }

  return { success, commentCounts }
}

export const voteComment = async (direction: number, commentHex: string) => {
  const axios = getAxiosInstance()
  const { success } = await axios
    .post('/api/comment/vote', {
      commentHex,
      direction,
      ...axios.defaults.data
    })
    .then(res => res.data)
  return success
}

export const deleteComment = async (commentHex: string) => {
  const axios = getAxiosInstance()
  const { success } = await axios
    .post('/api/comment/delete', {
      commentHex,
      ...axios.defaults.data
    })
    .then(res => res.data)
  return success
}

export interface UpdateCommentArguments {
  commentDetails: CommentDetails
  newCommentBody: string
}

export const updateComment = async ({
  commentDetails,
  newCommentBody
}: UpdateCommentArguments): Promise<{
  comment?: CommentDetails
  success: boolean
}> => {
  const axios = getAxiosInstance()
  const { html, success } = await axios
    .post('/api/comment/edit', {
      markdown: newCommentBody,
      commentHex: commentDetails.commentHex,
      ...axios.defaults.data
    })
    .then(res => res.data)
  if (success)
    return {
      comment: {
        ...commentDetails,
        html,
        markdown: turndownService.turndown(html)
      },
      success
    }
  return { success }
}

export const addNewComment: (params: {
  commentMarkdown: string
  path: string
  commenterHex: string
}) => Promise<{ comment: CommentDetails; success: boolean }> = async ({
  commentMarkdown,
  path,
  commenterHex
}) => {
  const axios = getAxiosInstance()
  const { commentHex, success, html } = await axios
    .post('/api/comment/new', {
      markdown: commentMarkdown,
      path,
      parentHex: 'root',
      ...axios.defaults.data
    })
    .then(res => res.data)
  const comment: CommentDetails = createComment({
    commentHex,
    html,
    markdown: commentMarkdown,
    parentHex: 'root',
    commenterHex
  })
  return { comment, success }
}

export const addReplyToComment: (params: {
  commentMarkdown: string
  path: string
  parentHex: string
  commenterHex: string
}) => Promise<{ comment: CommentDetails; success: boolean }> = async ({
  commentMarkdown,
  parentHex,
  path,
  commenterHex
}) => {
  const axios = getAxiosInstance()
  const { commentHex, success, html } = await axios
    .post('/api/comment/new', {
      markdown: commentMarkdown,
      path,
      parentHex,
      ...axios.defaults.data
    })
    .then(res => res.data)

  const comment: CommentDetails = createComment({
    commentHex,
    html,
    markdown: commentMarkdown,
    parentHex,
    commenterHex
  })
  return { comment, success }
}

const createComment: (params: {
  parentHex: string
  commentHex: string
  commenterHex: string
  markdown: string
  html: string
}) => CommentDetails = ({
  commentHex,
  commenterHex,
  html,
  markdown,
  parentHex
}) => ({
  markdown,
  parentHex,
  commentHex,
  commenterHex,
  html,
  deleted: false,
  score: 0,
  direction: 0,
  replies: {},
  creationDate: new Date().toISOString()
})

export enum CommentSortTypes {
  asc = 'old comments first',
  desc = 'new comments first'
}
export const sortCommentByCreationDate = (
  type: CommentSortTypes,
  comments: CommentDetails[]
): CommentDetails[] =>
  comments.sort((a, b) => {
    const timeA = new Date(a.creationDate).getTime()
    const timeB = new Date(b.creationDate).getTime()
    if (type === CommentSortTypes.asc) return timeA - timeB
    else if (type === CommentSortTypes.desc) return timeB - timeA
    // Default to new comments first
    return timeB - timeA
  })
