import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { type User } from './types.d'
import UserList from './components/UserList'

function App() {
	const [users, setUsers] = useState<User[]>([])
	const [showColors, setShowColors] = useState(false)
	const [sortByCountry, setSortByCountry] = useState(false)
	const originalUsers = useRef<User[]>([])
	const [filterCountry, setFilterCountry] = useState<string | null>(null)

	const toggleColors = () => {
		setShowColors(!showColors)
	}

	const toggleSortByCountry = () => {
		setSortByCountry((prevState) => !prevState)
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
		return sortByCountry
			? [...filteredByCountry].sort((a, b) =>
					a.location.country.localeCompare(b.location.country)
			  )
			: filteredByCountry
	}, [filteredByCountry, sortByCountry]) // Run once and re-run only when these two changes

	return (
		<>
			<h1>Technical Test</h1>
			<header>
				<button onClick={toggleColors}>Change Color</button>
				<button onClick={toggleSortByCountry}>Sort By Country</button>
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
					users={sortedUsers.length == 0 ? users : sortedUsers}
					deleteUser={handleDelete}
				/>
			</main>
		</>
	)
}

export default App
