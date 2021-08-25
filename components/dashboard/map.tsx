import MapSvg from '@/public/images/map.svg'
import Heading from '@/components/heading'

const Map = () => (
	<>
		<Heading level={2}>Network map</Heading>
		<div className='mx-8'>
			<MapSvg width={700} height={400} />
		</div>
	</>
)

export default Map
