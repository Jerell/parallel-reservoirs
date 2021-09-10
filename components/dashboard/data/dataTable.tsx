import DashSection from '../dashSection';
import {
	Pressure,
	PressureUnits,
	Temperature,
	TemperatureUnits,
	Flowrate,
	FlowrateUnits,
} from 'physical-quantities';

import getDefaultUnitLabel from '@/public/utils/selectDefaultUnitLabel';

const dummy = [
	{ pressure: 35.7, temperature: 27, flowrate: 1.0 }, // Compressor
	{ pressure: 33.4, temperature: 27, flowrate: 1.0 }, // Douglas Manifold
	{ pressure: 17.2, temperature: 27, flowrate: 0.6 }, // Hamilton Wellhead
	{ pressure: 39.0, temperature: 27, flowrate: 0.6 }, // Hamilton
	{ pressure: 25.3, temperature: 27, flowrate: 0.2 }, // Hamilton North Wellhead
	{ pressure: 28.9, temperature: 27, flowrate: 0.2 }, // Hamilton North
	{ pressure: 32.0, temperature: 27, flowrate: 0.2 }, // Lennox Wellhead
	{ pressure: 36.8, temperature: 27, flowrate: 0.2 }, // Lennox
];

const variables = ['pressure', 'temperature', 'flowrate'];

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

const Row = ({ variable, unit, label, hoverColumn, setHoverColumn, data }) => {
	const getValueInCorrectUnits = (i) => {
		const rawValue = data[i][variable];

		switch (variable) {
			case 'pressure':
				return new Pressure(rawValue, PressureUnits.Pascal).bara;
			case 'temperature':
				return new Temperature(rawValue, TemperatureUnits.Kelvin).celsius;
			case 'flowrate':
				return new Flowrate(rawValue, FlowrateUnits.Kgps).MTPA;
		}
		return 0;
	};

	return (
		<div className='relative grid grid-cols-8'>
			<h6 className='absolute top-2 left-2 text-sm'>{label}</h6>
			{zeros.map((z, i) => (
				<Cell
					key={i}
					index={i}
					hoverColumn={hoverColumn}
					setHoverColumn={setHoverColumn}
				>
					{getValueInCorrectUnits(i).toFixed(2)}
				</Cell>
			))}
		</div>
	);
};

const DataTable = ({
	heading = 'data',
	hoverColumn,
	setHoverColumn,
	data = dummy,
}) => {
	const units = {
		pressure: PressureUnits.Bara,
		temperature: TemperatureUnits.Celsius,
		flowrate: FlowrateUnits.MTPA,
	};

	return (
		<DashSection heading={heading}>
			{variables.map((v, i) => (
				<Row
					variable={v}
					label={getDefaultUnitLabel(v)}
					key={i}
					hoverColumn={hoverColumn}
					setHoverColumn={setHoverColumn}
					data={data}
					unit={units[v]}
				/>
			))}
		</DashSection>
	);
};

export default DataTable;
