import MapSvg from '@/public/images/map.svg';
import Heading from '@/components/heading';
import FillerBox from '@/components/dashboard/fillerBox';
import DashSection from './dashSection';

const LocationLabel = ({ children, index = 0, isHovered, setHoverColumn }) => {
	function handleMouseOver() {
		setHoverColumn(index);
	}
	return (
		<div
			className={`${
				index % 2 || isHovered ? 'bg-gray-400' : 'bg-gray-300'
			} bg-opacity-${isHovered ? 30 : 20}`}
			onMouseOver={handleMouseOver}
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
				<div className='col-span-full'>
					<div className='flex flex-row justify-center py-4 col-span-full'>
						<MapSvg width={'100%'} />
					</div>
				</div>
				<div className='flex flex-row left-0 right-0 absolute h-full'>
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
							>
								{i}
							</FillerBox>
						))}
				</div>
			</div>
			<div className='grid grid-cols-8'>
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
			</div>
		</DashSection>
	);
};

export default Map;
