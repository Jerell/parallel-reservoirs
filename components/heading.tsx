import styles from './heading.module.css'

type LevelRange = 1 | 2 | 3 | 4 | 5 | 6

const Heading = ({
	children,
	level = 1,
	center = false,
}: {
	children: any
	level: LevelRange
	center?: boolean
}) => {
	const commonClasses = `${styles.heading} ${
		center ? 'text-center px-2' : 'px-6'
	} `
	switch (level) {
		case 1:
			return (
				<h1
					className={`${commonClasses} uppercase text-xl py-8 bg-pace-grey text-white`}
				>
					{children}
				</h1>
			)
		case 2:
			return (
				<h2
					className={`${commonClasses} py-6 uppercase text-lg bg-gray-300 text-gray-500`}
				>
					{children}
				</h2>
			)
		case 3:
			return <h3 className={`${commonClasses} py-6`}>{children}</h3>
		case 4:
			return <h4 className={`${commonClasses} py-2`}>{children}</h4>
		case 5:
			return <h5 className={`${commonClasses}`}>{children}</h5>
		case 6:
			return <h6 className={`${commonClasses}`}>{children}</h6>
	}
}

export default Heading
