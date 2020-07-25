import React, { useEffect, useState, useCallback, useMemo } from 'react'
import Comment from '../Comment'
import { AddNewCommnet } from '../CommentsPage/AddNewComment'
import LoadingGif from '../../assets/loading.gif'
import { CommentDetails } from '../../interfaces'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { animateScroll } from 'react-scroll'
import { ArrowExpand, ArrowShrink, Cross } from './Icons'
import SettingsIcon from '@material-ui/icons/Settings'
import { useCommentoAuthContext } from '../CommentoAuthContext'

interface CommentPageProps {
  pageId: string
  allowOnlyOneRootComment?: boolean
  pageType?: string
  userDetails: any
  commentValues: any
  commentsLoaded: any
  commentSystem?: string
  width: number
  expandedWidth?: number
  label: string
  onClose?: () => void
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxHeight: '90vh',
      minHeight: '65vh',
      width: (props: any) =>
        props.isExpanded ? props.expandedWidth : props.width,
      padding: theme.spacing(0),
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease-in-out',
      boxShadow: theme.shadows[5],
      borderRadius: '10px',
      position: 'relative',
      overflow: 'hidden'
    },
    popupHeader: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
      paddingBottom: theme.spacing(4),
      background: 'linear-gradient(to bottom, white 55%, rgba(0,0,0,0))',
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      '& .label': {
        color: theme.palette.primary.main,
        display: 'inline-block',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        flex: 1
      }
    },
    headerActions: {
      display: 'flex',
      alignItems: 'center',
      '& .actionBtn': {
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        width: 30,
        background: '#f8f9f8',
        borderRadius: 10,
        cursor: 'pointer',
        '&:hover': {
          background: '#f1f1f1'
        },
        '&:not(:last-child)': {
          marginRight: theme.spacing(1)
        },
        '&.cross': {
          '& svg': {
            height: 10
          }
        },
        '& svg': {
          verticalAlign: 'middle',
          height: 20,
          width: 'auto'
        }
      }
    },
    commentsContainer: {
      minHeight: 0,
      flex: 1,
      padding: theme.spacing(2),
      paddingTop: theme.spacing(7),
      overflowY: 'auto',
      '&::-webkit-scrollbar-thumb': {
        background: 'hsla(0,0%,53.3%,.519)',
        borderRagius: 10,
        padding: 4
      },
      '&::-webkit-scrollbar ': {
        width: 5,
        padding: 10
      }
    },
    addNewCommentWrapper: {
      padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`
    }
  })
)

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
  width,
  expandedWidth = 1000,
  commentSystem,
  label,
  onClose
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const reversedCommentValues = useMemo(() => commentValues.reverse(), [
    commentValues
  ])
  const { commentoOrigin } = useCommentoAuthContext()
  const classes = useStyles({ width, isExpanded, expandedWidth })
  useEffect(() => {
    if (commentsLoaded) scrollToBottom()
  }, [commentsLoaded])

  const expandPopUp = () => setIsExpanded(true)
  const shrinkPopUp = () => setIsExpanded(false)
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
                />
              )
            )}
          </React.Fragment>
        ) : (
          <div style={{ marginTop: '1rem' }}>
            <div className='commento-alert'>
              Loading the comment stream{' '}
              <img src={LoadingGif} className='loading-gif' />
            </div>
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
          />
        </div>
      )}
    </div>
  )
}

export default PopupComments
