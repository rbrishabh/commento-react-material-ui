import React, { useCallback } from 'react'
import { useCommentPageContext } from '../CommentsPage/CommentPageContext'
import {
  voteComment,
  deleteComment,
  CommentsPageResponse
} from '../../utils/commentoApi'
import { CommentPageActions } from '../CommentsPage/CommentPageReducer'
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt'
import ReplyIcon from '@material-ui/icons/Reply'

import {
  withStyles,
  Menu,
  MenuItem,
  ListItemText,
  Button,
  ListItemIcon,
  makeStyles
} from '@material-ui/core'

import MoreVertIcon from '@material-ui/icons/MoreVert'
import EditIcon from '@material-ui/icons/Edit'
import DeleteFilledIcon from '@material-ui/icons/Delete'
import { useMutation, queryCache } from 'react-query'
import produce from 'immer'
import _ from 'lodash'

const useStyles = makeStyles(() => ({
  unlikeButton: {
    color: "#494340"
  },
  likeButton: {
    color: 'grey'
  }
}))

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
  isModerator: boolean
}

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
      backgroundColor: "#494340",
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white
      }
    }
  }
}))(MenuItem)

export const CommentActions: React.FC<CommentActionsProps> = ({
  commentHex,
  onEditClick,
  isOwnComment,
  onReplyClick,
  pageType,
  isHovered,
  isReply,
  likedState,
  isModerator
}) => {
  const classes = useStyles()
  const { commentDispatch, pageId } = useCommentPageContext()
  const [deleteCommentMutation] = useMutation(deleteComment, {
    onMutate: () => {
      queryCache.cancelQueries(['fetchComments', pageId], { exact: true })
      queryCache.cancelQueries(['commentCount', pageId], { exact: true })

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
            _.remove(draftPageData.comments, {
              commentHex
            })
            draftPageData.totalUndeletedComments -= 1
          })
          return newPageData
        },
        { exact: true }
      )

      queryCache.setQueryData(
        ['commentCount', pageId],
        (oldCommentCount: number) => oldCommentCount - 1,
        { exact: true }
      )

      return {
        oldCommentsPageData,
        oldCommentCountData
      }
    },
    // On failure, roll back to the previous value
    onError: (
      _err: any,
      _variables: any,
      { oldCommentsPageData, oldCommentCountData }: any
    ) => {
      queryCache.setQueryData(['fetchComments', pageId], oldCommentsPageData)
      queryCache.setQueryData(['commentCount', pageId], oldCommentCountData)
    },
    // After success or failure, refetch the todos query
    onSettled: () => {
      queryCache.invalidateQueries(['fetchComments', pageId])
      queryCache.invalidateQueries(['commentCount', pageId])
    }
  })

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

  const handleDeleteComment = useCallback(async () => {
    handleCloseSettings()
    await deleteCommentMutation(commentHex)
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
      {!isOwnComment ? (
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
                      className={classes.likeButton}
                      size='small'
                      onClick={upvoteComment}
                    >
                      <ThumbUpAltIcon fontSize='small' color='inherit' /> Like
                    </Button>
                  )}
                  {likedState === 1 && (
                    <Button
                      className={classes.unlikeButton}
                      size='small'
                      onClick={downvoteComment}
                    >
                      <ThumbUpAltIcon fontSize='small' color='inherit' /> Like
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
      )}
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
            >
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary='Edit' />
            </StyledMenuItem>
            <StyledMenuItem
              onClick={() => [handleCloseSettings(), handleDeleteComment()]}
            >
              <ListItemIcon>
                <DeleteFilledIcon />
              </ListItemIcon>
              <ListItemText primary='Delete' />
            </StyledMenuItem>
          </StyledMenu>
        </React.Fragment>
      ) : isModerator ? (
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
              onClick={() => [handleCloseSettings(), handleDeleteComment()]}
            >
              <ListItemIcon>
                <DeleteFilledIcon />
              </ListItemIcon>
              <ListItemText primary='Delete' />
            </StyledMenuItem>
          </StyledMenu>
        </React.Fragment>
      ) : (
        ''
      )}
    </div>
  )
}
