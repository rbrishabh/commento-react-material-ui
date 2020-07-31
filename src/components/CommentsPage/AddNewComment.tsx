import React, { useCallback, useState } from 'react'
import {
  addNewComment,
  addReplyToComment,
  CommentsPageResponse
} from '../../utils/commentoApi'
import { useCommentPageContext } from './CommentPageContext'
import { CommentPageActions } from './CommentPageReducer'
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
  onSuccess?: () => void
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
  const [addReplyToCommentMutation] = useMutation(addReplyToComment, {
    onMutate: () => {
      queryCache.cancelQueries(pageId)
      const oldCommentsPageData = queryCache.getQueryData(pageId)
      console.log('oldCommentsPageData', oldCommentsPageData)

      queryCache.setQueryData(pageId, (pageData: CommentsPageResponse) => {
        const newPageData = produce(pageData, draftPageData => {
          draftPageData.totalUndeletedComments += 1
        })
        console.log('newPageData', newPageData)
        return newPageData
      })

      return oldCommentsPageData
    },
    // On failure, roll back to the previous value
    onError: (_err, _variables, previousValue) =>
      queryCache.setQueryData(pageId, previousValue),
    // After success or failure, refetch the todos query
    onSettled: () => {
      queryCache.invalidateQueries(pageId)
    }
  })
  const [addNewCommentMutation] = useMutation(addNewComment, {
    onMutate: () => {
      queryCache.cancelQueries(pageId)
      const oldCommentsPageData = queryCache.getQueryData(pageId)
      console.log('oldCommentsPageData', oldCommentsPageData)

      queryCache.setQueryData(pageId, (pageData: CommentsPageResponse) => {
        const newPageData = produce(pageData, draftPageData => {
          draftPageData.totalUndeletedComments += 1
        })
        console.log('newPageData', newPageData)
        return newPageData
      })

      return oldCommentsPageData
    },
    // On failure, roll back to the previous value
    onError: (_err, _variables, previousValue) =>
      queryCache.setQueryData(pageId, previousValue),
    // After success or failure, refetch the todos query
    onSettled: () => {
      queryCache.invalidateQueries(pageId)
    }
  })

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
    onSuccess && onSuccess()
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
              <SendIcon color='primary' />
            </IconButton>
          </InputAdornment>
        ),
        style: {
          borderRadius: '1rem 1rem 1rem 1rem'
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
