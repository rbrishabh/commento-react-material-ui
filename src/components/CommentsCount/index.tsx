import React, { useState, useEffect, ReactNode } from 'react'
import { useCommentoAuthContext } from '../CommentoAuthContext'
import { getCommentCount, CommentCountResponse } from '../../utils/commentoApi'
import { useQuery } from 'react-query'

interface CommentsCountProps {
  pageId: string
  children: (renderProps: RenderProps) => ReactNode
}

interface RenderProps {
  commentsLength: number
  commentsLoaded: boolean
  isAuthenticated: boolean
  isAuthenticating: boolean
}

export const CommentsCount: React.FC<CommentsCountProps> = ({
  pageId,
  children
}) => {
  const [commentsLoaded, setCommentsLoaded] = useState<boolean>(false)
  const [commentsLength, setcommentsLength] = useState(0)
  const { isAuthenticated, isAuthenticating } = useCommentoAuthContext()
  const {
    isLoading: areCommentsLoading,
    data: commentsResponse,
    isIdle: isCommentsRequestidle
  } = useQuery(pageId, getCommentCount, { enabled: isAuthenticated })

  useEffect(() => {
    let isMounted = true
    if (areCommentsLoading || isCommentsRequestidle)
      return setCommentsLoaded(false)
    const { commentCount, success } = commentsResponse as CommentCountResponse
    if (isMounted && success) {
      setcommentsLength(commentCount)
      setCommentsLoaded(true)
    }
    return () => {
      isMounted = false
    }
  }, [areCommentsLoading, isCommentsRequestidle, commentsResponse])

  const renderProps = {
    commentsLength,
    commentsLoaded,
    isAuthenticated,
    isAuthenticating
  } as RenderProps
  return <div>{children(renderProps)}</div>
}
