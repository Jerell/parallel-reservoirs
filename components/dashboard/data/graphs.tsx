import DashSection from '../dashSection'
import FillerBox from '../fillerBox'

const Graphs = () => {
	return (
		<DashSection heading='graphs'>
			<div className='col-span-full flex flex-row'>
				{Array(8)
					.fill(1)
					.map((n, i) => (
						<FillerBox key={i} index={i} height={40}>
							{i}
						</FillerBox>
					))}
			</div>
		</DashSection>
	)
}

export default Graphs
