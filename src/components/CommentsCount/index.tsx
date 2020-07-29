import React, { useState, useEffect, ReactNode } from 'react'
import { useCommentoAuthContext } from '../CommentoAuthContext'
import { fetchComments } from '../../utils/commentoApi'

interface CommentsCountProps {
  pageId: string
  children: (
    commentsLength: number,
    commentsLoaded: Boolean,
    isAuthenticated: Boolean,
    isAuthenticating: Boolean
  ) => ReactNode
}

export const CommentsCount: React.FC<CommentsCountProps> = ({
  pageId,
  children
}) => {
  const [commentsLoaded, setCommentsLoaded] = useState<boolean>(false)
  const [commentsLength, setcommentsLength] = useState(0)
  const { isAuthenticated, isAuthenticating } = useCommentoAuthContext()
  useEffect(() => {
    let isMouted = true
    if (isAuthenticated) {
      const getComments = async () => {
        // get comments usins the commentoProvider
        let { comments } = await fetchComments(pageId)
        comments = comments.filter(comment => !comment.deleted)
        if (isMouted) {
          setcommentsLength(comments.length)
          setCommentsLoaded(true)
        }
      }
      getComments()
    }
    return () => {
      isMouted = false
    }
  }, [pageId, isAuthenticated])

  return (
    <div>
      {children(
        commentsLength,
        commentsLoaded,
        isAuthenticated,
        isAuthenticating
      )}
    </div>
  )
}
