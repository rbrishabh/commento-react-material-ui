import React, { useEffect } from 'react'
import { useCommentoAuthContext } from '../CommentoAuthContext'
import { useCommentsCountContext } from './CommentsCountContext'

interface Props {
  pageId: string
  children: (loading: boolean, commentCounts: number | undefined) => any
}

export const CommentCountContextConsumer: React.FC<Props> = ({
  pageId,
  children
}) => {
  const { commentCounts, _addPageID } = useCommentsCountContext()
  const { isAuthenticated } = useCommentoAuthContext()

  useEffect(() => {
    if (isAuthenticated) {
      _addPageID(pageId)
    }
  }, [pageId, isAuthenticated])

  return (
    <div>
      {children(
        commentCounts[pageId] && commentCounts[pageId].loading,
        commentCounts[pageId] && commentCounts[pageId].commentCount
      )}
    </div>
  )
}
