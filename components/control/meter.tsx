import PipeSeg from '@/public/model/pipeSeg'
import Splitter from '@/public/model/splitter'

interface IMeterProps {
	elem?: PipeSeg | Splitter | null
}

const Meter = ({ elem = null }: IMeterProps) => {
	const propertyTypes = ['fluid', 'physical']

	const elemProps = () => {
		if (!elem) return <p>Select an element</p>
		return (
			<ul>
				{Object.keys(elem.fluid).map((prop, i) => {
					if (typeof elem.fluid[prop] === 'object') {
						return (
							<li key={i}>
								<ul>
									{Object.keys(elem.fluid[prop]).map((innerProp, j) => {
										return (
											<li key={j}>
												{innerProp}: {elem.fluid[prop][innerProp]}
											</li>
										)
									})}
								</ul>
							</li>
						)
					}
					return (
						<li key={i}>
							{prop}: {elem.fluid[prop]}
						</li>
					)
				})}
			</ul>
		)
	}
	return (
		<>
			<h3 className='text-lg font-semibold border-t mt-4'>Meter</h3>
			{elemProps()}
		</>
	)
}

export default Meter
