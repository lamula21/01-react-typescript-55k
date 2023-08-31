import { useInfiniteQuery } from '@tanstack/react-query'
import { type User } from '../types'
import { fetchUsers } from '../services/fetchUsers'

// Custome Hook
export const useUsers = () => {
	// Takes two parameters, key and async function
	const { isError, isLoading, data, refetch, fetchNextPage, hasNextPage } =
		useInfiniteQuery<{
			users: User[]
			nextCursor?: number
		}>(
			['users'], // key
			// async () => fetchUsers(1), // async function
			fetchUsers, // passed a function, react-query injects some parameters into the function
			// extra config
			{
				getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
				// by default, react-query refetches the data when users is out of focus from window
				refetchOnWindowFocus: false, // off refetch on focus
				staleTime: 1000 * 3, // data is fresh for 3 seconds, after it, it's considered outdated data (stale )
				// retryDelay: 1000 * 3, // how much time needs to wait for refetching after a fetch error
			}
		)

	return {
		isError,
		isLoading,
		users: data?.pages.flatMap((page) => page.users) ?? [], // users & inifinity scroll
		refetch,
		fetchNextPage,
		hasNextPage,
	}
}
