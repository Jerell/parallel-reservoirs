import styles from './heading.module.css'

type LevelRange = 1 | 2 | 3 | 4 | 5 | 6

const Heading = ({
	children,
	level = 1,
}: {
	children: any
	level: LevelRange
}) => {
	switch (level) {
		case 1:
			return (
				<h1
					className={`${styles.heading} text-xl py-8 bg-pace-grey text-white`}
				>
					{children}
				</h1>
			)
		case 2:
			return (
				<h2 className={`${styles.heading} text-lg bg-gray-300 text-gray-500`}>
					{children}
				</h2>
			)
		case 3:
			return <h3 className={`${styles.heading}`}>{children}</h3>
		case 4:
			return <h4 className={`${styles.heading}`}>{children}</h4>
		case 5:
			return <h5 className={`${styles.heading}`}>{children}</h5>
		case 6:
			return <h6 className={`${styles.heading}`}>{children}</h6>
	}
}

export default Heading
