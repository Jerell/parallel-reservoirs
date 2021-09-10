import Heading from '@/components/heading';
import DashSection from '../dashSection';
import FillerBox from '../fillerBox';
import dummyLOFData from './dummyLOFData';

const variables = ['Pressure (bar)', 'Temperature (°C)', 'Flowrate (MTPA)'];

const GraphRow = ({
	variable = 'graphs',
	hoverColumn,
	setHoverColumn,
	data,
}) => {
	const getCellData = (i) =>
		data[variable][i].map((n: number, j) => <p key={j}>{n.toFixed(2)}</p>);

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
							height={40}
							additionalClasses='border-r-2 border-dashed'
							isHovered={i === hoverColumn}
							setHoverColumn={setHoverColumn}
						>
							{getCellData(i)}
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
