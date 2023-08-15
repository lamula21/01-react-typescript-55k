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

	// #3 Sort By Country
	const sortedUsers = sortByCountry
		? [...users].sort((a, b) =>
				a.location.country.localeCompare(b.location.country)
		  )
		: users

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
