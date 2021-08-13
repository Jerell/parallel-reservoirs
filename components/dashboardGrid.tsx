import NumberInput from './numberInput'
import Button from './button'

const columns = 3

const GridSpace = ({ children, cols = 1, fullWidth = false }) => {
	cols = Math.max(1, Math.min(cols, columns))

	return (
		<section
			className={`bg-green-50 m-2 p-2 rounded-sm ${
				fullWidth ? `col-span-full` : `col-span-${cols}`
			}`}
		>
			{children}
		</section>
	)
}

const DashboardGrid = () => {
	const heading = (text) => (
		<h3 className='text-lg font-semibold mb-4'>{text}</h3>
	)

	const area1 = (
		<GridSpace>
			{heading('input')}
			<div>
				<NumberInput label='flowrate' unit='kg/s' />
			</div>
			<div className='mt-2'>
				<Button />
			</div>
		</GridSpace>
	)

	const area2 = <GridSpace cols={2}>{heading('map')}</GridSpace>

	const area3 = <GridSpace fullWidth>{heading('tables&graphs')}</GridSpace>

	return (
		<div className='grid grid-cols-1 lg:grid-cols-3 grid-rows-2 h-full p-2 bg-blue-100'>
			{area1}
			{area2}
			{area3}
		</div>
	)
}

export default DashboardGrid
