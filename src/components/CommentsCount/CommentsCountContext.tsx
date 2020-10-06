import React, {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState
} from 'react'
import { AnyQueryKey, CachedQuery, QueryCache, queryCache } from 'react-query'
import { getCommentsCounts } from '../../utils/commentoApi'
import { useCommentoAuthContext } from '../CommentoAuthContext'
import { produce } from 'immer'
interface PageCommentData {
  commentCount: number
  loading: boolean
}
interface CommentCountContextState {
  [pageID: string]: PageCommentData
}

enum ACTIONS {
  ADD_NEW_PAGEIDS = 'add-new-keys',
  UPDATE_PAGE_ID = 'update-page-id'
}
interface CommentCountContextAction {
  type: ACTIONS
  data: any
}

const CommentCountStateReducer = (
  state: CommentCountContextState,
  action: CommentCountContextAction
) => {
  switch (action.type) {
    case ACTIONS.ADD_NEW_PAGEIDS: {
      const commentsCountData = action.data as { [pageID: string]: number }
      return produce(state, draftState => {
        Object.entries(commentsCountData).forEach(([pageId, commentCount]) => {
          draftState[pageId] = {
            commentCount: commentCount || 0,
            loading: isNaN(commentCount)
          }
        })
      })
    }

    case ACTIONS.UPDATE_PAGE_ID: {
      const pageCountData = action.data as {
        pageId: string
        commentCount: number
      }
      return produce(state, draftState => {
        draftState[pageCountData.pageId] = {
          commentCount: pageCountData.commentCount || 0,
          loading: false
        }
      })
    }

    default:
      break
  }
  return state
}

interface CommentCountContextProps {
  commentCounts: CommentCountContextState
  dispatch: React.Dispatch<CommentCountContextAction> | null
  addNewPageIDs: (pageIds: string[]) => void
  _addPageID: (pageId: string) => void
}

const CommentCountContext = React.createContext<CommentCountContextProps>({
  commentCounts: {},
  dispatch: null,
  addNewPageIDs: () => {},
  _addPageID: () => {}
})

export const useCommentsCountContext = () => useContext(CommentCountContext)

const verifyCommentCountQueryKey = (queryKey: AnyQueryKey) => {
  return {
    isMatching:
      Array.isArray(queryKey) &&
      queryKey.includes('commentCount') &&
      queryKey.length === 2,
    pageId: queryKey[1] as string
  }
}

const createCacheUpdateHandler = (
  dispatch: React.Dispatch<CommentCountContextAction>
) => (
  _queryCache: QueryCache,
  query?: CachedQuery<unknown, unknown> | undefined
) => {
  if (!query) return
  const queryKey = query?.queryKey
  const { isMatching, pageId } = verifyCommentCountQueryKey(queryKey)
  if (isMatching) {
    const queryData = query?.state.data as number
    dispatch({
      type: ACTIONS.UPDATE_PAGE_ID,
      data: {
        pageId,
        commentCount: queryData
      }
    })
  }
}

interface CommentCountContextProviderProps {
  children: any
  staleTime?: number
}

export const CommentsCountContextProvider: React.FC<CommentCountContextProviderProps> = ({
  children,
  staleTime = 420000
}) => {
  const [commentsCountData, dispatch] = useReducer(CommentCountStateReducer, {})
  const { isAuthenticated } = useCommentoAuthContext()
  const [pendingPageIds, setPendingPageIds] = useState<string[]>([])

  useEffect(() => {
    const queryCacheUpdateHandler = createCacheUpdateHandler(dispatch)
    const unsubscribe = queryCache.subscribe(queryCacheUpdateHandler)
    return unsubscribe
  }, [dispatch])

  useEffect(() => {
    let clearTimeoutRef: number
    const pendingPageIdslength = pendingPageIds.length
    if (pendingPageIdslength > 0) {
      clearTimeoutRef = window.setTimeout(() => {
        addNewPageIDs(pendingPageIds)
        setPendingPageIds([])
      }, 50)
    }
    return () => {
      if (clearTimeoutRef) clearTimeout(clearTimeoutRef)
    }
  }, [pendingPageIds])

  const addNewPageIDs = useCallback(
    async (pageIds: string[]) => {
      if (!isAuthenticated) return
      const pageCountData: { [pageId: string]: number | undefined } = {}
      const pageIdsWithNoData: string[] = []

      pageIds.forEach(pageId => {
        const query = queryCache.getQuery(['commentCount', pageId])
        if (query && !query?.state.isStale) {
          const count: number | undefined = query?.state.data as number
          if (!isNaN(count)) {
            pageCountData[pageId] = count
          } else {
            pageCountData[pageId] = undefined
            pageIdsWithNoData.push(pageId)
          }
        } else {
          pageCountData[pageId] = undefined
          pageIdsWithNoData.push(pageId)
        }
      })

      dispatch({
        type: ACTIONS.ADD_NEW_PAGEIDS,
        data: pageCountData
      })

      if (pageIdsWithNoData.length > 0) {
        const { commentCounts, success } = await getCommentsCounts(
          pageIdsWithNoData
        )

        if (success) {
          pageIdsWithNoData.forEach(pageId => {
            const commentCount = commentCounts[pageId]
            queryCache.setQueryData(
              ['commentCount', pageId],
              commentCount || 0,
              {
                staleTime,
                cacheTime: staleTime
              }
            )
          })
        }
      }
    },
    [isAuthenticated]
  )

  const _addPageID = useCallback((pageId: string) => {
    setPendingPageIds(prev => [...prev, pageId])
  }, [])

  return (
    <CommentCountContext.Provider
      value={{
        commentCounts: commentsCountData,
        dispatch,
        addNewPageIDs,
        _addPageID
      }}
    >
      {children}
    </CommentCountContext.Provider>
  )
}

export default CommentsCountContextProvider
