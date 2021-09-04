import MapSvg from '@/public/images/map.svg';
import Heading from '@/components/heading';
import FillerBox from '@/components/dashboard/fillerBox';
import DashSection from './dashSection';

const LocationLabel = ({ children, index = 0 }) => {
	return (
		<div
			className={`${index % 2 ? 'bg-gray-400' : 'bg-gray-300'} bg-opacity-20`}
		>
			<Heading level={3} center>
				{children}
			</Heading>
		</div>
	);
};

const Map = () => {
	const locations = [
		'Compressor',
		'Douglas Manifold',
		'Hamilton Wellhead',
		'HAMILTON',
		'Hamilton North Wellhead',
		'HAMILTON NORTH',
		'Lennox Wellhead',
		'LENNOX',
	];

	return (
		<DashSection heading='network map'>
			<div className='grid grid-cols-8'>
				<div className='col-span-full flex flex-row'>
					<div className='flex flex-row justify-center absolute left-0 right-0'>
						<MapSvg width={700} height={400} />
					</div>
					{Array(8)
						.fill(1)
						.map((n, i) => (
							<FillerBox key={i} index={i}>
								{i}
							</FillerBox>
						))}
				</div>
				{locations.map((loc, i) => (
					<LocationLabel key={i} index={i}>
						{loc}
					</LocationLabel>
				))}
			</div>
		</DashSection>
	);
};

export default Map;
