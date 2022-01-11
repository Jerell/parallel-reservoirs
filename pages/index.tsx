import Page from '@/components/page';
import Heading from '@/components/heading';
import Map from '@/components/dashboard/map';
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/client';
import SignedOutBanner from '@/components/signedOutBanner';
import Snapshot from '@/components/dashboard/snapshot';
import LifeOfField from '@/components/dashboard/lifeOfField';
import LocationLabel, { locations } from '@/components/dashboard/LocationLabel';

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

			<div className='grid grid-cols-8 sticky top-0'>
				{locations.map((loc, i) => (
					<LocationLabel
						key={i}
						index={i}
						isHovered={i === hoverColumn}
						setHoverColumn={setHoverColumn}
					>
						{loc}
					</LocationLabel>
				))}
			</div>

			<Snapshot hoverColumn={hoverColumn} setHoverColumn={setHoverColumn} />
			<LifeOfField hoverColumn={hoverColumn} setHoverColumn={setHoverColumn} />
		</Page>
	);
};

export default Index;
