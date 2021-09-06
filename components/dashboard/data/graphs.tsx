import Heading from '@/components/heading';
import DashSection from '../dashSection';
import FillerBox from '../fillerBox';

const variables = ['Pressure (bar)', 'Temperature (°C)', 'Flowrate (MTPA)'];

const GraphRow = ({ heading = 'graphs', hoverColumn, setHoverColumn }) => {
	return (
		<>
			<Heading level={4}>{heading}</Heading>
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
							{i}
						</FillerBox>
					))}
			</div>
		</>
	);
};

const Graphs = ({ hoverColumn, setHoverColumn }) => {
	return (
		<DashSection heading='graphs'>
			{variables.map((v, i) => (
				<GraphRow
					heading={v}
					key={i}
					hoverColumn={hoverColumn}
					setHoverColumn={setHoverColumn}
				/>
			))}
		</DashSection>
	);
};

export default Graphs;
