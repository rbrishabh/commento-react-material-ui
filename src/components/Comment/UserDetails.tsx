import React from 'react'
import { UserDetails, CommentDetails } from '../../interfaces'
import moment from 'moment'

interface CommentHeaderProps {
  userData: UserDetails
  commentData: CommentDetails
  commentSystem?: string
}

export const CommentHeader: React.FC<CommentHeaderProps> = ({
  userData,
  commentData,
  commentSystem
}) => {
  return (
    <div className='commentHeader'>
      {commentSystem !== 'personal' ? (
        commentData.deleted || !userData.photo ? (
          <div className='anonymous-image'>?</div>
        ) : (
          <img src={userData.photo} alt='User Image' className='avatar' />
        )
      ) : (
        ''
      )}

      <div className='commentHeader_content'>
        {commentSystem && commentSystem === 'personal' ? (
          ''
        ) : (
          <p className='username'>{userData.name}</p>
        )}
        <div className='commentStats'>
          {commentSystem && commentSystem === 'personal' ? (
            ''
          ) : (
            <span className='votes'>{commentData.score} Likes | </span>
          )}
          <span className='date'>
            {moment(commentData.creationDate).fromNow()}
          </span>
        </div>
      </div>
    </div>
  )
}
