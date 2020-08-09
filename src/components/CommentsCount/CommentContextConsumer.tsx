import React from 'react'
import { useCommentsCountContext } from './CommentsCountContext'

interface Props {
  pageId: string
  children: (loading: boolean, commentCounts: number | undefined) => any
}

export const CommentContextConsumer: React.FC<Props> = ({
  pageId,
  children
}) => {
  const { loading, commentCounts } = useCommentsCountContext()
  return <div>{children(loading, commentCounts && commentCounts[pageId])}</div>
}
