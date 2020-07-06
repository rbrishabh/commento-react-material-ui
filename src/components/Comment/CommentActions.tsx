import React, { useCallback } from 'react'
import { useCommentPageContext } from '../CommentsPage/CommentPageContext'
import { voteComment, deleteComment } from '../../utils/commentoApi'
import { CommentPageActions } from '../CommentsPage/CommentPageReducer'
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt'
import ReplyIcon from '@material-ui/icons/Reply'

import {
  withStyles,
  Menu,
  MenuItem,
  ListItemText,
  Button,
  ListItemIcon
} from '@material-ui/core'

import MoreVertIcon from '@material-ui/icons/MoreVert'
import EditIcon from '@material-ui/icons/Edit'
import DeleteFilledIcon from '@material-ui/icons/Delete'

interface CommentActionsProps {
  commentHex: string
  onCollapseClick: () => void
  onEditClick: () => void
  isOwnComment: boolean
  onReplyClick: () => void
  repliesCollapsed: boolean
  pageType?: string
  commentSystem?: string
}

export const CommentActions: React.FC<CommentActionsProps> = ({
  commentHex,
  onCollapseClick,
  onEditClick,
  isOwnComment,
  onReplyClick,
  repliesCollapsed,
  pageType,
  commentSystem
}) => {
  const { commentDispatch } = useCommentPageContext()
  console.log(onCollapseClick, repliesCollapsed, commentSystem)

  const StyledMenu = withStyles({
    paper: {
      border: '1px solid #d3d4d5'
    }
  })((props: any) => (
    <Menu
      elevation={0}
      open={props.open}
      autoFocus={false}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      {...props}
    />
  ))

  const StyledMenuItem = withStyles(theme => ({
    root: {
      '&:focus': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: theme.palette.common.white
        }
      }
    }
  }))(MenuItem)

  const upvoteComment = useCallback(async () => {
    handleCloseSettings()
    await voteComment(1, commentHex)
    commentDispatch({
      type: CommentPageActions.UPVOTE_COMMENT,
      payload: {
        commentHex: commentHex
      }
    })
  }, [commentHex])

  const downvoteComment = useCallback(async () => {
    handleCloseSettings()
    await voteComment(-1, commentHex)
    commentDispatch({
      type: CommentPageActions.DOWNVOTE_COMMENT,
      payload: {
        commentHex: commentHex
      }
    })
  }, [commentHex])

  const handleDeleteComment = useCallback(async () => {
    handleCloseSettings()
    await deleteComment(commentHex)
    commentDispatch({
      type: CommentPageActions.DELETE_COMMENT,
      payload: {
        commentHex: commentHex
      }
    })
  }, [commentHex])

  const [anchorElSettings, setAnchorElSettings] = React.useState(null)

  const handleClickSettings = (event: any) => {
    setAnchorElSettings(event.currentTarget)
  }
  const handleCloseSettings = () => {
    setAnchorElSettings(null)
  }

  return (
    <div className='commentActions'>
      {pageType === 'disable' ? (
        !isOwnComment ? (
          <React.Fragment>
            {' '}
            <button onClick={onReplyClick} className='commento-button'>
              Reply
            </button>
            <button onClick={upvoteComment} className='commento-button'>
              Upvote
            </button>
            <button onClick={downvoteComment} className='commento-button'>
              Downvote
            </button>
          </React.Fragment>
        ) : (
          ''
        )
      ) : (
        ''
      )}
      {/* // pageType !== 'popup' ? ( */}
      {
        !isOwnComment ? (
          <React.Fragment>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Button
                aria-controls='customized-menu'
                aria-haspopup='true'
                variant='contained'
                className='commentSettingsClass'
                onClick={handleClickSettings}
              >
                <MoreVertIcon color='inherit' />
              </Button>
              <StyledMenu
                style={{ zIndex: 100000000 }}
                anchorEl={anchorElSettings}
                keepMounted
                open={Boolean(anchorElSettings)}
                onClose={handleCloseSettings}
              >
                {/* <StyledMenuItem onClick={upvoteComment} key='1'>
                <ListItemText primary='Upvote' />
              </StyledMenuItem>
              <StyledMenuItem onClick={downvoteComment} key='2'>
                <ListItemText primary='Downvote' />
              </StyledMenuItem> */}
                <StyledMenuItem
                  onClick={() => [handleCloseSettings(), onReplyClick()]}
                  key='2'
                >
                  <ListItemIcon>
                    <ReplyIcon />
                  </ListItemIcon>
                  <ListItemText primary='Reply' />
                </StyledMenuItem>
                {/* <StyledMenuItem
                onClick={() => [handleCloseSettings(), onCollapseClick()]}
                key='6'
              >
                <ListItemText
                  primary={
                    repliesCollapsed ? 'Expand Replies' : 'Collapse Replies'
                  }
                />
              </StyledMenuItem> */}
              </StyledMenu>{' '}
              <div style={{ display: 'flex', color: 'grey' }}>
                <Button style={{ color: 'grey' }} onClick={upvoteComment}>
                  <ThumbUpAltIcon color='inherit' /> Like
                </Button>
                <Button style={{ color: 'grey' }} onClick={onReplyClick}>
                  <ReplyIcon color='inherit' />
                  Reply
                </Button>
              </div>
            </div>
          </React.Fragment>
        ) : (
          ''
        )
        // ) : (
        //   ''
        // )
      }
      {isOwnComment ? (
        // (
        // pageType !== 'popup' ? (
        //   <React.Fragment>
        //     <button onClick={onEditClick} className='commento-button'>
        //       Edit
        //     </button>
        //     <button onClick={handleDeleteComment} className='commento-button'>
        //       Delete
        //     </button>
        //   </React.Fragment>
        // )
        // :

        <React.Fragment>
          <Button
            aria-controls='customized-menu'
            aria-haspopup='true'
            variant='contained'
            className='commentSettingsClass'
            onClick={handleClickSettings}
          >
            <MoreVertIcon color='inherit' />
          </Button>
          <StyledMenu
            style={{ zIndex: 100000000 }}
            anchorEl={anchorElSettings}
            keepMounted
            open={Boolean(anchorElSettings)}
            onClose={handleCloseSettings}
          >
            <StyledMenuItem
              onClick={() => [handleCloseSettings(), onEditClick()]}
              key='1'
            >
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary='Edit' />
            </StyledMenuItem>
            <StyledMenuItem
              onClick={() => [handleCloseSettings(), handleDeleteComment()]}
              key='2'
            >
              <ListItemIcon>
                <DeleteFilledIcon />
              </ListItemIcon>
              <ListItemText primary='Delete' />
            </StyledMenuItem>
          </StyledMenu>
        </React.Fragment>
      ) : (
        // )
        ''
      )}
      {/* {commentSystem !== 'personal' ? (
        pageType !== 'popup' ? (
          <button onClick={onCollapseClick} className='commento-button'>
            {repliesCollapsed ? 'Expand Replies' : 'Collapse Replies'}
          </button>
        ) : (
          ''
        )
      ) : (
        ''
      )} */}
    </div>
  )
}
