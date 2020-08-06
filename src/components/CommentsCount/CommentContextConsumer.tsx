import React from 'react'
import { useCommentsCountContext } from './CommentsCountContext'

interface Props {
  pageId: string
  children: (
    loading: boolean,
    commentCounts: number | undefined
  ) => React.ReactElement
}

export const CommentContextConsumer: React.FC<Props> = ({
  pageId,
  children
}) => {
  const { loading, commentCounts } = useCommentsCountContext()
  return children(loading, commentCounts && commentCounts[pageId])
}
