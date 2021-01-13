import {
  createGenerateClassName,
  StylesProvider
} from '@material-ui/core/styles'
import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { useQuery } from 'react-query'
import { UserDetails } from '../../interfaces'
import {
  addMarkdownToComments,
  convertArrayToKeyValuePairs,
  mergeRepliesToRootComments,
  removeDeletedCommentsWithNoReplies
} from '../../utils'
import {
  CommentSortTypes,
  CommentsPageResponse,
  fetchComments,
  sortCommentByCreationDate
} from '../../utils/commentoApi'
import { useCommentoAuthContext } from '../CommentoAuthContext'
import { CommentPageContext } from './CommentPageContext'
import { CommentPageActions, commentsReducer } from './CommentPageReducer'
import FakeCommentsPopup from './CommentPageTypes/FakeCommentsPopUp'
import GridComments from './CommentPageTypes/GridComments'
import PopupComments from './CommentPageTypes/PopupComments'

interface CommentPageProps {
  pageId: string
  allowOnlyOneRootComment?: boolean
  pageType?: string
  height?: number
  width?: number
  commentSystem?: string
  label?: string
  productName?: string
  [key: string]: any
  onCommentSuccess?: (pageId: string, parentHex?: string) => void
}

const classGenerator = createGenerateClassName({
  seed: 'commento',
  productionPrefix: 'commento'
})

const _fetchComments = async (_key: string, pageId: string) =>
  fetchComments(pageId)

export const CommentsPage: React.FC<CommentPageProps> = ({
  pageId,
  allowOnlyOneRootComment,
  pageType = 'grid',
  commentSystem,
  label,
  productName,
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
    isIdle: isCommentsRequestidle,
    isError,
    error
  } = useQuery(['fetchComments', pageId], _fetchComments, {
    enabled: isAuthenticated,
    retry: 1
  })

  console.log('query => error', error)
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

    if (isError) return

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
  }, [areCommentsLoading, isCommentsRequestidle, commentsResponse, isError])

  if (!isAuthenticated && !isAuthenticating) {
    return (
      <FakeCommentsPopup {...restProps}>
        <div className='commento-alert'>
          You are not authorized to access this comment stream
        </div>
      </FakeCommentsPopup>
    )
  }

  if (areCommentsLoading || isCommentsRequestidle)
    return <FakeCommentsPopup label={label || 'Comments'} {...restProps} />

  if (isError || error)
    return (
      <FakeCommentsPopup label={label || 'Comments'} {...restProps}>
        <div className='commento-alert'>Error: {error?.message}</div>
      </FakeCommentsPopup>
    )

  console.log('isError', isError)
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
            commentValues={commentValues}
            userDetails={userDetails}
            pageId={pageId}
            allowOnlyOneRootComment={allowOnlyOneRootComment}
            commentsLoaded={commentsLoaded}
            pageType={pageType}
            label={label || 'Comments'}
            productName={productName}
            onCommentSuccess={onCommentSuccess}
          />
        ) : (
          ''
        )}
      </StylesProvider>
    </CommentPageContext.Provider>
  )
}
