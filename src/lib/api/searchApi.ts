import { baseApi } from './baseApi'

export type SearchResultType = 'student' | 'group' | 'session'

export interface SearchResult {
  id:       string
  type:     SearchResultType
  title:    string
  subtitle?: string
  url:      string
}

export interface SearchResponse {
  success: boolean
  data: {
    results: SearchResult[]
  }
}

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    globalSearch: builder.query<SearchResponse, string>({
      query: (q) => ({
        url:    '/search',
        params: { q },
      }),
    }),
  }),
})

export const { useGlobalSearchQuery } = searchApi
