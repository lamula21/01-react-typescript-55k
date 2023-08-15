import { type User } from '../types'

interface Props {
	users: User[]
	showColors: boolean
}
export default function UserList({ showColors, users }: Props) {
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
					users.map((users, index) => {
						// #3 Change colors to the table
						const backgroundColor = index % 2 === 0 ? '#333' : '#555'
						const color = showColors ? backgroundColor : 'transparent'

						return (
							// key: here has a issue
							<tr key={index} style={{ backgroundColor: color }}>
								<td>
									<img src={users.picture.thumbnail} />
								</td>
								<td> {users.name.first} </td>
								<td> {users.name.last} </td>
								<td> {users.location.country} </td>
								<td>
									<button>Delete</button>
								</td>
							</tr>
						)
					})}
			</tbody>

			<tfoot></tfoot>
		</table>
	)
}
