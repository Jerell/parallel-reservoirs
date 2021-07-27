import Page from '@/components/page'

const Index = () => (
	<Page>
		<section className='mt-20'>
			<h2 className='text-xl font-semibold text-gray-800 dark:text-gray-200'>
				What happens when a pipe feeds multiple reservoirs?
			</h2>

			<p className='mt-2 text-gray-600 dark:text-gray-400'>
				The fluid splits between the different branches according to the
				pressures of the destination reservoirs.{' '}
				<span className='font-medium text-gray-900 dark:text-gray-50'>
					But how?
				</span>{' '}
				We want to model the system and visualize its evolution over time.
			</p>
		</section>
		<section className='mt-10'>
			<h2 className='text-xl font-semibold text-gray-800 dark:text-gray-200'>
				We need to identify and describe the components of the system.
			</h2>
			<p className='mt-2 text-gray-600 dark:text-gray-400'>
				As a starting point I would look for counterparts for voltage, current,
				and resistance to see if we can use reciprocals to determine the{' '}
				<span className='line-through'>current</span> flowrate in each branch.
			</p>

			<ul className='list-disc mt-4'>
				<li className='font-bold'>reservoir</li>
				<p>
					these gain <span className='line-through'>resistance</span> pressure
					as they fill up
				</p>
				<li className='font-bold'>pipe</li>
				<p>like wires in a circuit</p>
				<li className='font-bold'>source?</li>
				<p>like a cell</p>
			</ul>
		</section>
	</Page>
)

export default Index
