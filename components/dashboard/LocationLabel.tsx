import Heading from '@/components/heading';

export const locations = [
	'Compressor',
	'Manifold',
	'Reservoir 1 Wellhead',
	'Reservoir 1',
	'Reservoir 2 Wellhead',
	'Reservoir 2',
	'Reservoir 3 Wellhead',
	'Reservoir 3',
];

export default function LocationLabel({
	children,
	index = 0,
	isHovered,
	setHoverColumn,
}) {
	function handleMouseOver() {
		setHoverColumn(index);
	}
	return (
		<div
			className={`h-full ${
				index % 2 || isHovered ? 'bg-gray-400' : 'bg-gray-300'
			} bg-opacity-${isHovered ? 30 : 20} relative`}
			onMouseOver={handleMouseOver}
		>
			<div className='h-full w-full bg-white absolute top-0'></div>
			<div className='relative'>
				<Heading level={3} center>
					{children}
				</Heading>
			</div>
		</div>
	);
}
