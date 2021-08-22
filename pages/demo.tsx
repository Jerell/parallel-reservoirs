import Page from '@/components/page'
import DashboardGrid from '@/components/dashboard/grid/dashboardGrid'
import GridSpace from '@/components/dashboard/grid/gridspace'
import HyNetTable from '@/components/dashboard/hynetTable'
import Map from '@/components/dashboard/map'

const Vis = () => (
	<Page fullWidth noPadding>
		<DashboardGrid>
			<GridSpace>
				<HyNetTable />
			</GridSpace>
			<GridSpace cols={2}>
				<Map />
			</GridSpace>
		</DashboardGrid>
	</Page>
)

export default Vis
