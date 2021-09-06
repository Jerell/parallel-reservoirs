import MapSvg from '@/public/images/map.svg';
import Heading from '@/components/heading';
import FillerBox from '@/components/dashboard/fillerBox';
import DashSection from './dashSection';

const LocationLabel = ({ children, index = 0, isHovered }) => {
	return (
		<div
			className={`${
				index % 2 || isHovered ? 'bg-gray-400' : 'bg-gray-300'
			} bg-opacity-${isHovered ? 30 : 20}`}
		>
			<Heading level={3} center>
				{children}
			</Heading>
		</div>
	);
};

const Map = ({ hoverColumn, setHoverColumn }) => {
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
					<div className='flex flex-row justify-center absolute left-0 right-0 pt-2'>
						<MapSvg />
					</div>

					{Array(8)
						.fill(1)
						.map((n, i) => (
							<FillerBox
								key={i}
								index={i}
								height={64}
								additionalClasses={`sm:h-72 md:h-96`}
								isHovered={i === hoverColumn}
								setHoverColumn={setHoverColumn}
							>
								{i}
							</FillerBox>
						))}
				</div>
				<div className='col-span-full flex-row hidden lg:flex'>
					{Array(8)
						.fill(1)
						.map((n, i) => (
							<FillerBox
								key={i}
								index={i}
								height={24}
								additionalClasses={`xl:h-72 2xl:h-96`}
								isHovered={i === hoverColumn}
								setHoverColumn={setHoverColumn}
							>
								{i}
							</FillerBox>
						))}
				</div>
				{locations.map((loc, i) => (
					<LocationLabel key={i} index={i} isHovered={i === hoverColumn}>
						{loc}
					</LocationLabel>
				))}
			</div>
		</DashSection>
	);
};

export default Map;
