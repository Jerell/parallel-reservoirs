import Page from '@/components/page';
import DashboardGrid from '@/components/dashboard/grid/dashboardGrid';
import GridSpace from '@/components/dashboard/grid/gridspace';
import PTQTable from '@/components/dashboard/ptqTable';
import Map from '@/components/dashboard/map';

const Vis = () => (
	<Page fullWidth noPadding>
		<DashboardGrid>
			<GridSpace>
				<PTQTable />
			</GridSpace>
			<GridSpace cols={2}>
				<Map />
			</GridSpace>
		</DashboardGrid>
	</Page>
);

export default Vis;
