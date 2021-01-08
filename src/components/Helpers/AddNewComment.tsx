import React, { useCallback, useState, useMemo } from 'react'
import {
  addNewComment,
  addReplyToComment,
  CommentsPageResponse
} from '../../utils/commentoApi'
import { useCommentPageContext } from '../CommentsPage/CommentPageContext'
import { CommentPageActions } from '../CommentsPage/CommentPageReducer'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import SendIcon from '@material-ui/icons/Send'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core'
import { useMutation, queryCache } from 'react-query'
import { produce } from 'immer'

const useInputClasses = makeStyles(_theme => ({
  root: {
    border: 'none',
    background: '#f8f9f8',
    '&:hover': {
      background: '#f1f1f1'
    },
    '&$focused': {
      background: '#f1f1f1'
    }
  },
  focused: {},
  multiline: {
    padding: '15px 17px'
  }
}))
interface AddNewCommentProps {
  pageId: string
  parentHex?: string
  pageType?: string
  onSuccess?: (pageId: string, parentHex?: string | undefined) => void
  scrollToBottom?: () => void
  commentsLoaded?: any
  userData?: any
  isReply?: boolean
}

export const AddNewCommnet: React.FC<AddNewCommentProps> = ({
  pageId,
  parentHex,
  pageType,
  onSuccess,
  scrollToBottom,
  // commentsLoaded,
  userData,
  isReply = false
}) => {
  const [commentBody, setCommentBody] = useState<string>('')
  const { commentDispatch, currentCommenterDetails } = useCommentPageContext()
  const queryConfig = useMemo(
    () => ({
      onMutate: () => {
        queryCache.cancelQueries(['fetchComments', pageId], { exact: true })
        queryCache.cancelQueries(['commentCount', pageId], { exact: true })
        // queryCache.cancelQueries(commentsCountQueryKey, { exact: true })

        const oldCommentsPageData = queryCache.getQueryData([
          'fetchComments',
          pageId
        ])
        const oldCommentCountData = queryCache.getQueryData([
          'commentCount',
          pageId
        ])

        queryCache.setQueryData(
          ['fetchComments', pageId],
          (pageData: CommentsPageResponse) => {
            const newPageData = produce(pageData, draftPageData => {
              draftPageData.totalUndeletedComments += 1
            })
            return newPageData
          },
          { exact: true }
        )

        queryCache.setQueryData(
          ['commentCount', pageId],
          (oldCommentCount: number) =>
            oldCommentCount ? oldCommentCount + 1 : 1,
          { exact: true }
        )

        return {
          oldCommentsPageData,
          oldCommentCountData
        }
      },
      // On failure, roll back to the previous value
      onError: (_err: any, _variables: any, _snapShot: any) => {
        const { oldCommentsPageData, oldCommentCountData } = _snapShot
        queryCache.setQueryData(['fetchComments', pageId], oldCommentsPageData)
        queryCache.setQueryData(['commentCount', pageId], oldCommentCountData)
      },
      // After success or failure, refetch the todos query
      onSettled: () => {
        queryCache.invalidateQueries(['fetchComments', pageId])
        queryCache.invalidateQueries(['commentCount', pageId], { exact: true })
      }
    }),
    [pageId]
  )
  const [addReplyToCommentMutation] = useMutation(
    addReplyToComment,
    queryConfig
  )

  const [addNewCommentMutation] = useMutation(addNewComment, queryConfig)

  const handleSubmit = useCallback(async () => {
    if (!commentBody) return
    if (parentHex) {
      const { comment: newComment } = await addReplyToCommentMutation({
        commentMarkdown: commentBody,
        path: pageId,
        parentHex,
        commenterHex: currentCommenterDetails.commenterHex
      })
      commentDispatch({
        type: CommentPageActions.ADD_NEW_COMMENT,
        payload: newComment
      })
    } else {
      const { comment: newComment } = await addNewCommentMutation({
        commentMarkdown: commentBody,
        path: pageId,
        commenterHex: currentCommenterDetails.commenterHex
      })
      commentDispatch({
        type: CommentPageActions.ADD_NEW_COMMENT,
        payload: newComment
      })
    }
    setCommentBody('')
    onSuccess && onSuccess(pageId, parentHex)
    scrollToBottom && scrollToBottom()
  }, [pageId, commentBody])

  const handleCommentBodyChange = (e: any) => {
    const newCommentBody = e.target.value
    setCommentBody(newCommentBody)
  }
  const classes = useInputClasses()
  const InputComponent = (
    <TextField
      fullWidth
      onChange={handleCommentBodyChange}
      value={commentBody}
      size='medium'
      multiline
      rowsMax={3}
      variant='filled'
      placeholder='Add a comment'
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton onClick={handleSubmit}>
              <SendIcon htmlColor='#494340' />
            </IconButton>
          </InputAdornment>
        ),
        style: {
          marginTop: '20px',
          borderRadius: '0 1rem',
          marginBottom: '20px'
        },
        disableUnderline: true,
        classes
      }}
    />
  )

  return pageType === 'grid' ? (
    isReply ? (
      InputComponent
    ) : (
      <div style={{ display: 'flex' }}>
        {!userData || !userData.photo ? (
          <div className='anonymous-image'>?</div>
        ) : (
          <img
            style={{ margin: '10px 5px' }}
            src={userData ? (userData.photo ? userData.photo : '?') : '?'}
            alt='User Image'
            className='avatar'
          />
        )}

        {InputComponent}
      </div>
    )
  ) : pageType === 'popup' ? (
    isReply ? (
      InputComponent
    ) : (
      InputComponent
    )
  ) : isReply ? (
    InputComponent
  ) : (
    <div style={{ display: 'flex' }}>
      <img
        style={{ margin: '10px 5px' }}
        src={userData.photo}
        alt='User Image'
        className='avatar'
      />
      {InputComponent}
    </div>
  )
}
