import React, { useState, useEffect, useReducer } from 'react'
import { CommentDetails, UserDetails } from '../../interfaces'
import { useCommentoAuthContext } from '../CommentoAuthContext'
import { CommentPageContext } from './CommentPageContext'
import {
  fetchComments,
  sortCommentByCreationDate,
  CommentSortTypes
} from '../../utils/commentoApi'
import GridComments from '../CommentTypes/GridComments'
import PopupComments from '../CommentTypes/PopupComments'
import { commentsReducer, CommentPageActions } from './CommentPageReducer'
import turndownService from '../../utils/turndown'
import cloneDeep from 'lodash.clonedeep'
import LoadingGif from '../../assets/loading.gif'
import {
  StylesProvider,
  createGenerateClassName
} from '@material-ui/core/styles'

interface CommentPageProps {
  pageId: string
  allowOnlyOneRootComment?: boolean
  pageType?: string
  height?: number
  width?: number
  commentSystem?: string
  label?: string
}

const generateClassName = createGenerateClassName({
  disableGlobal: true,
  productionPrefix: 'commento'
})

const convertArrayToKeyValuePairs = (comments: CommentDetails[]) => {
  return comments.reduce((acc, comment) => {
    if (comment.deleted && !(comment.parentHex === 'root')) return acc
    acc[comment.commentHex] = comment
    return acc
  }, {})
}

const mergeRepliesToRootComments = (comments: {
  [key: string]: CommentDetails
}): { [key: string]: CommentDetails } => {
  const reducedComments: {
    [key: string]: CommentDetails
  } = cloneDeep(comments)
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

const addMarkdownToComments = (comments: CommentDetails[]) =>
  comments.map(comment => {
    comment.markdown = turndownService.turndown(comment.html)
    return comment
  })

const removeDeletedCommentsWithNoReplies = (comments: CommentDetails[]) =>
  comments.filter(comment => !(comment.deleted && !comment.replies))

export const CommentsPage: React.FC<CommentPageProps> = ({
  pageId,
  allowOnlyOneRootComment,
  pageType = 'grid',
  width = 0,
  commentSystem,
  label
}) => {
  const [commentsLoaded, setCommentsLoaded] = useState<boolean>(false)
  const [comments, commentDispatch] = useReducer(commentsReducer, {})
  const [commenters, setCommentors] = useState<UserDetails[]>([])
  const {
    isAuthenticated,
    userDetails,
    isAuthenticating
  } = useCommentoAuthContext()
  const commentValues = sortCommentByCreationDate(
    CommentSortTypes.desc,
    removeDeletedCommentsWithNoReplies(
      Object.values(mergeRepliesToRootComments(comments))
    )
  )

  useEffect(() => {
    if (isAuthenticated) {
      const getComments = async () => {
        // get comments usins the commentoProvider
        const { comments, commenters } = await fetchComments(pageId)
        setCommentors(commenters)
        commentDispatch({
          type: CommentPageActions.COMMENTS_LOADED,
          payload: convertArrayToKeyValuePairs(addMarkdownToComments(comments))
        })
        setCommentsLoaded(true)
      }
      getComments()
    }
  }, [pageId, isAuthenticated])

  if (isAuthenticating) {
    return pageType === 'popup' ? (
      <img src={LoadingGif} className='loading-gif' />
    ) : (
      // <div className='comments-page'>
      //   <div className='commento-alert'>
      //     Authenticating the user{' '}
      <img src={LoadingGif} className='loading-gif' />
      // </div>
      // </div>
    )
  } else if (!isAuthenticated && !isAuthenticating) {
    return (
      <div className='comments-page'>
        <div className='commento-alert'>
          You are not authorized to access this comment stream
        </div>
      </div>
    )
  }

  return (
    // Pass dispatch for useReducer in the provider value so that CommentActions can dispatch action to modify a particular comment
    <CommentPageContext.Provider
      value={{
        pageId,
        currentCommenterDetails: userDetails,
        commenters,
        commentDispatch
      }}
    >
      <StylesProvider generateClassName={generateClassName}>
        {pageType === 'grid' ? (
          <GridComments
            commentValues={commentValues}
            userDetails={userDetails}
            pageId={pageId}
            allowOnlyOneRootComment={allowOnlyOneRootComment}
            commentsLoaded={commentsLoaded}
            pageType={pageType}
            commentSystem={commentSystem}
          />
        ) : pageType === 'popup' ? (
          <PopupComments
            commentSystem={commentSystem}
            width={width}
            commentValues={commentValues}
            userDetails={userDetails}
            pageId={pageId}
            allowOnlyOneRootComment={allowOnlyOneRootComment}
            commentsLoaded={commentsLoaded}
            pageType={pageType}
            label={label || 'Comments'}
          />
        ) : (
          ''
        )}
      </StylesProvider>
    </CommentPageContext.Provider>
  )
}
