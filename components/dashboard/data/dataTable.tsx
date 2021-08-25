import Heading from '@/components/heading'
import ExpansionButton from '@/components/buttons/expansionButton'
import { useState } from 'react'

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
	const [open, setOpenState] = useState(true)
	function toggleExpand(e) {
		setOpenState(!open)
	}

	const head = (
		<div className='flex flex-row'>
			<Heading level={2}>Data</Heading>
			<ExpansionButton expanded={open} fn={toggleExpand} />
		</div>
	)

	if (!open) {
		return head
	}

	return (
		<section>
			{head}
			{variables.map((v, i) => (
				<Row variable={v} key={i} />
			))}
		</section>
	)
}

export default DataTable
