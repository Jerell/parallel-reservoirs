import MapSvg from '@/public/images/map.svg';
import Heading from '@/components/heading';
import FillerBox from '@/components/dashboard/fillerBox';
import DashSection from './dashSection';
import LocationLabel from './LocationLabel';

const Map = ({ hoverColumn, setHoverColumn }) => {
	const locations = [
		'Compressor',
		'Manifold',
		'Reservoir 1 Wellhead',
		'Reservoir 1',
		'Reservoir 2 Wellhead',
		'Reservoir 2',
		'Reservoir 3 Wellhead',
		'Reservoir 3',
	];

	return (
		<DashSection heading='network map'>
			<div className='grid grid-cols-8 relative'>
				<div className='col-span-full'>
					<div className='flex flex-row justify-center py-4 col-span-full'>
						<MapSvg width={'100%'} />
					</div>
				</div>
				<div className='flex flex-row left-0 right-0 absolute top-0 bottom-0'>
					{Array(8)
						.fill(1)
						.map((n, i) => (
							<FillerBox
								key={i}
								index={i}
								height={'full'}
								// additionalClasses={`xl:h-72 2xl:h-96`}
								isHovered={i === hoverColumn}
								setHoverColumn={setHoverColumn}
								behind
							></FillerBox>
						))}
				</div>
			</div>
			{/* <div className='grid grid-cols-8 sticky'>
				{locations.map((loc, i) => (
					<LocationLabel
						key={i}
						index={i}
						isHovered={i === hoverColumn}
						setHoverColumn={setHoverColumn}
					>
						{loc}
					</LocationLabel>
				))}
			</div> */}
		</DashSection>
	);
};

export default Map;
