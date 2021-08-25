import MapSvg from '@/public/images/map.svg'
import Heading from '@/components/heading'
import ExpansionButton from '@/components/buttons/expansionButton'
import { useState } from 'react'

const Map = () => {
	const [open, setOpenState] = useState(true)
	function toggleExpand(e) {
		setOpenState(!open)
	}

	return (
		<>
			<div className='flex flex-row'>
				<Heading level={2}>Network map</Heading>
				<ExpansionButton expanded={open} fn={toggleExpand} />
			</div>
			{open ? (
				<div className='mx-8'>
					<MapSvg width={700} height={400} />
				</div>
			) : null}
		</>
	)
}

export default Map
