import Link from 'next/link'
import { useRouter } from 'next/router'

const links = [
	{ label: 'Demo', href: '/demo' },
	// { label: 'P3', href: '/p3' },
]

const Appbar = () => {
	const router = useRouter()

	return (
		<div className='pt-safe w-full bg-gray-900 fixed top-0 z-20'>
			<header className='bg-blue-50 border-b dark:bg-gray-900 dark:border-gray-800'>
				<div className='mx-auto px-6 max-w-screen-md h-20 flex items-center justify-between'>
					<Link href='/'>
						<a>
							<h1 className='font-medium'>HyNet</h1>
						</a>
					</Link>

					<nav className='space-x-6 flex items-center'>
						<div className='hidden sm:block'>
							<div className='space-x-6 flex items-center'>
								{links.map(({ label, href }) => (
									<Link key={label} href={href}>
										<a
											className={`text-sm ${
												router.pathname === href
													? 'text-indigo-500 dark:text-indigo-400'
													: 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50'
											}`}
										>
											{label}
										</a>
									</Link>
								))}
							</div>
						</div>
					</nav>
				</div>
			</header>
		</div>
	)
}

export default Appbar
