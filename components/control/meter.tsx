import PipeSeg from '@/public/model/pipeSeg'
import Splitter from '@/public/model/splitter'

interface IMeterProps {
	elem?: PipeSeg | Splitter
}

const Meter = ({ elem }: IMeterProps) => {
	return (
		<>
			<h3 className='text-lg font-semibold border-t mt-4'>Meter</h3>
			<p>Select an element</p>
		</>
	)
}

export default Meter
