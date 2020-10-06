import { CommentDetails } from '../interfaces'
import turndownService from './turndown'
import _ from 'lodash'

export const mergeRepliesToRootComments = (comments: {
  [key: string]: CommentDetails
}): { [key: string]: CommentDetails } => {
  const reducedComments: {
    [key: string]: CommentDetails
  } = _.cloneDeep(comments)
  const KeyPaths = Object.keys(reducedComments).reduce((acc, key) => {
    acc[key] = []
    return acc
  }, {})
  Object.values(reducedComments).forEach(comment => {
    const isChild = comment.parentHex !== 'root'
    const isDeleted = comment.deleted
    if (isChild && !isDeleted) {
      const newKeyPath = [...KeyPaths[comment.parentHex], comment.parentHex]
      KeyPaths[comment.commentHex] = newKeyPath
      const entryPoint: CommentDetails = newKeyPath.reduce(
        (entryPoint, key) => {
          if (entryPoint[key]) return entryPoint[key]
          return entryPoint.replies[key]
        },
        reducedComments
      )
      if (!entryPoint.replies) entryPoint.replies = {}
      entryPoint.replies[comment.commentHex] = comment
      delete reducedComments[comment.commentHex]
    }
  })
  return reducedComments
}

export const convertArrayToKeyValuePairs = (comments: CommentDetails[]) => {
  return comments.reduce((acc, comment) => {
    if (comment.deleted && !(comment.parentHex === 'root')) return acc
    acc[comment.commentHex] = comment
    return acc
  }, {})
}

export const addMarkdownToComments = (comments: CommentDetails[]) =>
  comments.map(comment => {
    if (!comment.markdown)
      comment.markdown = turndownService.turndown(comment.html)
    return comment
  })

export const removeDeletedCommentsWithNoReplies = (
  comments: CommentDetails[]
) => comments.filter(comment => !(comment.deleted && !comment.replies))
