import Page from '@/components/page'
import dynamic from 'next/dynamic'

const Cyto = dynamic(() => import('@/components/vis/cyto/cyto'), { ssr: false })

const P2 = () => (
	<Page>
		<section className='mt-20'>
			<h2 className='text-xl font-semibold'>
				Cytoscape is a fully featured graph library for JS
			</h2>
			<p className='mt-2 text-gray-600 dark:text-gray-400'>
				I'm using it to create the visualisation below instead of writing my own
				from scratch.
			</p>
		</section>
		<section>
			<Cyto />
		</section>
	</Page>
)

export default P2
