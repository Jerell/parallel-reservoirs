import Page from '@/components/page';
import Component from '@/components/component';
import Heading from '@/components/heading';
import DashboardGrid from '@/components/dashboard/grid/dashboardGrid';
import { ReactNode } from 'react';
import NumberInput from '@/components/numberInput';

const Properties = ({
	pressure,
	temperature,
	flowrate,
	length,
	elevation,
	diameter,
	heading = 'Properties',
}: {
	pressure?: boolean;
	temperature?: boolean;
	flowrate?: boolean;
	length?: boolean;
	elevation?: boolean;
	diameter?: boolean;
	heading?: string;
}) => {
	const propertyField = (propertyName: string) => {
		let field = (
			<NumberInput
				label={propertyName}
				labelClasses='text-white'
				unitListType={propertyName.toLocaleLowerCase()}
			/>
		);

		switch (propertyName) {
			case 'Diameter':
			case 'Elevation':
				field = (
					<NumberInput
						label={propertyName}
						labelClasses='text-white'
						unit='m'
					/>
				);
				break;
		}
		return (
			<li>
				{propertyName}: {field}
			</li>
		);
	};

	return (
		<div className='properties'>
			<div className='flex flex-col'>
				<Heading additionalClasses='bg-pace-raisin rounded-t-xl' level={4}>
					{heading}
				</Heading>
				<ul className='pb-6'>
					{pressure && propertyField('Pressure')}
					{temperature && propertyField('Temperature')}
					{flowrate && propertyField('Flowrate')}
					{length && propertyField('Length')}
					{elevation && propertyField('Elevation')}
					{diameter && propertyField('Diameter')}
				</ul>
			</div>
		</div>
	);
};

const PropertyDisplayText = ({
	label,
	value,
	unit = '',
}: {
	label: string;
	value: string;
	unit?: string | HTMLElement;
}) => {
	const text = `${label}: ${value}${unit}`;
	return (
		<p className='text-4xl xl:text-5xl font-bold property-display pb-4 mr-4'>
			{text}
			{label === 'Area' && <sup>2</sup>}
		</p>
	);
};

const componentInfo = [
	{
		name: 'Fluid',
		description:
			'A Fluid is a packet of information passed from one component to the next.',
		children: (
			<>
				<div className='w-full flex justify-between'>
					<div className='calculated grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
						<PropertyDisplayText label='Phase' value='Gas' />
						<PropertyDisplayText label='Viscosity' value='0' />
						<PropertyDisplayText label='Density' value='0' />
						<PropertyDisplayText label='Enthalpy' value='0' />
						<PropertyDisplayText label='Entropy' value='0' />
					</div>
					<div className='w-72'>
						<Properties pressure temperature flowrate />
					</div>
				</div>
			</>
		),
	},
	{
		name: 'PipeSeg',
		description:
			'A PipeSeg receives a fluid, applies a pressure change calculation, and passes a fluid object to the next component.',
		children: (
			<>
				<div className='w-full flex relative'>
					<div className='w-72'>
						<Properties length elevation diameter pressure />
						<Properties heading='Destination' elevation />
					</div>
					<div className='calculated grid grid-cols-1 lg:grid-cols-2 pl-4 rtl'>
						<PropertyDisplayText label='Height' value='0.00' unit='m' />
						<PropertyDisplayText label='Area' value='0.00' unit='m' />
						<PropertyDisplayText label='End Pressure' value='0.00' unit='Bar' />
					</div>
				</div>
			</>
		),
	},
	{
		name: 'Inlet',
		description:
			'The inlet component searches for a fluid pressure that results in a satisfactory pressure downstream.',
		children: (
			<>
				<div className='w-full flex relative'>
					<div className='w-72'>
						<Properties temperature flowrate />
					</div>
					<div className='calculated grid grid-cols-1 lg:grid-cols-2 pl-4 rtl'>
						<PropertyDisplayText label='Pressure' value='0.00' unit='Bar' />
					</div>
				</div>
			</>
		),
	},
	{
		name: 'Splitter',
		description:
			'A Splitter distributes the flowrate of a received fluid between multiple destinations.',
	},
	{
		name: 'Well',
		description:
			'A Well applies a pressure change calculation based on external data.',
	},
	{
		name: 'Perforation',
		description:
			'A Perforation applies a pressure change calculation based on external data.',
	},
	{
		name: 'Reservoir',
		description:
			'A Reservoir tells upstream components whether the received fluid pressure is too high, too low, or satisfactory.',
		children: (
			<>
				<div className='w-full flex relative'>
					<div className='w-72'>
						<Properties pressure />
						<Properties heading='Fluid' pressure />
					</div>
					<div className='calculated grid grid-cols-1 lg:grid-cols-2 pl-4 rtl'>
						<PropertyDisplayText label='Accepts fluid' value='yes' />
					</div>
				</div>
			</>
		),
	},
	{
		name: 'Valve',
		description:
			'A Valve tells upstream components whether the received fluid pressure is too low. If the pressure is high enough, the fluid is passed to the next component.',
		children: (
			<>
				<div className='w-full flex relative'>
					<div className='w-72'>
						<Properties pressure />
						<Properties heading='Fluid' pressure />
					</div>
					<div className='calculated grid grid-cols-1 lg:grid-cols-2 pl-4 rtl'>
						<PropertyDisplayText label='Accepts fluid' value='yes' />
					</div>
				</div>
			</>
		),
	},
];

const ComponentDetail = ({
	name,
	description,
	children,
}: {
	name: string;
	description: string;
	children?: ReactNode;
}) => {
	return (
		<>
			<Heading
				level={3}
				additionalClasses='bg-gradient-to-r from-pace-violet to-pace-raisin text-white'
			>
				{name}
			</Heading>
			<div className='flex border-dotted border-l-2 border-pace-violet min-h-40 pl-6 pt-2'>
				<div className='flex flex-col w-full'>
					<p className='pb-4'>{description}</p>
					{children}
				</div>
			</div>
		</>
	);
};

const ComponentsPage = () => (
	<Page noPadding>
		<section className='mt-20'>
			<section className='summary mb-12'>
				<div className='mb-6'>
					<Heading level={1}>Components</Heading>
				</div>

				<DashboardGrid>
					{componentInfo.map((info) => (
						<Component name={info.name} description={info.description} />
					))}
				</DashboardGrid>
			</section>
			<section className='detail'>
				{componentInfo.map((info) => (
					<ComponentDetail name={info.name} description={info.description}>
						{info.children}
					</ComponentDetail>
				))}
			</section>
		</section>
	</Page>
);

export default ComponentsPage;
