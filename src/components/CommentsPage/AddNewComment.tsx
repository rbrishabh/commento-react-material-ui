import React, { useCallback, useState } from 'react'
import { addNewComment, addReplyToComment } from '../../utils/commentoApi'
import { useCommentPageContext } from './CommentPageContext'
import { CommentPageActions } from './CommentPageReducer'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import SendIcon from '@material-ui/icons/Send'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core'

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
  // console.log(userData)
  const [commentBody, setCommentBody] = useState<string>('')
  const { commentDispatch, currentCommenterDetails } = useCommentPageContext()
  const handleSubmit = useCallback(async () => {
    if (!commentBody) return
    if (parentHex) {
      const { comment: newComment } = await addReplyToComment({
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
      const { comment: newComment } = await addNewComment({
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
            <IconButton className='sendIcon' onClick={handleSubmit}>
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
