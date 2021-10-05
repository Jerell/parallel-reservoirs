import DataTable from './data/dataTable';
import DashSection from './dashSection';
import Button from '../buttons/button';
import NumberInput from '../numberInput';
import styles from './snapshot.module.css';
import { useState, useRef } from 'react';
import fetch from 'node-fetch';
import LoadingBar from 'react-top-loading-bar';
import Heading from '../heading';
import reshapeSnapshot from '@/public/utils/api/reshapeSnapshot';

const InputSection = ({ children, classes = '' }) => {
	return (
		<div className={`relative px-2 flex flex-col ${classes}`}>{children}</div>
	);
};

const Snapshot = ({ hoverColumn, setHoverColumn }) => {
	const [inletQ, setInletQ] = useState(0);
	const [inletT, setInletT] = useState(0);
	const [hmP, setHmP] = useState(0);
	const [hnP, setHnP] = useState(0);
	const [lxP, setLxP] = useState(0);
	const [requestFailed, setRequestFailed] = useState(false);

	const ref: any = useRef(null);

	const [datasets, setDatasets] = useState<any[]>([]);

	async function requestSnapshot() {
		if ([inletQ, inletT, hmP, hnP, lxP].some((value) => !value)) {
			setRequestFailed(true);
			return;
		}

		ref.current.continuousStart();
		setRequestFailed(false);

		const response = await fetch('/api/snapshot', {
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
			}),
		});

		ref.current.complete();

		if (response.status !== 200) {
			setRequestFailed(true);
			return [];
		}

		const data = await response.json();

		const dataForTable = reshapeSnapshot(data);
		console.log(dataForTable);
		setDatasets([...datasets, dataForTable]);
	}

	return (
		<>
			<DashSection heading='snapshot'>
				<div className='grid grid-cols-8 bg-pace-grey pt-2'>
					<InputSection classes={styles.inlet}>
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
					<InputSection classes={styles.hm}>
						<NumberInput
							label='Reservoir Pressure'
							labelClasses='text-white'
							unitListType='pressure'
							fn={setHmP}
						/>
					</InputSection>
					<InputSection classes={styles.hn}>
						<NumberInput
							label='Reservoir Pressure'
							labelClasses='text-white'
							unitListType='pressure'
							fn={setHnP}
						/>
					</InputSection>
					<InputSection classes={styles.lx}>
						<NumberInput
							label='Reservoir Pressure'
							labelClasses='text-white'
							unitListType='pressure'
							fn={setLxP}
						/>
					</InputSection>
					<div className='col-span-full flex flex-col justify-center items-center p-4'>
						<Button fn={requestSnapshot} />
						<LoadingBar color='#39304A' ref={ref} height={10} />
						{requestFailed && (
							<Heading level={6} additionalClasses='mt-2 text-red-900'>
								Request failed
							</Heading>
						)}
					</div>
				</div>
				<Heading level={6}>Valve - Valve name</Heading>
				<div className='grid grid-cols-4 pl-6 w-1/2'>
					<p>Inlet temperature: __ °C</p>
					<p>Outlet temperature: __ °C</p>
					<p>Inlet pressure: __ Bar</p>
					<p>Outlet pressure: __ Bar</p>
				</div>
			</DashSection>

			{datasets.map((data, i) => (
				<DataTable
					heading={'snapshot results'}
					hoverColumn={hoverColumn}
					setHoverColumn={setHoverColumn}
					data={data}
					key={i}
				/>
			))}
		</>
	);
};

export default Snapshot;
