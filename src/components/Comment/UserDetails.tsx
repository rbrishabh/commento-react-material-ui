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
        commentData.deleted || !(userData && userData.photo) ? (
          <div className='figure'>
            <div className='anonymous-image'>?</div>
          </div>
        ) : (
          <div className='figure'>
            <img src={userData?.photo} alt='User Image' className='avatar' />
          </div>
        )
      ) : (
        ''
      )}

      <div className='commentHeader_content'>
        {commentSystem && commentSystem === 'personal' ? (
          ''
        ) : (
          <p>
            <span className='username'>{userData.name} </span>
            <span className='date'>
              {moment(commentData.creationDate).format('h.mm')}
            </span>
            <span className='ampm'>
              {moment(commentData.creationDate).format('a')}
            </span>
          </p>
        )}
        <div className='commentStats'>
          {commentSystem && commentSystem === 'personal' ? (
            ''
          ) : (
            <span className='votes'>
              {commentData.score} {commentData.score === 1 ? 'Like' : 'Likes'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
