// const delay = async (ms: number) =>
// 	await new Promise((resolve) => setTimeout(resolve, ms))

// function to fetch users
// Note: function outside of component must not use setStates
// react-query injected some parameters
export const fetchUsers = async ({ pageParam = 1 }: { pageParam?: number }) => {
	// await delay(1000)
	return await fetch(
		`https://randomuser.me/api/?results=10&seed=jvaldiv8&page=${pageParam}`
	)
		.then(async (res) => {
			if (!res.ok) throw new Error('request error') // <- best way to validate a request fetch
			return await res.json()
		})
		.then((res) => {
			const currentPage = Number(res.info.page)
			const nextCursor = currentPage > 3 ? undefined : currentPage + 1 // set limit of pages
			return {
				users: res.results,
				nextCursor,
			}
		})
}
