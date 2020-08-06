import React, { useContext } from 'react'
import { useQuery } from 'react-query'
import { getCommentsCounts } from '../../utils/commentoApi'
import { useCommentoAuthContext } from '../CommentoAuthContext'

interface CommentCountContextProps {
  commentCounts?: { [pageId: string]: number }
  loading: boolean
}

interface CommentCountContextProviderProps {
  pageIds: Array<string>
  children: React.ReactChild
}

const _getCommentsCounts = async (_key: string, pageIds: string[]) =>
  await getCommentsCounts(pageIds)

const CommentCountContext = React.createContext<CommentCountContextProps>({
  commentCounts: {},
  loading: false
})
export const useCommentsCountContext = () => useContext(CommentCountContext)
export const CommentsCountContextProvider: React.FC<CommentCountContextProviderProps> = ({
  pageIds,
  children
}) => {
  const { isAuthenticated } = useCommentoAuthContext()
  const { data, isLoading, isIdle, isError } = useQuery(
    ['commentCounts', pageIds],
    _getCommentsCounts,
    { enabled: isAuthenticated }
  )
  return (
    <CommentCountContext.Provider
      value={{
        commentCounts: data?.commentCounts,
        loading: isIdle || isLoading || isError
      }}
    >
      {children}
    </CommentCountContext.Provider>
  )
}

export default CommentsCountContextProvider
