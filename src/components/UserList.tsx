import { type User } from '../types'

interface Props {
	deleteUser: (email: string) => void
	users: User[]
	showColors: boolean
}
export default function UserList({ showColors, users, deleteUser }: Props) {
	// #2 Data in a table format
	return (
		<table width='100%'>
			<thead>
				<tr>
					<th>Picture</th>
					<th>Name</th>
					<th>LastName</th>
					<th>Country</th>
					<th>Actions</th>
				</tr>
			</thead>

			<tbody>
				{!users && <div>Something went wrong</div>}
				{users &&
					users.map((user, index) => {
						// #3 Change colors to the table
						const backgroundColor = index % 2 === 0 ? '#333' : '#555'
						const color = showColors ? backgroundColor : 'transparent'

						return (
							// key: here has a issue
							<tr key={index} style={{ backgroundColor: color }}>
								<td>
									<img src={user.picture.thumbnail} />
								</td>
								<td> {user.name.first} </td>
								<td> {user.name.last} </td>
								<td> {user.location.country} </td>
								<td>
									<button onClick={() => deleteUser(user.email)}>Delete</button>
								</td>
							</tr>
						)
					})}
			</tbody>

			<tfoot></tfoot>
		</table>
	)
}
