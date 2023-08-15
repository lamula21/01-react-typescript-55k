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

	return (
		<>
			<h1>Technical Test</h1>
			<header>
				<button onClick={toggleColors}>Change Color</button>
				<button onClick={toggleSortByCountry}>Sort By Country</button>
			</header>
			<main>
				<UserList showColors={showColors} users={users} />
			</main>
		</>
	)
}

export default App
