import Page from '@/components/page';
import Heading from '@/components/heading';
import Map from '@/components/dashboard/map';
import DataTable from '@/components/dashboard/data/dataTable';
import Graphs from '@/components/dashboard/data/graphs';
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/client';
import SignedOutBanner from '@/components/signedOutBanner';

const Index = () => {
	const [session, loading] = useSession();

	const [hoverColumn, setHoverColumn] = useState(0);

	if (!session) {
		return (
			<Page fullWidth noPadding>
				<Heading level={1}>Unauthorized</Heading>

				<SignedOutBanner />
			</Page>
		);
	}

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
