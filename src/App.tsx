import { useEffect, useState } from 'react'
import './App.css'
import { type User } from './types.d'
import UserList from './components/UserList'

function App() {
	const [users, setUsers] = useState<User[]>([])
	const [showColors, setShowColors] = useState(false)
	const [sortByCountry, setSortByCountry] = useState(false)

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

	return (
		<>
			<h1>Technical Test</h1>
			<header>
				<button onClick={toggleColors}>Change Color</button>
				<button onClick={toggleSortByCountry}>Sort By Country</button>
			</header>
			<main>
				<UserList showColors={showColors} users={sortedUsers} />
			</main>
		</>
	)
}

export default App
