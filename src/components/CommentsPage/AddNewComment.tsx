import React, { useCallback, useState } from 'react'
import { addNewComment, addReplyToComment } from '../../utils/commentoApi'
import { useCommentPageContext } from './CommentPageContext'
import { CommentPageActions } from './CommentPageReducer'
import IconButton from '@material-ui/core/IconButton'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputAdornment from '@material-ui/core/InputAdornment'
import SendIcon from '@material-ui/icons/Send'
// import InputLabel from '@material-ui/core/InputLabel'
// import FormControl from '@material-ui/core/FormControl'

interface AddNewCommentProps {
  pageId: string
  parentHex?: string
  pageType?: string
  onSuccess?: () => void
  scrollToBottom?: () => void
  commentsLoaded?: any
}

export const AddNewCommnet: React.FC<AddNewCommentProps> = ({
  pageId,
  parentHex,
  pageType,
  onSuccess,
  scrollToBottom,
  commentsLoaded
}) => {
  const [commentBody, setCommentBody] = useState<string>('')
  const { commentDispatch, currentCommenterDetails } = useCommentPageContext()
  const handleSubmit = useCallback(async () => {
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
  return pageType === 'grid' ? (
    <OutlinedInput
      fullWidth
      onChange={handleCommentBodyChange}
      value={commentBody}
      style={{
        width: '95%',
        marginBottom: '10px',
        marginLeft: '2%',
        borderRadius: '1rem 1rem 1rem 1rem'
      }}
      className='popup-comment-padding'
      placeholder='Add a comment'
      endAdornment={
        <InputAdornment position='end'>
          <IconButton className='sendIcon' onClick={handleSubmit}>
            <SendIcon color='inherit' />
          </IconButton>
        </InputAdornment>
      }
    />
  ) : pageType === 'popup' ? (
    <OutlinedInput
      fullWidth
      onChange={handleCommentBodyChange}
      value={commentBody}
      style={{
        marginTop: !commentsLoaded ? '500px' : '0px',
        width: '95%',
        marginBottom: '10px',
        marginLeft: '2%',
        borderRadius: '1rem 1rem 1rem 1rem'
      }}
      className='popup-comment-padding'
      placeholder='Add a comment'
      endAdornment={
        <InputAdornment position='end'>
          <IconButton className='sendIcon' onClick={handleSubmit}>
            <SendIcon color='inherit' />
          </IconButton>
        </InputAdornment>
      }
    />
  ) : (
    <OutlinedInput
      fullWidth
      onChange={handleCommentBodyChange}
      value={commentBody}
      style={{
        marginTop: !commentsLoaded ? '500px' : '0px',
        width: '95%',
        marginBottom: '10px',
        marginLeft: '2%',
        borderRadius: '1rem 1rem 1rem 1rem'
      }}
      className='popup-comment-padding'
      placeholder='Add a comment'
      endAdornment={
        <InputAdornment position='end'>
          <IconButton className='sendIcon' onClick={handleSubmit}>
            <SendIcon color='inherit' />
          </IconButton>
        </InputAdornment>
      }
    />
  )
}
