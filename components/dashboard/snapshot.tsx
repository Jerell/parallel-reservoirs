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
import {
	Pressure,
	PressureUnits,
	Temperature,
	TemperatureUnits,
	Flowrate,
	FlowrateUnits,
} from 'physical-quantities';
import { transformToPTQRows } from '@/public/utils/api/reshapeLifeOfField';

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

	const statusRef: any = useRef(null);
	const [requestFailed, setRequestFailed] = useState(false);

	const [inletQplaceholder, setInletQplaceholder] = useState(0);
	const [inletTplaceholder, setInletTplaceholder] = useState(0);
	const [hmPplaceholder, setHmPplaceholder] = useState(0);
	const [hnPplaceholder, setHnPplaceholder] = useState(0);
	const [lxPplaceholder, setLxPplaceholder] = useState(0);

	const [datasets, setDatasets] = useState<any[]>([]);

	async function getTemp(p1: number, p2: number, t1: number) {
		const t = new Temperature(t1, TemperatureUnits.Kelvin).celsius;
		const res = await fetch('https://dtcomponent.azurewebsites.net/api/Valve', {
			method: 'POST',
			body: JSON.stringify({
				p1: p1,
				t1: t,
				p2: p2,
				fluid: '100% CO2',
			}),
		});
		const json = await res.json();
		return json.outletTemp;
	}

	const tryQuery = async (url: string) => {
		const query = await fetch(url);
		return await query.json();
	};

	const pollingRef = useRef<any>();

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

	const getReqBody = (timestep: number, steps: number) => {
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

	async function requestLifeOfField(timestep: number, steps: number) {
		statusRef.current.continuousStart();
		setRequestFailed(false);

		const reqBody = getReqBody(timestep, steps);
		const statusQueryGetUri = await getStatusQueryGetUri(reqBody);

		const recordResponse = async (data) => {
			data = data[0];
			clearInterval(pollingRef.current);

			// temperature change
			async function updateTemperature(key0, key1) {
				data.keyPoints[key1].temperature = new Temperature(
					await getTemp(
						data.keyPoints[key0].pressure._pascal,
						data.keyPoints[key1].pressure._pascal,
						data.keyPoints[key0].temperature._kelvin
					),
					TemperatureUnits.Celsius
				);
			}

			await updateTemperature('POA', 'Douglas Manifold');
			const newTemp2 = updateTemperature('Douglas Manifold', 'HM1');
			const newTemp3 = updateTemperature('Douglas Manifold', 'HN1');
			const newTemp4 = updateTemperature('Douglas Manifold', 'LX1');
			await Promise.all([newTemp2, newTemp3, newTemp4]);

			const newTemp5 = updateTemperature('HM1', 'Hamilton');
			const newTemp6 = updateTemperature('HN1', 'Hamilton North');
			const newTemp7 = updateTemperature('LX1', 'Lennox');
			await Promise.all([newTemp5, newTemp6, newTemp7]);

			statusRef.current.complete();

			const dataForTable = reshapeSnapshot(data);
			setDatasets([...datasets, dataForTable]);
		};

		const firstQuery = await tryQuery(statusQueryGetUri);

		switch (firstQuery.runtimeStatus) {
			case 'Completed':
				await recordResponse(firstQuery.output);
				return;
			case 'Failed':
				setRequestFailed(true);
				return;
		}

		pollingRef.current = setInterval(async () => {
			const pollingQuery = await tryQuery(statusQueryGetUri);

			switch (pollingQuery.runtimeStatus) {
				case 'Completed':
					await recordResponse(pollingQuery.output);
					return;
				case 'Failed':
					clearInterval(pollingRef.current);
					setRequestFailed(true);
					statusRef.current.complete();
					return;
			}
		}, 2000);
	}

	async function requestSnapshot() {
		if ([inletQ, inletT, hmP, hnP, lxP].some((value) => !value)) {
			setRequestFailed(true);
			return;
		}
		setRequestFailed(false);

		await requestLifeOfField(1, 1);
	}

	const preset = {
		dayOne: () => {
			setInletQplaceholder(150.3);
			setInletTplaceholder(50);
			setHmPplaceholder(40.7);
			setHnPplaceholder(35.5);
			setLxPplaceholder(37.4);
		},
		turnDown: () => {
			setInletQplaceholder(75.15);
			setInletTplaceholder(50);
			setHmPplaceholder(40.7);
			setHnPplaceholder(35.5);
			setLxPplaceholder(37.4);
		},
	};

	return (
		<>
			<DashSection heading='snapshot'>
				<Heading
					level={5}
					additionalClasses={'bg-pace-raisin text-white py-1 w-full'}
				>
					Presets
				</Heading>
				<div className='flex px-2 space-x-2 py-2 bg-pace-grey'>
					<Button text='Day 1' fn={preset.dayOne} />
					{/* <Button
						text='Turn down'
						additionalClasses='w-36'
						fn={preset.turnDown}
					/> */}
				</div>
				<Heading
					level={5}
					additionalClasses={'bg-pace-raisin text-white py-1 w-full'}
				>
					Initial conditions
				</Heading>
				<div className='grid grid-cols-8 bg-pace-grey pt-2'>
					<InputSection classes={styles.inlet}>
						<NumberInput
							label='Inlet Flowrate'
							labelClasses='text-white'
							unitListType='flowrate'
							fn={setInletQ}
							value={inletQ}
							placeholder={inletQplaceholder}
						/>
						<NumberInput
							label='Inlet Temperature'
							labelClasses='text-white'
							unitListType='temperature'
							fn={setInletT}
							value={inletT}
							placeholder={inletTplaceholder}
						/>
					</InputSection>
					<InputSection classes={styles.hm}>
						<NumberInput
							label='Reservoir Pressure'
							labelClasses='text-white'
							unitListType='pressure'
							fn={setHmP}
							value={hmP}
							placeholder={hmPplaceholder}
						/>
					</InputSection>
					<InputSection classes={styles.hn}>
						<NumberInput
							label='Reservoir Pressure'
							labelClasses='text-white'
							unitListType='pressure'
							fn={setHnP}
							value={hnP}
							placeholder={hnPplaceholder}
						/>
					</InputSection>
					<InputSection classes={styles.lx}>
						<NumberInput
							label='Reservoir Pressure'
							labelClasses='text-white'
							unitListType='pressure'
							fn={setLxP}
							value={lxP}
							placeholder={lxPplaceholder}
						/>
					</InputSection>
					<div className='col-span-full flex flex-col justify-center items-center p-4'>
						<Button fn={requestSnapshot} />
						<LoadingBar color='#39304A' ref={statusRef} height={10} />
						{requestFailed && (
							<Heading level={6} additionalClasses='mt-2 text-red-900'>
								Request failed
							</Heading>
						)}
					</div>
				</div>
				{/* <Heading level={6}>Valve - Valve name</Heading>
				<div className='grid grid-cols-4 pl-6 w-1/2'>
					<p>Inlet temperature: __ °C</p>
					<p>Outlet temperature: __ °C</p>
					<p>Inlet pressure: __ Bar</p>
					<p>Outlet pressure: __ Bar</p>
				</div> */}
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
