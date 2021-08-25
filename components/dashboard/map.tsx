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
		<>
			{head}
			<div className='grid grid-cols-8'>
				<div className='col-span-full mx-8'>
					<MapSvg width={700} height={400} />
				</div>
				{locations.map((loc, i) => (
					<LocationLabel key={i} index={i}>
						{loc}
					</LocationLabel>
				))}
			</div>
		</>
	)
}

export default Map
