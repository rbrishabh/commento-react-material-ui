import React, { useCallback } from 'react'
import { useCommentPageContext } from '../CommentsPage/CommentPageContext'
import { voteComment, deleteComment } from '../../utils/commentoApi'
import { CommentPageActions } from '../CommentsPage/CommentPageReducer'
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt'
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt'
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
  isHovered?: boolean
  isReply?: boolean
  likedState: number
}

export const CommentActions: React.FC<CommentActionsProps> = ({
  commentHex,
  // onCollapseClick,
  onEditClick,
  isOwnComment,
  onReplyClick,
  // repliesCollapsed,
  pageType,
  // commentSystem,
  isHovered,
  isReply,
  likedState
}) => {
  const { commentDispatch } = useCommentPageContext()
  // console.log(onCollapseClick, repliesCollapsed, commentSystem, pageType)

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
    await voteComment(0, commentHex)
    commentDispatch({
      type: CommentPageActions.DOWNVOTE_COMMENT,
      payload: {
        commentHex: commentHex
      }
    })
  }, [commentHex])

  // const downvoteComment = useCallback(async () => {
  //   handleCloseSettings()
  //   await voteComment(-1, commentHex)
  //   commentDispatch({
  //     type: CommentPageActions.DOWNVOTE_COMMENT,
  //     payload: {
  //       commentHex: commentHex
  //     }
  //   })
  // }, [commentHex])

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
      {
        !isOwnComment ? (
          <React.Fragment>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginRight: pageType === 'popup' ? '10px' : '30px'
                // marginTop: pageType === 'popup' ? '10px' : '30px'
              }}
            >
              <div style={{ display: 'flex', color: 'grey' }}>
                {isHovered ? (
                  <React.Fragment>
                    {likedState === 0 && (
                      <Button
                        style={{ color: 'grey' }}
                        size='small'
                        onClick={upvoteComment}
                      >
                        <ThumbUpAltIcon fontSize='small' color='inherit' /> Like
                      </Button>
                    )}
                    {likedState === 1 && (
                      <Button
                        style={{ color: 'grey' }}
                        size='small'
                        onClick={downvoteComment}
                      >
                        <ThumbDownAltIcon fontSize='small' color='inherit' />{' '}
                        Unlike
                      </Button>
                    )}

                    {!isReply ? (
                      <Button
                        style={{ color: 'grey' }}
                        size='small'
                        onClick={onReplyClick}
                      >
                        <ReplyIcon fontSize='small' color='inherit' />
                        Reply
                      </Button>
                    ) : (
                      ''
                    )}
                  </React.Fragment>
                ) : (
                  <div style={{ padding: '15px' }} />
                )}
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
    </div>
  )
}
