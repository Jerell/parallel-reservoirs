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
			data: { id: `${id}`, label: `Node ${id}`, icon: 'star_rate' },
			position: { x, y },
			classes: 'nodeIcon',
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

		console.log(cy.style())

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
						textColor: 'red',
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
