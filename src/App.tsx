import './App.css'
import { SortBy, type User } from './types.d'
import { useMemo, useState } from 'react'
// import { useQuery } from '@tanstack/react-query'
import { useInfiniteQuery } from '@tanstack/react-query' // inifinity pagination

import UserList from './components/UserList'
import { useUsers } from './hooks/userUsers'
import { Results } from './components/Results'

function App() {
	const { isLoading, isError, users, refetch, fetchNextPage, hasNextPage } =
		useUsers()

	// const [users, setUsers] = useState<User[]>([]) // useQuery manages this
	const [showColors, setShowColors] = useState(false)
	const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
	// const originalUsers = useRef<User[]>([]) // useQuery manages this
	const [filterCountry, setFilterCountry] = useState<string | null>(null)

	// Error & Pagination
	// const [loading, setLoading] = useState(false) // useQuery manages this
	// const [error, setError] = useState(false) // useQuery manages this
	// const [currentPage, setCurrentPage] = useState(1) // useInfinityQuery manages this

	const toggleColors = () => {
		setShowColors(!showColors)
	}

	const toggleSortByCountry = () => {
		const newSortingValue =
			sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
		setSorting(newSortingValue)
	}

	// #4 Delete Users
	const handleDelete = (email: string) => {
		// const filteredUsers = users.filter((user) => user.email !== email)
		// setUsers(filteredUsers)
	}

	// #5 Reset Users
	const handleReset = () => {
		// setUsers(originalUsers.current)
		refetch()
	}

	const handleChangeSort = (sort: SortBy) => {
		setSorting(sort)
	}

	// useQuery manages this
	// // #1 Fetch 100 rows
	// useEffect(() => {
	// 	// Loading
	// 	setLoading(true)
	// 	setError(false)

	// 	fetchUsers(currentPage)
	// 		.then((users) => {
	// 			setUsers((prevUsers) => {
	// 				const newUsers = prevUsers.concat(users)
	// 				originalUsers.current = newUsers
	// 				return newUsers
	// 			})
	// 		})
	// 		.catch((err) => {
	// 			setError(err)
	// 			console.log(err)
	// 		})
	// 		.finally(() => setLoading(false))
	// }, [currentPage]) // renders everytime currentPage changes

	// #8 Filter by Country
	// #9 useMemo to avoid unnecessary re-renders
	// Re-render when [dependecies] changes
	const filteredByCountry = useMemo(() => {
		// console.log('calculate filterByCountry')
		return typeof filterCountry === 'string' && filterCountry.length > 0
			? users.filter((user) =>
					user.location.country
						.toLowerCase()
						.includes(filterCountry.toLowerCase())
			  )
			: users
	}, [users, filterCountry]) // -> Run once and re-run only when users/filterCountry changes

	// #3 Sort By Country
	// #9 useMemo to avoid unnecessary re-renders
	const sortedUsers = useMemo(() => {
		// console.log('calculate sortedUsers')

		if (sorting === SortBy.NONE) return filteredByCountry

		const compareProperties: Record<string, (user: User) => string> = {
			[SortBy.COUNTRY]: (user) => user.location.country,
			[SortBy.NAME]: (user) => user.name.first,
			[SortBy.LAST]: (user) => user.name.last,
		}

		return [...filteredByCountry].sort((a, b) => {
			const extractProperty = compareProperties[sorting]
			return extractProperty(a).localeCompare(extractProperty(b))
		})
	}, [filteredByCountry, sorting]) // Run once and re-run only when these two changes

	return (
		<>
			<h1>Technical Test</h1>
			<Results />
			<header>
				<button onClick={toggleColors}>Change Color</button>
				<button onClick={toggleSortByCountry}>
					{sorting === SortBy.COUNTRY ? 'Unsort' : 'Sort By Country'}
				</button>
				<button onClick={handleReset}>Reset</button>
				<input
					placeholder="Filter by Country"
					onChange={(e) => {
						setFilterCountry(e.target.value)
					}}
				/>
			</header>
			<main>
				{/* Note here */}
				{users.length > 0 && (
					<UserList
						showColors={showColors}
						users={sortedUsers}
						deleteUser={handleDelete}
						changeSorting={handleChangeSort}
					/>
				)}

				{isLoading && <strong>Loading....</strong>}

				{isError && <p>There has been an error!</p>}

				{!isLoading && !isError && users.length === 0 && (
					<p>There is not users</p>
				)}

				{!isLoading && !isError && hasNextPage && (
					<button onClick={() => fetchNextPage()}>Load more results...</button>
				)}

				{!isLoading && !isError && !hasNextPage && <p>No more results</p>}
			</main>
		</>
	)
}

export default App
