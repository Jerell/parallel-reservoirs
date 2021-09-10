import Heading from '@/components/heading';
import DashSection from '../dashSection';
import FillerBox from '../fillerBox';
import dummyLOFData from './dummyLOFData';
import LineChart from './vis/lineChart';
import {
	Pressure,
	PressureUnits,
	Temperature,
	TemperatureUnits,
	Flowrate,
	FlowrateUnits,
} from 'physical-quantities';

const variables = ['Pressure (bar)', 'Temperature (°C)', 'Flowrate (MTPA)'];

const GraphRow = ({
	variable = 'graphs',
	hoverColumn,
	setHoverColumn,
	data,
}) => {
	const getValueInCorrectUnits = (rawValue) => {
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

	const getData = (i: number) => {
		return (data[variable][i] as number[]).map((d) =>
			getValueInCorrectUnits(d)
		);
	};

	const allDataInCorrectUnits = data[variable].map((arr, i) => getData(i));

	const arrayToP = (arr: any[], fn = (n) => n) =>
		arr.map((a, i) => <p key={i}>{fn(a)}</p>);

	const min = Math.min(...allDataInCorrectUnits.flat());
	const max = Math.max(...allDataInCorrectUnits.flat());

	return (
		<>
			<Heading level={4}>{variable}</Heading>
			<div className='col-span-full flex flex-row border-b border-gray-300'>
				{Array(8)
					.fill(1)
					.map((n, i) => (
						<FillerBox
							key={i}
							index={i}
							height={48}
							additionalClasses='border-r-2 border-dashed'
							isHovered={i === hoverColumn}
							setHoverColumn={setHoverColumn}
						>
							{/* {arrayToP(data[variable][i], (n: number) => n.toFixed(2))} */}
							<LineChart key={i} data={getData(i)} min={min} max={max} />
						</FillerBox>
					))}
			</div>
		</>
	);
};

const Graphs = ({
	heading = 'graphs',
	hoverColumn,
	setHoverColumn,
	data = dummyLOFData,
}) => {
	return (
		<DashSection heading={heading}>
			{variables.map((v, i) => (
				<GraphRow
					variable={Object.keys(data)[i]}
					key={i}
					hoverColumn={hoverColumn}
					setHoverColumn={setHoverColumn}
					data={data}
				/>
			))}
		</DashSection>
	);
};

export default Graphs;
