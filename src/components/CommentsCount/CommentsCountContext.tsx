import React, { useContext } from 'react'
import { useQuery } from 'react-query'
import { getCommentsCounts } from '../../utils/commentoApi'
import { useCommentoAuthContext } from '../CommentoAuthContext'

interface CommentCountContextProps {
  commentCounts?: { [pageId: string]: number }
  loading: boolean
  queryKey: any
}

interface CommentCountContextProviderProps {
  pageIds: Array<string>
  children: any
}

const _getCommentsCounts = async (_key: string, pageIds: string[]) =>
  await getCommentsCounts(pageIds)

const CommentCountContext = React.createContext<CommentCountContextProps>({
  commentCounts: {},
  loading: false,
  queryKey: ''
})

export const useCommentsCountContext = () => useContext(CommentCountContext)
export const CommentsCountContextProvider: React.FC<CommentCountContextProviderProps> = ({
  pageIds,
  children
}) => {
  const { isAuthenticated } = useCommentoAuthContext()
  const { data, isLoading, isIdle, isError } = useQuery(
    ['commentsCount', pageIds],
    _getCommentsCounts,
    { enabled: isAuthenticated }
  )

  return (
    <CommentCountContext.Provider
      value={{
        commentCounts: data?.commentCounts,
        loading: isIdle || isLoading || isError,
        queryKey: ['commentsCount', pageIds]
      }}
    >
      {children}
    </CommentCountContext.Provider>
  )
}

export default CommentsCountContextProvider
