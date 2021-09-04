const headings = [
	'Node',
	'Pressure (Pa)',
	'Temperature (C)',
	'Flowrate (MTPA)',
];
const h = (text, i) => (
	<th className='p-2' key={i}>
		{text}
	</th>
);

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
];

const row = ({ name, pressure = 0, temperature = 0, flowrate = 0 }, i) => {
	const cell = (content) => (
		<td className={`px-4 py-1 border-l border-green-300`}>{content}</td>
	);
	return (
		<tr className={`hover:bg-green-200`} key={i}>
			{cell(name)}
			{cell(pressure)}
			{cell(temperature)}
			{cell(flowrate)}
		</tr>
	);
};

const PTQTable = () => (
	<table className='table-auto'>
		<thead className='border-b border-green-300 italic'>
			<tr>{headings.map(h)}</tr>
		</thead>
		<tbody>{rows.map(row)}</tbody>
	</table>
);

export default PTQTable;
