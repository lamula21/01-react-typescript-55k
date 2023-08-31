import { useUsers } from '../hooks/userUsers'

// useQuery gives a global state: users
export function Results() {
	const { users } = useUsers() // users is stored in cache, global state. it does not refetch this data
	return <h3>{users.length}</h3>
}
