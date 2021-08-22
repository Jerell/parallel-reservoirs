import react from 'react'
import Page from '@/components/page'
import DashboardGrid from '@/components/dashboard/grid/dashboardGrid'
import GridSpace from '@/components/dashboard/grid/gridspace'
import NumberInput from '@/components/numberInput'
import Button from '@/components/button'
import HyNetTable from '@/components/dashboard/hynetTable'
import Image from 'next/image'

const Vis = () => (
	<Page fullWidth noPadding>
		<DashboardGrid>
			<GridSpace>
				<h3 className='text-lg font-semibold mb-4'>input</h3>
				<div>
					<NumberInput label='flowrate' unitListType='flowrate' />
				</div>
				<div className='mt-2'>
					<Button />
				</div>
			</GridSpace>
			<GridSpace cols={2}>map here</GridSpace>
			<GridSpace fullWidth>
				<HyNetTable />
			</GridSpace>
		</DashboardGrid>
	</Page>
)

export default Vis
