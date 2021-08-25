import MapSvg from '@/public/images/map.svg'
import Heading from '@/components/heading'
import ExpansionButton from '@/components/buttons/expansionButton'
import { useState } from 'react'

const LocationLabel = ({ children, index = 0 }) => {
	return (
		<div
			className={`${index % 2 ? 'bg-gray-400' : 'bg-gray-300'} bg-opacity-20`}
		>
			<Heading level={3} center>
				{children}
			</Heading>
		</div>
	)
}

const FillerBox = ({ children, index = 0 }) => {
	return (
		<div
			className={`${
				index % 2 ? 'bg-gray-400' : 'bg-gray-300'
			} bg-opacity-10 flex-grow h-96 text-transparent`}
		>
			{children}
		</div>
	)
}

const Map = () => {
	const [open, setOpenState] = useState(true)
	function toggleExpand(e) {
		setOpenState(!open)
	}

	const locations = [
		'Compressor',
		'Douglas Manifold',
		'Hamilton Wellhead',
		'HAMILTON',
		'Hamilton North Wellhead',
		'HAMILTON NORTH',
		'Lennox Wellhead',
		'LENNOX',
	]

	const head = (
		<div className='flex flex-row'>
			<Heading level={2}>Network map</Heading>
			<ExpansionButton expanded={open} fn={toggleExpand} />
		</div>
	)

	if (!open) {
		return head
	}

	return (
		<section>
			{head}
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
		</section>
	)
}

export default Map
