import NumberInput from './numberInput'
import Button from './button'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const Cyto = dynamic(() => import('@/components/vis/cyto/cyto'), { ssr: false })

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
			<div className='mt-10'>
				<p>
					The map in the next panel is made with{' '}
					<Link href='https://js.cytoscape.org/'>
						<span className='font-bold hover:underline cursor-pointer text-blue-800 hover:text-indigo-500'>
							Cytoscape
						</span>
					</Link>
					.
				</p>
			</div>
		</GridSpace>
	)

	const area2 = (
		<GridSpace cols={2}>
			<Cyto />
		</GridSpace>
	)

	const row = ({ name, pressure = 0, temperature = 0, flowrate = 0 }, i) => {
		const cell = (content) => (
			<td className={`px-4 py-1 border-l border-green-300`}>{content}</td>
		)
		return (
			<tr className={`hover:bg-green-200`} key={i}>
				{cell(name)}
				{cell(pressure)}
				{cell(temperature)}
				{cell(flowrate)}
			</tr>
		)
	}

	const headings = [
		'Node',
		'Pressure (Pa)',
		'Temperature (C)',
		'Flowrate (MTPA)',
	]
	const h = (text, i) => (
		<th className='p-2' key={i}>
			{text}
		</th>
	)

	const rows = [
		{ name: 'Inlet (Point of Ayr)', pressure: 0, temperature: 0, flowrate: 0 },
		{
			name: 'Douglas splitter/manifold',
			pressure: 0,
			temperature: 0,
			flowrate: 0,
		},
		{ name: 'Hamilton top of well', pressure: 0, temperature: 0, flowrate: 0 },
		{
			name: 'Hamilton bottom of well',
			pressure: 0,
			temperature: 0,
			flowrate: 0,
		},
		{ name: 'Hamilton reservoir', pressure: 0, temperature: 0, flowrate: 0 },
		{
			name: 'Hamilton North top of well',
			pressure: 0,
			temperature: 0,
			flowrate: 0,
		},
		{
			name: 'Hamilton North bottom of well',
			pressure: 0,
			temperature: 0,
			flowrate: 0,
		},
		{
			name: 'Hamilton North reservoir',
			pressure: 0,
			temperature: 0,
			flowrate: 0,
		},
		{ name: 'Lennox top of well', pressure: 0, temperature: 0, flowrate: 0 },
		{ name: 'Lennox bottom of well', pressure: 0, temperature: 0, flowrate: 0 },
		{ name: 'Lennox reservoir', pressure: 0, temperature: 0, flowrate: 0 },
	]

	const table = (
		<table className='table-auto'>
			<thead className='border-b border-green-300 italic'>
				<tr>{headings.map(h)}</tr>
			</thead>
			<tbody>{rows.map(row)}</tbody>
		</table>
	)

	const area3 = <GridSpace fullWidth>{table}</GridSpace>

	return (
		<div className='grid grid-cols-1 lg:grid-cols-3 grid-rows-2 h-full p-2 '>
			{area1}
			{area2}
			{area3}
		</div>
	)
}

export default DashboardGrid
