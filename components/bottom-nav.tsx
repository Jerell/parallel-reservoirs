import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';

const BottomNav = () => {
	const router = useRouter();

	return (
		<div className='sm:hidden'>
			<nav className='pb-safe w-full bg-green-100 border-t dark:bg-gray-900 dark:border-gray-800 fixed bottom-0'>
				<div className='mx-auto px-6 max-w-md h-16 flex items-center justify-around'>
					{links.map(({ href, label, icon }) => (
						<Link key={label} href={href}>
							<a
								className={`space-y-1 w-full h-full flex flex-col items-center justify-center ${
									router.pathname === href
										? 'text-indigo-500 dark:text-indigo-400'
										: 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50'
								}`}
							>
								{icon}
								<span className='text-xs text-gray-600 dark:text-gray-400'>
									{label}
								</span>
							</a>
						</Link>
					))}
				</div>
			</nav>
		</div>
	);
};

export default BottomNav;

const links = [
	{
		label: 'Home',
		href: '/',
		icon: (
			<svg
				viewBox='0 0 15 15'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
				width='18'
				height='18'
			>
				<path
					d='M7.5.5l.325-.38a.5.5 0 00-.65 0L7.5.5zm-7 6l-.325-.38L0 6.27v.23h.5zm5 8v.5a.5.5 0 00.5-.5h-.5zm4 0H9a.5.5 0 00.5.5v-.5zm5-8h.5v-.23l-.175-.15-.325.38zM1.5 15h4v-1h-4v1zm13.325-8.88l-7-6-.65.76 7 6 .65-.76zm-7.65-6l-7 6 .65.76 7-6-.65-.76zM6 14.5v-3H5v3h1zm3-3v3h1v-3H9zm.5 3.5h4v-1h-4v1zm5.5-1.5v-7h-1v7h1zm-15-7v7h1v-7H0zM7.5 10A1.5 1.5 0 019 11.5h1A2.5 2.5 0 007.5 9v1zm0-1A2.5 2.5 0 005 11.5h1A1.5 1.5 0 017.5 10V9zm6 6a1.5 1.5 0 001.5-1.5h-1a.5.5 0 01-.5.5v1zm-12-1a.5.5 0 01-.5-.5H0A1.5 1.5 0 001.5 15v-1z'
					fill='currentColor'
				/>
			</svg>
		),
	},
	{
		label: 'Components',
		href: '/components',
		icon: <FontAwesomeIcon icon={faPuzzlePiece} className='w-5' />,
	},
	// {
	// 	label: 'Recipes',
	// 	href: '/recipes',
	// 	icon: (
	// 		<svg
	// 			viewBox='0 0 15 15'
	// 			fill='none'
	// 			xmlns='http://www.w3.org/2000/svg'
	// 			width='18'
	// 			height='18'
	// 		>
	// 			<path
	// 				d='M7.5 15V7m0 .5v3m0-3a4 4 0 00-4-4h-3v3a4 4 0 004 4h3m0-3h3a4 4 0 004-4v-3h-3a4 4 0 00-4 4v3zm0 0l4-4m-4 7l-4-4'
	// 				stroke='currentColor'
	// 			/>
	// 		</svg>
	// 	),
	// },
];
