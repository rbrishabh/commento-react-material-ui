import React from 'react'
import Comment from '../../Comment'
import { AddNewCommnet } from '../../Helpers/AddNewComment'
import LoadingGif from '../../../assets/loading.gif'
import { CommentDetails } from '../../../interfaces'

interface CommentPageProps {
  pageId: string
  allowOnlyOneRootComment?: boolean
  pageType?: string
  userDetails: any
  commentValues: any
  commentsLoaded: any
  commentSystem?: string
  onCommentSuccess?: (pageId: string, parentHex?: string) => void
}

const GridComments: React.FC<CommentPageProps> = ({
  userDetails,
  pageId,
  pageType,
  allowOnlyOneRootComment,
  commentValues,
  commentsLoaded,
  commentSystem,
  onCommentSuccess
}) => {
  const reversedCommentValues = commentValues.reverse()

  return (
    <div className='comments-page'>
      {/* <div className='commentHeader userdetails'>
        <img src={userDetails.photo} alt='User Image' className='avatar' />
        <div className='commentHeader_content'>
          <p className='username'>{userDetails.name}</p>
        </div>
      </div> */}

      {commentsLoaded ? (
        <React.Fragment>
          {reversedCommentValues.length > 0 &&
          allowOnlyOneRootComment ? null : (
            <AddNewCommnet
              pageType={pageType}
              pageId={pageId}
              userData={userDetails}
              onSuccess={onCommentSuccess}
            />
          )}
          <div className='commentslist-wrapper'>
            {reversedCommentValues.map((comment: CommentDetails) => (
              <Comment
                commentSystem={commentSystem}
                key={comment.commentHex}
                commentDetails={comment}
                onReplySuccess={onCommentSuccess}
              />
            ))}
          </div>
        </React.Fragment>
      ) : (
        // <div style={{ marginTop: '1rem' }}>
        //   <div className='commento-alert'>
        //     Loading the comment stream{' '}
        <img src={LoadingGif} className='loading-gif' />
        //   </div>
        // </div>
      )}
    </div>
  )
}

export default GridComments
