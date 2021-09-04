import Page from '@/components/page';
import Heading from '@/components/heading';
import Map from '@/components/dashboard/map';
import DataTable from '@/components/dashboard/data/dataTable';
import Graphs from '@/components/dashboard/data/graphs';

const Index = () => (
	<Page fullWidth noPadding>
		<Heading level={1}>Project name</Heading>
		<Map />
		<DataTable />
		<Graphs />
	</Page>
);

export default Index;
