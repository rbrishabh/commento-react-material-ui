import React, { useEffect, useState, useCallback, useMemo } from 'react'
import Comment from '../../Comment'
import { AddNewCommnet } from '../../Helpers/AddNewComment'
import { CommentDetails } from '../../../interfaces'
import { animateScroll } from 'react-scroll'
import { ArrowExpand, ArrowShrink, Cross } from './utils/Icons'
import SettingsIcon from '@material-ui/icons/Settings'
import { useCommentoAuthContext } from '../../CommentoAuthContext'
import { useStyles } from './PopupStyles'
import { SkeletonComment } from './utils/SkeletonComment'

interface CommentPageProps {
  pageId: string
  userDetails: any
  commentValues: any
  commentsLoaded: any
  label: string
  allowOnlyOneRootComment?: boolean
  pageType?: string
  commentSystem?: string
  width?: number
  expandedWidth?: number
  onClose?: () => void
  onCommentSuccess?: (pageId: string, parentHex?: string) => void
}

const scrollToBottom = () => {
  animateScroll.scrollToBottom({
    containerId: 'scrollToRoot'
  })
}

const PopupComments: React.FC<CommentPageProps> = ({
  userDetails,
  pageId,
  pageType,
  allowOnlyOneRootComment,
  commentValues,
  commentsLoaded,
  width = 300,
  expandedWidth = 1000,
  commentSystem,
  label,
  onClose,
  onCommentSuccess
}) => {
  const { commentoOrigin } = useCommentoAuthContext()
  const [isExpanded, setIsExpanded] = useState(false)
  const reversedCommentValues = useMemo(() => commentValues.reverse(), [
    commentValues
  ])
  const classes = useStyles({ width, isExpanded, expandedWidth })
  useEffect(() => {
    if (commentsLoaded) scrollToBottom()
  }, [commentsLoaded])

  const expandPopUp = useCallback(() => setIsExpanded(true), [])
  const shrinkPopUp = useCallback(() => setIsExpanded(false), [])
  const redirectToCommentoSettings = useCallback(
    () =>
      window.open(
        `${commentoOrigin}/unsubscribe?unsubscribeSecretHex=${userDetails.unsubscribeSecretHex}`,
        '_blank'
      ),
    []
  )
  return (
    <div className={classes.root}>
      <div className={classes.popupHeader}>
        <span className='label'>{label}</span>
        <div className={classes.headerActions}>
          <span className='actionBtn' onClick={redirectToCommentoSettings}>
            <SettingsIcon color='primary' />
          </span>
          <span
            className='actionBtn'
            onClick={isExpanded ? shrinkPopUp : expandPopUp}
          >
            {isExpanded ? <ArrowShrink /> : <ArrowExpand />}
          </span>
          <span className='actionBtn cross' onClick={onClose}>
            <Cross />
          </span>
        </div>
      </div>
      <div id='scrollToRoot' className={classes.commentsContainer}>
        {commentsLoaded ? (
          <React.Fragment>
            {reversedCommentValues.map(
              (comment: CommentDetails, index: number) => (
                <Comment
                  commentSystem={commentSystem}
                  key={comment.commentHex}
                  pageType={pageType}
                  commentDetails={comment}
                  hideDivider={index === 0}
                  onReplySuccess={onCommentSuccess}
                />
              )
            )}
          </React.Fragment>
        ) : (
          <div style={{ marginTop: '1rem' }}>
            <SkeletonComment />
            <SkeletonComment />
          </div>
        )}
      </div>
      {reversedCommentValues.length > 0 && allowOnlyOneRootComment ? null : (
        <div className={classes.addNewCommentWrapper}>
          <AddNewCommnet
            scrollToBottom={scrollToBottom}
            pageType={pageType}
            pageId={pageId}
            commentsLoaded={commentsLoaded}
            userData={userDetails}
            onSuccess={onCommentSuccess}
          />
        </div>
      )}
    </div>
  )
}

export default PopupComments
