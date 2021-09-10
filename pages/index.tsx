import Page from '@/components/page';
import Heading from '@/components/heading';
import Map from '@/components/dashboard/map';
import Graphs from '@/components/dashboard/data/graphs';
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/client';
import SignedOutBanner from '@/components/signedOutBanner';
import Snapshot from '@/components/dashboard/snapshot';
import LifeOfField from '@/components/dashboard/lifeOfField';

const Index = () => {
	const [session, loading] = useSession();

	const [hoverColumn, setHoverColumn] = useState(0);

	if (loading) {
		return (
			<Page fullWidth noPadding>
				<Heading level={1}>Loading</Heading>
			</Page>
		);
	}

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
			<Map hoverColumn={hoverColumn} setHoverColumn={setHoverColumn} />

			<Snapshot hoverColumn={hoverColumn} setHoverColumn={setHoverColumn} />
			<LifeOfField hoverColumn={hoverColumn} setHoverColumn={setHoverColumn} />
			{/* <Graphs hoverColumn={hoverColumn} setHoverColumn={setHoverColumn} /> */}
		</Page>
	);
};

export default Index;
