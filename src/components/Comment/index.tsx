import React, { useMemo, useState, useCallback } from 'react'
import { CommentDetails } from '../../interfaces'
import { CommentActions } from './CommentActions'
import { CommentHeader } from './UserDetails'
import classnames from 'classnames'
import { EditComment } from './EditComment'
import { AddNewCommnet } from '../CommentsPage/AddNewComment'
import { useCommentPageContext } from '../CommentsPage/CommentPageContext'
import Divider from '@material-ui/core/Divider'

import {
  sortCommentByCreationDate,
  CommentSortTypes
} from '../../utils/commentoApi'
interface CommentProps {
  commentDetails: CommentDetails
  pageType?: string
  commentSystem?: string
  isReply?: boolean
}

export const Comment: React.FC<CommentProps> = ({
  commentDetails,
  pageType = 'grid',
  commentSystem,
  isReply = false
}) => {
  const {
    pageId,
    currentCommenterDetails,
    commenters
  } = useCommentPageContext()

  const [editModeOpen, setEditModeOpen] = useState<boolean>(false)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [replyMode, setReplyMode] = useState<boolean>(false)
  const [collapseChildren, setCollapseChildren] = useState<boolean>(false)
  const isOwnComment = useMemo<boolean>(() => {
    return commentDetails.commenterHex === currentCommenterDetails.commenterHex
  }, [currentCommenterDetails, commentDetails])

  const { replies, hasReplies } = useMemo<{
    replies: boolean | CommentDetails[]
    hasReplies: boolean
  }>(() => {
    const hasReplies =
      !!commentDetails.replies &&
      Object.values(commentDetails.replies).length > 0
    let replies =
      hasReplies &&
      sortCommentByCreationDate(
        CommentSortTypes.desc,
        Object.values(commentDetails.replies)
      )
    if (
      // pageType === 'popup' &&
      Array.isArray(replies)
    ) {
      replies = (replies as CommentDetails[]).reverse()
    }

    return { replies, hasReplies }
  }, [commentDetails.replies])

  const handleOnEditClick = useCallback(
    () => setEditModeOpen(prev => !prev),
    []
  )
  const handleOnCollapseClick = useCallback(
    () => setCollapseChildren(prev => !prev),
    []
  )
  const handleReplyClick = useCallback(() => setReplyMode(prev => !prev), [])
  return (
    <div className='comment-wrapper'>
      {/* Render the user details, comment and its actions */}
      <div
        className={pageType === 'popup' ? 'commentPopupBody' : 'commentBody'}
      >
        {/* {pageType === 'popup' ?  */}
        <Divider className='dividerMargin' />
        {/* : ''} */}
        <CommentHeader
          commentSystem={commentSystem}
          userData={
            isOwnComment
              ? currentCommenterDetails
              : commenters[commentDetails.commenterHex]
          }
          commentData={commentDetails}
        />
        {editModeOpen ? (
          <EditComment
            commentDetails={commentDetails}
            onEditSuccess={handleOnEditClick}
          />
        ) : (
          <div
            // className='commentActionBody'
            style={{
              display: pageType === 'popup' ? 'flex' : 'flex',
              flexDirection: 'column',
              justifyContent:
                pageType === 'popup' ? 'space-between' : 'space-between'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className={
                pageType === 'popup'
                  ? 'commentContainerPop'
                  : 'commentContainer'
              }
              dangerouslySetInnerHTML={{ __html: commentDetails.html }}
            />
            <CommentActions
              commentHex={commentDetails.commentHex}
              isHovered={isHovered}
              onEditClick={handleOnEditClick}
              onCollapseClick={handleOnCollapseClick}
              pageType={pageType}
              commentSystem={commentSystem}
              isReply={isReply}
              isOwnComment={isOwnComment}
              onReplyClick={handleReplyClick}
              repliesCollapsed={collapseChildren}
              likedState={commentDetails.direction}
            />
          </div>
        )}
      </div>
      {replyMode && !isReply && (
        <div className='repliesContianer'>
          <AddNewCommnet
            pageId={pageId}
            pageType={pageType}
            isReply
            parentHex={commentDetails.commentHex}
            onSuccess={handleReplyClick}
            userData={
              isOwnComment
                ? currentCommenterDetails
                : commenters[commentDetails.commenterHex]
            }
          />
        </div>
      )}

      {hasReplies && (
        <div
          className={classnames('repliesContianer', {
            collapsed: collapseChildren
          })}
        >
          {(replies as CommentDetails[]).map((reply: CommentDetails) => (
            <Comment
              key={reply.commentHex}
              isReply
              commentSystem={commentSystem}
              pageType={pageType}
              commentDetails={reply}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Comment
