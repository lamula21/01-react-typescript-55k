import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { SortBy, type User } from './types.d'
import UserList from './components/UserList'

function App() {
	const [users, setUsers] = useState<User[]>([])
	const [showColors, setShowColors] = useState(false)
	const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
	const originalUsers = useRef<User[]>([])
	const [filterCountry, setFilterCountry] = useState<string | null>(null)

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
		const filteredUsers = users.filter((user) => user.email !== email)
		setUsers(filteredUsers)
	}

	// #5 Reset Users
	const handleReset = () => {
		setUsers(originalUsers.current)
	}

	const handleChangeSort = (sort: SortBy) => {
		setSorting(sort)
	}

	// #1 Fetch 100 rows
	useEffect(() => {
		console.log('useEffect')
		fetch('https://randomuser.me/api/?results=100')
			.then(async (res) => await res.json())
			.then((res) => {
				setUsers(res.results)
				originalUsers.current = res.results
			})
			.catch((err) => {
				console.log(err)
			})
	}, [])

	// #8 Filter by Country
	// #9 useMemo to avoid unnecessary re-renders
	// Re-render when [dependecies] changes
	const filteredByCountry = useMemo(() => {
		console.log('calculate filterByCountry')
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
		console.log('calculate sortedUsers')

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
			<header>
				<button onClick={toggleColors}>Change Color</button>
				<button onClick={toggleSortByCountry}>
					{sorting === SortBy.COUNTRY ? 'Unsort' : 'Sort By Country'}
				</button>
				<button onClick={handleReset}>Reset</button>
				<input
					placeholder='Filter by Country'
					onChange={(e) => {
						setFilterCountry(e.target.value)
					}}
				/>
			</header>
			<main>
				<UserList
					showColors={showColors}
					users={sortedUsers}
					deleteUser={handleDelete}
					changeSorting={handleChangeSort}
				/>
			</main>
		</>
	)
}

export default App
