import PipeSeg from '@/public/model/pipeSeg'
import Splitter from '@/public/model/splitter'
import testNet from './testNet'
import { preOrderTraverse } from '@/public/utils/traversal'

export const generateNetwork = (net = testNet()) => {
	const elements = [] as any
	const visualElements = [] as any
	const nextID = () => elements.length

	const createNode = (x, y, label) => {
		const id = nextID()
		if (label === 'PipeSeg') {
			label = 'Fake node'
		}
		const n = {
			data: { id: `${id}`, label: `${id}) ${label}`, icon: 'star_rate' },
			position: { x, y },
			classes: 'nodeIcon',
		}
		visualElements.push(n)
		return n
	}

	const createEdge = (from, to) => {
		const e = {
			data: { source: from, target: to, label: `Pipe from ${from} to ${to}` },
			classes: 'edge',
		}
		visualElements.push(e)
		return e
	}

	const parse = (root) => {
		while (root.source) root = root.source

		const record = (n: PipeSeg | Splitter) => {
			const componentValue = n.value
			let label = ''
			switch (componentValue) {
				case 0:
					label = 'PipeSeg'
					break
				case 1:
					label = 'Splitter'
					break
				default:
					console.log(componentValue)
					label = 'unknown'
			}
			const { x, y } = n.properties.start

			const elemAtXY = (xpos = x, ypos = y) =>
				visualElements.find(
					(e) => e.position && e.position.x === xpos && e.position.y === ypos
				)

			const XYelem = elemAtXY()

			if (!XYelem) {
				const newNode = createNode(x, y, label)
				elements.push(n)
				if (n.source) {
					const { x: sx, y: sy } = n.source.properties.start
					const sourceElem = elemAtXY(sx, sy)
					createEdge(sourceElem.data.id, newNode.data.id)
				}
			}
		}

		preOrderTraverse(root, record)
		console.log(elements)
		console.log(visualElements)
	}

	parse(net)

	return { visualElements, elements }
}
