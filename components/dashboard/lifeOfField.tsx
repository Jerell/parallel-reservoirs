import DataTable from './data/dataTable';
import DashSection from './dashSection';
import Button from '../buttons/button';
import NumberInput from '../numberInput';
import snapshotStyles from './snapshot.module.css';
import styles from './lifeOfField.module.css';
import { useState, useRef } from 'react';
import fetch from 'node-fetch';
import LoadingBar from 'react-top-loading-bar';
import Heading from '../heading';
import Graphs from '@/components/dashboard/data/graphs';
import { transformToPTQRows } from '@/public/utils/api/reshapeLifeOfField';

const InputSection = ({ children, classes = '' }) => {
	return (
		<div className={`relative px-2 flex flex-col ${classes}`}>{children}</div>
	);
};

const LifeOfField = ({ hoverColumn, setHoverColumn }) => {
	const [inletQ, setInletQ] = useState(0);
	const [inletT, setInletT] = useState(0);
	const [hmP, setHmP] = useState(0);
	const [hnP, setHnP] = useState(0);
	const [lxP, setLxP] = useState(0);
	const [requestFailed, setRequestFailed] = useState(false);

	const ref: any = useRef(null);

	const [datasets, setDatasets] = useState<any[]>([]);

	async function requestLifeOfField(timestep) {
		if ([inletQ, inletT, hmP, hnP, lxP].some((value) => !value)) {
			setRequestFailed(true);
			return;
		}

		ref.current.continuousStart();
		setRequestFailed(false);

		const response = await fetch('/api/life-of-field', {
			method: 'POST',
			body: JSON.stringify({
				inlet: {
					temperature: inletT,
					flowrate: inletQ,
				},
				reservoirPressures: {
					HM: hmP,
					HN: hnP,
					LX: lxP,
				},
				timestep,
				steps: 2,
			}),
		});

		ref.current.complete();

		if (response.status !== 200) {
			setRequestFailed(true);
			return [];
		}

		const data = await response.json();
		console.log(data);

		const dataForTable = transformToPTQRows(data.snapshots);
		console.log(dataForTable);
		setDatasets([...datasets, dataForTable]);
	}

	return (
		<>
			<DashSection heading='Life of field'>
				<Heading level={5} additionalClasses={'bg-pace-raisin text-white py-1'}>
					Initial conditions
				</Heading>
				<div className='grid grid-cols-8 bg-pace-grey pt-2'>
					<InputSection classes={snapshotStyles.inlet}>
						<NumberInput
							label='Inlet Flowrate'
							labelClasses='text-white'
							unitListType='flowrate'
							fn={setInletQ}
						/>
						<NumberInput
							label='Inlet Temperature'
							labelClasses='text-white'
							unitListType='temperature'
							fn={setInletT}
						/>
					</InputSection>
					<InputSection classes={snapshotStyles.hm}>
						<NumberInput
							label='Reservoir Pressure'
							labelClasses='text-white'
							unitListType='pressure'
							fn={setHmP}
						/>
					</InputSection>
					<InputSection classes={snapshotStyles.hn}>
						<NumberInput
							label='Reservoir Pressure'
							labelClasses='text-white'
							unitListType='pressure'
							fn={setHnP}
						/>
					</InputSection>
					<InputSection classes={snapshotStyles.lx}>
						<NumberInput
							label='Reservoir Pressure'
							labelClasses='text-white'
							unitListType='pressure'
							fn={setLxP}
						/>
					</InputSection>
					<div className='col-span-full flex flex-col justify-center items-center p-4'>
						<Heading level={6} additionalClasses={'mb-2 text-white'}>
							Select interval
						</Heading>
						<div className='flex flex-row justify-center'>
							<Button
								fn={() => requestLifeOfField(7)}
								additionalClasses={styles.timeStep}
								text='7 days'
							/>
							<Button
								fn={() => requestLifeOfField(30)}
								additionalClasses={styles.timeStep}
								text='30 days'
							/>
						</div>
						<LoadingBar color='#39304A' ref={ref} height={10} />
						{requestFailed && (
							<Heading level={6} additionalClasses='mt-2 text-red-900'>
								Request failed
							</Heading>
						)}
					</div>
				</div>
			</DashSection>

			{datasets.map((data, i) => (
				<Graphs
					heading={'Life of field results'}
					hoverColumn={hoverColumn}
					setHoverColumn={setHoverColumn}
					data={data}
					key={i}
				/>
			))}
		</>
	);
};

export default LifeOfField;
