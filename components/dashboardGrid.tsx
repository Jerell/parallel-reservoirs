const columns = 3

const GridSpace = ({ children, cols = 1, fullWidth = false }) => {
	cols = Math.max(1, Math.min(cols, columns))

	return (
		<section
			className={`bg-green-200 m-2 ${
				fullWidth ? `col-span-full` : `col-span-${cols}`
			}`}
		>
			{children}
		</section>
	)
}

const DashboardGrid = () => {
	const area1 = (
		<GridSpace>
			<h3 className='text-lg font-semibold'>info</h3>
		</GridSpace>
	)

	const area2 = (
		<GridSpace cols={2}>
			<h3 className='text-xl font-semibold'>map</h3>
		</GridSpace>
	)

	const area3 = (
		<GridSpace fullWidth>
			<h3 className='text-lg font-semibold'>tables</h3>
		</GridSpace>
	)

	return (
		<div className='grid grid-cols-1 lg:grid-cols-3 grid-rows-2 h-full p-2'>
			{area1}
			{area2}
			{area3}
		</div>
	)
}

export default DashboardGrid
