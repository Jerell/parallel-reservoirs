import CytoscapeComponent from 'react-cytoscapejs'
import { useRef, useEffect } from 'react'
import cytoStyles from './cyto.module.css'

const cytoscape = require('cytoscape')
const nodeHtmlLabel = require('cytoscape-node-html-label')
nodeHtmlLabel(cytoscape) // register extension

const Cyto = ({ cb = (e) => console.log(e) }) => {
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
			elements={[
				{
					data: {
						id: 1,
						label: 'Inlet (Point of Ayr)',
					},
				},
				{
					data: { id: 2, label: 'Douglas splitter/manifold' },
				},
				{
					data: { id: 3, label: 'Hamilton top of well' },
				},
				{
					data: { id: 4, label: 'Hamilton bottom of well' },
				},
				{
					data: { id: 5, label: 'Hamilton reservoir' },
				},
				{
					data: { id: 6, label: 'Hamilton North top of well' },
				},
				{
					data: { id: 7, label: 'Hamilton North bottom of well' },
				},
				{
					data: { id: 8, label: 'Hamilton North reservoir' },
				},
				{
					data: { id: 9, label: 'Lennox top of well' },
				},
				{
					data: { id: 10, label: 'Lennox bottom of well' },
				},
				{
					data: { id: 11, label: 'Lennox reservoir' },
				},
				{
					data: {
						source: 1,
						target: 2,
						label: 'Pipe from inlet to splitter',
					},
				},
				{
					data: {
						source: 2,
						target: 3,
						label: 'Pipe from splitter to Hamilton well',
					},
				},
				{
					data: {
						source: 3,
						target: 4,
						label: 'Hamilton well',
					},
				},
				{
					data: {
						source: 4,
						target: 5,
						label: 'Hamilton reservoir',
					},
				},
				{
					data: {
						source: 2,
						target: 6,
						label: 'Pipe from splitter to Hamilton North well',
					},
				},
				{
					data: {
						source: 6,
						target: 7,
						label: 'Hamilton North well',
					},
				},
				{
					data: {
						source: 7,
						target: 8,
						label: 'Hamilton North reservoir',
					},
				},
				{
					data: {
						source: 2,
						target: 9,
						label: 'Pipe from splitter to Lennox well',
					},
				},
				{
					data: {
						source: 9,
						target: 10,
						label: 'Lennox well',
					},
				},
				{
					data: {
						source: 10,
						target: 11,
						label: 'Lennox reservoir',
					},
				},
			]}
			style={{
				width: '800px',
				height: '500px',
			}}
			layout={{ name: 'breadthfirst' }}
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
						curveStyle: 'segments',
					},
				},
			]}
		/>
	)
}

export default Cyto
