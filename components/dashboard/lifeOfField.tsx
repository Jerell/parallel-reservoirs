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

	const statusRef: any = useRef(null);

	const [datasets, setDatasets] = useState<any[]>([]);

	const getStatusQueryGetUri = async (reqBody) => {
		const durableResponse = await fetch(
			'https://pace-digital-twin.azurewebsites.net/api/orchestrators/LOFOrchestrator',
			{
				method: 'POST',
				body: JSON.stringify(
					reqBody as {
						inlet: {
							temperature: number;
							flowrate: number;
						};
						reservoirPressures: {
							HM: number;
							HN: number;
							LX: number;
						};
						timestep: number;
						steps: number;
					}
				),
			}
		);
		const durable = await durableResponse.json();
		const { statusQueryGetUri } = durable;
		return statusQueryGetUri;
	};

	const getReqBody = (timestep: number) => {
		if ([inletQ, inletT, hmP, hnP, lxP].some((value) => !value)) {
			setRequestFailed(true);
			return;
		}

		return {
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
			steps: 5,
		};
	};

	const tryQuery = async (url: string) => {
		const query = await fetch(url);
		return await query.json();
	};

	const pollingRef = useRef<any>();

	async function requestLifeOfField(timestep: number) {
		statusRef.current.continuousStart();
		setRequestFailed(false);

		const reqBody = getReqBody(timestep);
		const statusQueryGetUri = await getStatusQueryGetUri(reqBody);

		const recordResponse = (data) => {
			clearInterval(pollingRef.current);

			const dataForTable = transformToPTQRows(data);
			setDatasets([...datasets, dataForTable]);

			statusRef.current.complete();
		};

		const firstQuery = await tryQuery(statusQueryGetUri);

		switch (firstQuery.runtimeStatus) {
			case 'Completed':
				recordResponse(firstQuery.output);
				return;
			case 'Failed':
				setRequestFailed(true);
				return;
		}

		pollingRef.current = setInterval(async () => {
			const pollingQuery = await tryQuery(statusQueryGetUri);

			switch (pollingQuery.runtimeStatus) {
				case 'Completed':
					recordResponse(pollingQuery.output);
					return;
				case 'Failed':
					clearInterval(pollingRef.current);
					setRequestFailed(true);
					statusRef.current.complete();
					return;
			}
		}, 2000);
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
						<LoadingBar color='#39304A' ref={statusRef} height={10} />
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