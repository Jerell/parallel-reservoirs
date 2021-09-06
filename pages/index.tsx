import Page from '@/components/page';
import Heading from '@/components/heading';
import Map from '@/components/dashboard/map';
import DataTable from '@/components/dashboard/data/dataTable';
import Graphs from '@/components/dashboard/data/graphs';
import { useState } from 'react';

const Index = () => {
	const [hoverColumn, setHoverColumn] = useState(0);

	return (
		<Page fullWidth noPadding>
			<Heading level={1}>Project name</Heading>
			<Map hoverColumn={hoverColumn} setHoverColumn={setHoverColumn} />
			<DataTable hoverColumn={hoverColumn} setHoverColumn={setHoverColumn} />
			<Graphs hoverColumn={hoverColumn} setHoverColumn={setHoverColumn} />
		</Page>
	);
};

export default Index;
