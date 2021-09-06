import DashSection from '../dashSection';

const data = [
	{ 'Pressure (bar)': 35.7, 'Temperature (°C)': 27, 'Flowrate (MTPA)': 1 }, // Compressor
	{ 'Pressure (bar)': 33.4, 'Temperature (°C)': 27, 'Flowrate (MTPA)': 1 }, // Douglas Manifold
	{ 'Pressure (bar)': 13, 'Temperature (°C)': 27, 'Flowrate (MTPA)': 1 }, // Hamilton Wellhead
	{ 'Pressure (bar)': 39, 'Temperature (°C)': 27, 'Flowrate (MTPA)': 1 }, // Hamilton
	{ 'Pressure (bar)': 1, 'Temperature (°C)': 27, 'Flowrate (MTPA)': 1 }, // Hamilton North Wellhead
	{ 'Pressure (bar)': 1, 'Temperature (°C)': 27, 'Flowrate (MTPA)': 1 }, // Hamilton North
	{ 'Pressure (bar)': 1, 'Temperature (°C)': 27, 'Flowrate (MTPA)': 1 }, // Lennox Wellhead
	{ 'Pressure (bar)': 1, 'Temperature (°C)': 27, 'Flowrate (MTPA)': 1 }, // Lennox
];

const variables = ['Pressure (bar)', 'Temperature (°C)', 'Flowrate (MTPA)'];

const zeros = [0, 0, 0, 0, 0, 0, 0, 0];

const Cell = ({ children, index = 0, hoverColumn, setHoverColumn }) => {
	function handleMouseOver() {
		setHoverColumn(index);
	}
	return (
		<div
			className={`${
				index % 2 || index === hoverColumn ? 'bg-gray-400' : 'bg-gray-300'
			} bg-opacity-${
				index === hoverColumn ? 30 : 20
			} text-right py-5 pr-5 font-semibold text-pace-grey flex-grow`}
			onMouseOver={handleMouseOver}
		>
			{children}
		</div>
	);
};

const Row = ({ variable, hoverColumn, setHoverColumn }) => {
	return (
		<div className='relative grid grid-cols-8'>
			<h6 className='absolute top-2 left-2 text-sm'>{variable}</h6>
			{zeros.map((z, i) => (
				<Cell
					key={i}
					index={i}
					hoverColumn={hoverColumn}
					setHoverColumn={setHoverColumn}
				>
					{data[i][variable]}
				</Cell>
			))}
		</div>
	);
};

const DataTable = ({ hoverColumn, setHoverColumn }) => {
	return (
		<DashSection heading='Data'>
			{variables.map((v, i) => (
				<Row
					variable={v}
					key={i}
					hoverColumn={hoverColumn}
					setHoverColumn={setHoverColumn}
				/>
			))}
		</DashSection>
	);
};

export default DataTable;
