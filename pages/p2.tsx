import Page from '@/components/page'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const CytoWithController = dynamic(
	() => import('@/components/vis/cyto/cytoWithController'),
	{ ssr: false }
)

const P2 = () => (
	<Page>
		<section className='mt-20'>
			<h2 className='text-xl font-semibold '>
				Visualization:{' '}
				<Link href='https://js.cytoscape.org/'>
					<span className='font-bold hover:underline cursor-pointer text-blue-800 hover:text-indigo-500'>
						Cytoscape
					</span>
				</Link>{' '}
			</h2>
			<p className='mt-2'>
				I'm using Cytoscape to create the visualisation below instead of writing
				my own from scratch. It uses HTML canvas instead of SVG elements,
				meaning it isn't drawn on the page in the same way as the previous
				visualizations. I can't use CSS to add animations to show the direction
				of flow in the pipes, for example. I can use SVGs and font icons to
				place icons on top of canvas elements like the stars on each node.
			</p>
			<p className='mt-2'>
				It's interactive. You can click to select elements, drag to move them,
				drag and zoom to move the whole thing, etc.
			</p>
		</section>
		<section>
			<CytoWithController />
			<p className='mt-8'>
				The 'Fake nodes' are the start of pipe segments - the only real 'node'
				in the network is the splitter. The properties you see listed here are
				the initial conditions. I'll add buttons to trigger the process that
				finds the flowrates and pressures for each branch after the splitter.
			</p>
			<p>
				I also need to add UI elements that let you modify the network and the
				selected element.
			</p>
		</section>
	</Page>
)

export default P2
