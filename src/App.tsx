import { useEffect, useRef, useState } from 'react'
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

	// #1 Fetch 100 rows
	useEffect(() => {
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
	const filteredByCountry =
		typeof filterCountry === 'string' && filterCountry.length > 0
			? users.filter((user) =>
					user.location.country
						.toLowerCase()
						.includes(filterCountry.toLowerCase())
			  )
			: users

	// #3 Sort By Country
	const sortedUsers = sortByCountry
		? [...filteredByCountry].sort((a, b) =>
				a.location.country.localeCompare(b.location.country)
		  )
		: filteredByCountry

	// #4 Delete Users
	const handleDelete = (email: string) => {
		const filteredUsers = users.filter((user) => user.email !== email)
		setUsers(filteredUsers)
	}

	// #5 Reset Users
	const resetUsers = () => setUsers(originalUsers.current)

	return (
		<>
			<h1>Technical Test</h1>
			<header>
				<button onClick={toggleColors}>Change Color</button>
				<button onClick={toggleSortByCountry}>Sort By Country</button>
				<button onClick={resetUsers}>Reset</button>
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
				/>
			</main>
		</>
	)
}

export default App
