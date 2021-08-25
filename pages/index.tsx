import Page from '@/components/page'
import Heading from '@/components/heading'
import Map from '@/components/dashboard/map'
import DataTable from '@/components/dashboard/data/dataTable'

const Index = () => (
	<Page fullWidth noPadding>
		<section>
			<Heading level={1}>Project name</Heading>
			<Map />
		</section>
		<section>
			<DataTable />
		</section>
		<section>
			<Heading level={2}>Graphs</Heading>
		</section>
	</Page>
)

export default Index
