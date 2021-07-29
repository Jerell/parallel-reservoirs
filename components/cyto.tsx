import CytoscapeComponent from 'react-cytoscapejs'
import PipeSeg from '@/public/model/pipeSeg'
import Splitter from '@/public/model/splitter'
import { useRef, useEffect } from 'react'
import cytoStyles from './cyto.module.css'

const cytoscape = require('cytoscape')
const nodeHtmlLabel = require('cytoscape-node-html-label')
nodeHtmlLabel(cytoscape) // register extension

const testNetwork = () => {
	const sourcePipe = new PipeSeg({
		diameters: [0.9144],
		start: { x: 50, y: 100, pressure: 300000, temperature: 350 },
		flowrate: 100,
	})
	const branch1 = new PipeSeg({
		diameters: [0.9144],
		start: { x: 150, y: 100 },
	})
	const branch1p2 = new PipeSeg({
		diameters: [0.9144],
		start: { x: 250, y: 50 },
	})
	branch1.setDestination(branch1p2)

	const branch2 = new PipeSeg({
		diameters: [0.9144],
		start: { x: 150, y: 100 },
	})
	const branch2p2 = new PipeSeg({
		diameters: [0.9144],
		start: { x: 250, y: 150 },
	})
	branch2.setDestination(branch2p2)
	const branch2p3 = new PipeSeg({
		diameters: [0.9144],
		start: { x: 350, y: 150 },
	})
	branch2p2.setDestination(branch2p3)

	const s = new Splitter({
		source: sourcePipe,
		destinations: [branch1, branch2],
	})

	return branch2p2
}

const generateNetwork = () => {
	const nextID = () => elements.length
	const elements = [] as any

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
		elements.push(n)
		return n
	}

	const createEdge = (from, to) => {
		const e = {
			data: { source: from, target: to, label: `Pipe from ${from} to ${to}` },
			classes: 'edge',
		}
		elements.push(e)
		return e
	}

	const net = testNetwork()

	const parse = (root) => {
		while (root.source) root = root.source

		const record = (n) => {
			console.log(n)
			const componentType = n.constructor.name
			const { x, y } = n.properties.start

			const elemAtXY = (xpos = x, ypos = y) =>
				elements.find(
					(e) => e.position && e.position.x === xpos && e.position.y === ypos
				)

			const XYelem = elemAtXY()

			if (!XYelem) {
				const newNode = createNode(x, y, componentType)
				if (n.source) {
					const { x: sx, y: sy } = n.source.properties.start
					console.log(sx, sy, '!', x, y)
					const sourceElem = elemAtXY(sx, sy)
					console.log(sourceElem.data.id, '!!', newNode.data.id)
					createEdge(sourceElem.data.id, newNode.data.id)
				}
			}
		}

		const preOrderTraverse = (elem, cb) => {
			if (!elem) return
			cb(elem)

			if (elem.destinations) {
				for (const child of elem.destinations) {
					preOrderTraverse(child, cb)
				}
			} else if (elem.destination) {
				preOrderTraverse(elem.destination, cb)
			}
		}

		preOrderTraverse(root, record)
	}

	parse(net)

	// createNode(30, 100)
	// createNode(130, 100) // split
	// createNode(230, 50)
	// createNode(230, 100)
	// createNode(230, 150)

	// createEdge(0, 1)
	// createEdge(1, 2)
	// createEdge(1, 3)
	// createEdge(1, 4)

	return elements
}

const Cyto = (props) => {
	const cyRef = useRef<typeof CytoscapeComponent>(null)

	useEffect(() => {
		const cy = cyRef.current

		// Initialise the HTML Label
		cy.nodeHtmlLabel([
			{
				query: '.nodeIcon',
				halign: 'center',
				valign: 'center',
				halignBox: 'center',
				valignBox: 'center',
				cssClass: 'label-icon',
				tpl: (data) => {
					return `<span class="material-icons ${cytoStyles[data.icon]}">${
						data.icon
					}</span>`
				},
			},
		])

		// cy.add({
		// 	group: 'nodes',
		// 	data: { weight: 75, icon: 'huh' },
		// 	position: { x: 200, y: 200 },
		// 	classes: 'nodeIcon',
		// })
	})

	return (
		<CytoscapeComponent
			elements={generateNetwork()}
			style={{
				width: '720px',
				height: '600px',
			}}
			// layout={layout}
			cy={(cy) => (cyRef.current = cy)}
			stylesheet={[
				{
					selector: 'node',
					style: {
						width: 30,
						height: 30,
						backgroundColor: '#f78d02',
						label: `data(label)`,
					},
				},
				{
					selector: 'edge',
					style: {
						width: 3,
						curveStyle: 'taxi',
					},
				},
			]}
		/>
	)
}

export default Cyto
