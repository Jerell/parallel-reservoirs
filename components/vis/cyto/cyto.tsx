import CytoscapeComponent from 'react-cytoscapejs'
import { useRef, useEffect } from 'react'
import cytoStyles from './cyto.module.css'
import { generateNetwork } from './generateNetwork'

const cytoscape = require('cytoscape')
const nodeHtmlLabel = require('cytoscape-node-html-label')
nodeHtmlLabel(cytoscape) // register extension

const net = generateNetwork()

const Cyto = ({
	visualElems = net.visualElements,
	elems = net.elements,
	cb = (e) => console.log(e, elems[e.target._private.data.id]),
}) => {
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

		cy.on('tap', 'node, edge', cb)
	})

	return (
		<CytoscapeComponent
			elements={visualElems}
			style={{
				width: '720px',
				height: '600px',
			}}
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
