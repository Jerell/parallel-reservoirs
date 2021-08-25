import DashSection from '../dashSection'

const variables = ['Pressure (bar)', 'Temperature (°C)', 'Flowrate (MTPA)']

const zeros = [0, 0, 0, 0, 0, 0, 0, 0]

const Cell = ({ children, index = 0 }) => {
	return (
		<div
			className={`${
				index % 2 ? 'bg-gray-400' : 'bg-gray-300'
			} bg-opacity-20 text-right py-5 pr-5 font-semibold text-pace-grey flex-grow`}
		>
			{children}
		</div>
	)
}

const Row = ({ variable }) => {
	return (
		<div className='relative flex flex-row'>
			<h6 className='absolute top-2 left-2 text-sm'>{variable}</h6>
			{zeros.map((z, i) => (
				<Cell key={i} index={i}>
					0.00
				</Cell>
			))}
		</div>
	)
}

const DataTable = () => {
	return (
		<DashSection heading='Data'>
			{variables.map((v, i) => (
				<Row variable={v} key={i} />
			))}
		</DashSection>
	)
}

export default DataTable
