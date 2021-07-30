import Cyto from './cyto'
import { generateNetwork } from './generateNetwork'
import Meter from '@/components/control/meter'
import { useState } from 'react'

const CytoWithController = () => {
	const [elem, setElem] = useState(null)

	const net = generateNetwork()

	const selectElem = (e) => {
		const i = e.target._private.data.id
		const elems = net.elements
		const elem = elems[i]
		console.log(elem)
		setElem(elem)
	}

	return (
		<>
			<Cyto
				visualElems={net.visualElements}
				elems={net.elements}
				cb={selectElem}
			/>
			<Meter elem={elem} />
		</>
	)
}

export default CytoWithController
