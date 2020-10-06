import React, { useState, useCallback } from 'react'
import { ArrowExpand, ArrowShrink, Cross } from './utils/Icons'
import { useStyles } from './PopupStyles'
import { SkeletonComment } from './utils/SkeletonComment'

interface CommentPageProps {
  width?: number
  expandedWidth?: number
  label?: string
  onClose?: () => void
  commentContainerProps?: any
}

export const FakeCommentsPopup: React.FC<CommentPageProps> = ({
  width = 300,
  expandedWidth = 1000,
  label = 'Comments',
  onClose,
  children,
  commentContainerProps = {}
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const classes = useStyles({ width, isExpanded, expandedWidth })

  const expandPopUp = useCallback(() => setIsExpanded(true), [])
  const shrinkPopUp = useCallback(() => setIsExpanded(false), [])

  return (
    <div className={classes.root}>
      <div className={classes.popupHeader}>
        <span className='label'>{label}</span>
        <div className={classes.headerActions}>
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

      <div className={classes.commentsContainer} {...commentContainerProps}>
        {children || (
          <React.Fragment>
            <SkeletonComment />
            <SkeletonComment />
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

export default FakeCommentsPopup
