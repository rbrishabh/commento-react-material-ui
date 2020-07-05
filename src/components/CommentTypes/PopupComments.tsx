import React, { useEffect } from 'react'
import Comment from '../Comment'
import { AddNewCommnet } from '../CommentsPage/AddNewComment'
import LoadingGif from '../../assets/loading.gif'
import { CommentDetails } from '../../interfaces'
// import Paper from '@material-ui/core/Paper'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { animateScroll } from 'react-scroll'

interface CommentPageProps {
  pageId: string
  allowOnlyOneRootComment?: boolean
  pageType?: string
  userDetails: any
  commentValues: any
  commentsLoaded: any
  height: number
  commentSystem?: string
  width: number
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: (props: any) => (props.height ? props.height : '600px'),
      width: (props: any) => (props.width ? props.width : '300px'),
      overflowY: 'scroll',
      padding: theme.spacing(0)
    },
    rootDiv: {
      height: (props: any) => (props.height ? props.height : '600px'),
      width: (props: any) => (props.width ? props.width : '300px'),
      borderRadius: '1rem 1rem 1rem 1rem'
    },
    paper: {
      borderRadius: '2rem 2rem 2rem 2rem'
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
  height,
  width,
  commentSystem
}) => {
  commentValues = commentValues.reverse()
  const classes = useStyles({ height, width })
  console.log(userDetails, commentValues)
  useEffect(() => {
    if (commentsLoaded) scrollToBottom()
  }, [commentsLoaded])

  return (
    <div className={classes.rootDiv}>
      {/* <Paper variant='outlined' className={classes.paper}> */}
      <div className='comments-page-pop'>
        {/* <div className='commentHeader userdetails'>
            <img src={userDetails.photo} alt='User Image' className='avatar' />
            <div className='commentHeader_content'>
              <p className='username'>
                {commentSystem === 'personal'
                  ? //   ? 'Personal Notes'
                    userDetails.name
                  : userDetails.name}
              </p>
            </div>
          </div> */}

        {commentsLoaded ? (
          <div
            id='scrollToRoot'
            style={{ padding: '16px' }}
            className={classes.root}
          >
            {commentValues.map((comment: CommentDetails) => (
              <Comment
                commentSystem={commentSystem}
                key={comment.commentHex}
                pageType={pageType}
                commentDetails={comment}
              />
            ))}
          </div>
        ) : (
          <div style={{ marginTop: '1rem' }}>
            <div className='commento-alert'>
              Loading the comment stream{' '}
              <img src={LoadingGif} className='loading-gif' />
            </div>
          </div>
        )}
        {commentValues.length > 0 && allowOnlyOneRootComment ? null : (
          <div style={{ marginTop: '12px', width: width }}>
            {' '}
            <AddNewCommnet
              scrollToBottom={scrollToBottom}
              pageType={pageType}
              pageId={pageId}
              commentsLoaded={commentsLoaded}
            />
          </div>
        )}
      </div>
      {/* </Paper> */}
    </div>
  )
}

export default PopupComments
