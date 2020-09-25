import React, { useState, useEffect, useReducer, useMemo } from 'react'
import { CommentDetails, UserDetails } from '../../interfaces'
import { useCommentoAuthContext } from '../CommentoAuthContext'
import { CommentPageContext } from './CommentPageContext'
import {
  fetchComments,
  sortCommentByCreationDate,
  CommentSortTypes,
  CommentsPageResponse
} from '../../utils/commentoApi'
import GridComments from '../CommentTypes/GridComments'
import PopupComments from '../CommentTypes/PopupComments'
import { commentsReducer, CommentPageActions } from './CommentPageReducer'
import turndownService from '../../utils/turndown'
import _ from 'lodash'
import LoadingGif from '../../assets/loading.gif'
import {
  StylesProvider,
  createGenerateClassName
} from '@material-ui/core/styles'
import { useQuery } from 'react-query'

interface CommentPageProps {
  pageId: string
  allowOnlyOneRootComment?: boolean
  pageType?: string
  height?: number
  width?: number
  commentSystem?: string
  label?: string
  [key: string]: any
  onCommentSuccess?: (pageId: string, parentHex?: string) => void
}

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

const addMarkdownToComments = (comments: CommentDetails[]) =>
  comments.map(comment => {
    if (!comment.markdown)
      comment.markdown = turndownService.turndown(comment.html)
    return comment
  })

const removeDeletedCommentsWithNoReplies = (comments: CommentDetails[]) =>
  comments.filter(comment => !(comment.deleted && !comment.replies))

const classGenerator = createGenerateClassName({
  seed: 'commento',
  productionPrefix: 'commento'
})

const _fetchComments = async (_key: string, pageId: string) =>
  await fetchComments(pageId)

export const CommentsPage: React.FC<CommentPageProps> = ({
  pageId,
  allowOnlyOneRootComment,
  pageType = 'grid',
  width = 0,
  commentSystem,
  label,
  onCommentSuccess,
  ...restProps
}) => {
  const [commentsLoaded, setCommentsLoaded] = useState<boolean>(false)
  const [comments, commentDispatch] = useReducer(commentsReducer, {})
  const [commenters, setCommentors] = useState<UserDetails[]>([])
  const {
    isAuthenticated,
    userDetails,
    isAuthenticating
  } = useCommentoAuthContext()
  const {
    isLoading: areCommentsLoading,
    data: commentsResponse,
    isIdle: isCommentsRequestidle
  } = useQuery(['fetchComments', pageId], _fetchComments, {
    enabled: isAuthenticated
  })

  const commentValues = useMemo(
    () =>
      sortCommentByCreationDate(
        CommentSortTypes.desc,
        removeDeletedCommentsWithNoReplies(
          Object.values(mergeRepliesToRootComments(comments))
        )
      ),
    [comments]
  )

  useEffect(() => {
    let isMounted = true
    if (areCommentsLoading || isCommentsRequestidle)
      return setCommentsLoaded(false)
    if (isMounted) {
      const { commenters, comments } = commentsResponse as CommentsPageResponse
      setCommentors(commenters)
      commentDispatch({
        type: CommentPageActions.COMMENTS_LOADED,
        payload: convertArrayToKeyValuePairs(addMarkdownToComments(comments))
      })
      setCommentsLoaded(true)
    }
    return () => {
      isMounted = false
    }
  }, [areCommentsLoading, isCommentsRequestidle, commentsResponse])

  if (isAuthenticating) {
    return pageType === 'popup' ? (
      <img src={LoadingGif} className='loading-gif' />
    ) : (
      <img src={LoadingGif} className='loading-gif' />
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
    <CommentPageContext.Provider
      value={{
        pageId,
        currentCommenterDetails: userDetails,
        commenters,
        commentDispatch
      }}
    >
      <StylesProvider generateClassName={classGenerator}>
        {pageType === 'grid' ? (
          <GridComments
            {...restProps}
            commentValues={commentValues}
            userDetails={userDetails}
            pageId={pageId}
            allowOnlyOneRootComment={allowOnlyOneRootComment}
            commentsLoaded={commentsLoaded}
            pageType={pageType}
            commentSystem={commentSystem}
            onCommentSuccess={onCommentSuccess}
          />
        ) : pageType === 'popup' ? (
          <PopupComments
            {...restProps}
            commentSystem={commentSystem}
            width={width}
            commentValues={commentValues}
            userDetails={userDetails}
            pageId={pageId}
            allowOnlyOneRootComment={allowOnlyOneRootComment}
            commentsLoaded={commentsLoaded}
            pageType={pageType}
            label={label || 'Comments'}
            onCommentSuccess={onCommentSuccess}
          />
        ) : (
          ''
        )}
      </StylesProvider>
    </CommentPageContext.Provider>
  )
}
