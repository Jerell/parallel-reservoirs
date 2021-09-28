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
	const [lxP, setLxP] = useState(1);
	const [requestFailed, setRequestFailed] = useState(false);
	const [steps, setSteps] = useState(12);
	const [timestep, setTimestep] = useState(7);
	const [datasets, setDatasets] = useState<any[]>([]);
	const statusRef: any = useRef(null);

	function selectInterval(timePeriod: string) {
		switch (timePeriod) {
			case 'months':
				setTimestep(30);
				break;
			case 'weeks':
				setTimestep(7);
				break;
			default:
				setTimestep(30);
		}
	}

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

	const getReqBody = () => {
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
			steps,
		};
	};

	const tryQuery = async (url: string) => {
		const query = await fetch(url);
		return await query.json();
	};

	const pollingRef = useRef<any>();

	async function requestLifeOfField() {
		statusRef.current.continuousStart();
		setRequestFailed(false);

		const reqBody = getReqBody();
		const statusQueryGetUri = await getStatusQueryGetUri(reqBody);

		const recordResponse = (data) => {
			clearInterval(pollingRef.current);

			const dataForTable = transformToPTQRows(data, timestep);
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
						<div className='flex flex-row justify-center w-64'>
							<NumberInput
								label=''
								labelClasses='text-white'
								unitListType='lof'
								fn={setSteps}
								placeholder={steps}
								unitFn={selectInterval}
							/>
							<Button
								fn={() => requestLifeOfField()}
								additionalClasses={styles.timeStep}
							/>
							<div className='text-right'></div>
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
					data={data[0]}
					xIntervalDays={data[1]}
					key={i}
				/>
			))}
		</>
	);
};

export default LifeOfField;
