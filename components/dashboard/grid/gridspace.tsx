const columns = 3

const GridSpace = ({ children, cols = 1, fullWidth = false }) => {
	cols = Math.max(1, Math.min(cols, columns))

	return (
		<section
			className={`border-blue-500 border-t border-l m-2 p-2 rounded-md ${
				fullWidth ? `col-span-full` : `col-span-${cols}`
			}`}
		>
			{children}
		</section>
	)
}

export default GridSpace
