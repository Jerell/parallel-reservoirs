import Head from 'next/head';
import Appbar from '@/components/appbar';
import BottomNav from '@/components/bottom-nav';

interface Props {
	title?: string;
	children: React.ReactNode;
	fullWidth?: boolean;
	noPadding?: boolean;
}

const Page = ({
	title,
	children,
	fullWidth = false,
	noPadding = false,
}: Props) => (
	<>
		{title ? (
			<Head>
				<title>Parallel Reservoirs | {title}</title>
			</Head>
		) : null}

		{/* <Appbar /> */}

		<main
			/**
			 * Padding top = `appbar` height
			 * Padding bottom = `bottom-nav` height
			 */
			className={`mx-auto ${noPadding ? '' : 'pt-20 pb-16'} ${
				fullWidth ? 'h-screen' : 'max-w-screen-xl'
			}`}
		>
			<div className={`${fullWidth ? 'h-full' : 'p-6'}`}>{children}</div>
		</main>

		<BottomNav />
	</>
);

export default Page;
