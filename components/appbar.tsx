import Link from 'next/link'
import { useRouter } from 'next/router'
import Heading from '@/components/heading'

const links = [
	// { label: 'Demo', href: '/demo' },
	// { label: 'P3', href: '/p3' },
]

const Appbar = () => {
	const router = useRouter()

	return (
		<div className='pt-safe w-full bg-gray-900 fixed top-0 z-20'>
			<header className='bg-pace-green text-white dark:bg-gray-900'>
				<div className='mx-auto px-6 h-20 flex items-center justify-between'>
					<Link href='/'>
						<a>
							<h1 className='font-medium raleway text-lg'>Digital Twin</h1>
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
													? 'text-pace-grey'
													: 'text-white hover:text-pace-violet dark:text-gray-400 dark:hover:text-gray-50'
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
