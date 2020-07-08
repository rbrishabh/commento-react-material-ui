import React, { useCallback, useState } from 'react'
import { addNewComment, addReplyToComment } from '../../utils/commentoApi'
import { useCommentPageContext } from './CommentPageContext'
import { CommentPageActions } from './CommentPageReducer'
import IconButton from '@material-ui/core/IconButton'
// import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputAdornment from '@material-ui/core/InputAdornment'
import SendIcon from '@material-ui/icons/Send'
// import InputLabel from '@material-ui/core/InputLabel'
// import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'

interface AddNewCommentProps {
  pageId: string
  parentHex?: string
  pageType?: string
  onSuccess?: () => void
  scrollToBottom?: () => void
  commentsLoaded?: any
  userData?: any
}

export const AddNewCommnet: React.FC<AddNewCommentProps> = ({
  pageId,
  parentHex,
  pageType,
  onSuccess,
  scrollToBottom,
  commentsLoaded,
  userData
}) => {
  console.log(userData)
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
    <div style={{ display: 'flex' }}>
      <img
        style={{ margin: '10px 5px' }}
        src={userData.photo}
        alt='User Image'
        className='avatar'
      />

      <TextField
        fullWidth
        onChange={handleCommentBodyChange}
        value={commentBody}
        style={{
          width: '100%',
          marginBottom: '10px',
          backgroundColor: 'white'
        }}
        size='medium'
        multiline
        rowsMax={3}
        className='textFieldInput'
        variant='outlined'
        placeholder='Add a comment'
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton className='sendIcon' onClick={handleSubmit}>
                <SendIcon color='inherit' />
              </IconButton>
            </InputAdornment>
          ),
          style: {
            borderRadius: '1rem 1rem 1rem 1rem'
          }
        }}
      />
    </div>
  ) : pageType === 'popup' ? (
    <TextField
      fullWidth
      multiline
      rowsMax={2}
      variant='outlined'
      onChange={handleCommentBodyChange}
      value={commentBody}
      style={{
        marginTop: !commentsLoaded ? '500px' : '0px',
        width: '95%',
        marginBottom: '10px',
        marginLeft: '2%',
        borderRadius: '1rem 1rem 1rem 1rem',
        backgroundColor: 'white'
      }}
      className='comment-padding'
      placeholder='Add a comment'
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton className='sendIcon' onClick={handleSubmit}>
              <SendIcon color='inherit' />
            </IconButton>
          </InputAdornment>
        ),
        style: {
          borderRadius: '1rem 1rem 1rem 1rem'
        }
      }}
    />
  ) : (
    <div style={{ display: 'flex' }}>
      <img
        style={{ margin: '10px 5px' }}
        src={userData.photo}
        alt='User Image'
        className='avatar'
      />
      <TextField
        fullWidth
        onChange={handleCommentBodyChange}
        value={commentBody}
        style={{
          width: '100%',
          marginBottom: '10px',
          backgroundColor: 'white'
        }}
        size='medium'
        multiline
        rowsMax={3}
        className='textFieldInput'
        variant='outlined'
        placeholder='Add a comment'
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton className='sendIcon' onClick={handleSubmit}>
                <SendIcon color='inherit' />
              </IconButton>
            </InputAdornment>
          ),
          style: {
            borderRadius: '1rem 1rem 1rem 1rem'
          }
        }}
      />
    </div>
  )
}
