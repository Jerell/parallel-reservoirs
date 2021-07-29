import CytoscapeComponent from 'react-cytoscapejs'
import PipeSeg from '@/public/model/pipeSeg'
import Splitter from '@/public/model/splitter'

const testNetwork = () => {
	const sourcePipe = new PipeSeg({
		diameters: [0.9144],
		start: { x: 1, y: 1, pressure: 300000, temperature: 350 },
		flowrate: 100,
	})
	const branch1 = new PipeSeg({ diameters: [0.9144], start: { x: 4, y: 5 } })

	const branch2 = new PipeSeg({ diameters: [0.9144], start: { x: 4, y: 5 } })
	const branch2p2 = new PipeSeg({
		diameters: [0.9144],
		start: { x: 4, y: 5 },
	})
	branch2.setDestination(branch2p2)

	const s = new Splitter({
		source: sourcePipe,
		destinations: [branch1, branch2],
	})

	return branch2p2
}

const generateNetwork = () => {
	const nextID = () => elements.length
	const elements = [] as any

	const createNode = (x, y) => {
		const id = nextID()
		const n = {
			data: { id: `${id}`, label: `Node ${id}` },
			position: { x, y },
		}
		elements.push(n)
		return n
	}

	const createEdge = (from, to) => {
		const e = {
			data: { source: from, target: to, label: `Pipe from ${from} to ${to}` },
		}
		elements.push(e)
		return e
	}

	const net = testNetwork()

	const parse = (root) => {
		while (root.source) root = root.source
		console.log(root)
	}

	parse(net)

	createNode(30, 100)
	createNode(130, 100) // split
	createNode(230, 50)
	createNode(230, 100)
	createNode(230, 150)

	createEdge(0, 1)
	createEdge(1, 2)
	createEdge(1, 3)
	createEdge(1, 4)

	return elements
}

// const elements = [
// 	{ data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
// 	{ data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
// 	{ data: { id: 'three', label: 'Node 3' }, position: { x: 100, y: 0 } },
// 	{ data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } },
// 	{
// 		data: { source: 'two', target: 'three', label: 'Edge from Node2 to Node3' },
// 	},
// ]

const layout = { name: 'breadthfirst' }

const Cyto = (props) => {
	return (
		<CytoscapeComponent
			elements={generateNetwork()}
			style={{ width: '720px', height: '600px' }}
			// layout={layout}
		/>
	)
}

export default Cyto
