const DashboardGrid = ({ children }) => {
	return (
		<div className='grid grid-cols-1 lg:grid-cols-3 grid-rows-2 h-full p-2 '>
			{children}
		</div>
	)
}

export default DashboardGrid
