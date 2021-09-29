import DashSection from './dashSection';
import Button from '../buttons/button';
import NumberInput from '../numberInput';
import snapshotStyles from './snapshot.module.css';
import styles from './lifeOfField.module.css';
import { useState, useRef, useEffect } from 'react';
import fetch from 'node-fetch';
import LoadingBar from 'react-top-loading-bar';
import Heading from '../heading';
import Graphs from '@/components/dashboard/data/graphs';
import { transformToPTQRows } from '@/public/utils/api/reshapeLifeOfField';
import DateSelect from '../dateSelect';
import { daysApart, weeksApart, monthsApart } from '@/public/utils/timeApart';

const InputSection = ({ children, classes = '' }) => {
	return (
		<div className={`relative px-2 flex flex-col ${classes}`}>{children}</div>
	);
};

const IntervalButton = ({
	num,
	label,
	fn = () => {},
}: {
	num: number;
	label: string;
	fn?: () => void;
}) => {
	const isDisabled = num > 1000;
	return (
		<Button
			fn={() => {
				if (isDisabled) return;
				fn();
			}}
			additionalClasses={`${styles.timeStep}`}
			text={`${num} ${label}`}
			disabled={isDisabled}
		/>
	);
};

const LifeOfField = ({ hoverColumn, setHoverColumn }) => {
	const [inletQ, setInletQ] = useState(0);
	const [inletT, setInletT] = useState(0);
	const [hmP, setHmP] = useState(0);
	const [hnP, setHnP] = useState(0);
	const [lxP, setLxP] = useState(1);

	const [hmWells, setHmWells] = useState(4);
	const [hnWells, setHnWells] = useState(2);
	const [lxWells, setLxWells] = useState(2);

	const statusRef: any = useRef(null);
	const [requestFailed, setRequestFailed] = useState(false);
	const [datasets, setDatasets] = useState<any[]>([]);

	const [startDate, setStartDate] = useState(new Date('2024-06-01'));
	const [endDate, setEndDate] = useState(new Date('2025-06-01'));

	const [days, setDays] = useState(0);
	const [weeks, setWeeks] = useState(0);
	const [months, setMonths] = useState(0);

	useEffect(() => {
		setDays(daysApart(startDate, endDate));
		setWeeks(weeksApart(startDate, endDate));
		setMonths(monthsApart(startDate, endDate));
	}, [startDate, endDate]);

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
			wellOptions: {
				split: {
					HM: hmWells,
					HN: hnWells,
					LX: lxWells,
				},
			},
		};
	};

	const tryQuery = async (url: string) => {
		const query = await fetch(url);
		return await query.json();
	};

	const pollingRef = useRef<any>();

	async function requestLifeOfField(timestep: number, steps: number) {
		statusRef.current.continuousStart();
		setRequestFailed(false);

		const reqBody = getReqBody(timestep, steps);
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
					<InputSection classes={`col-start-1`}>
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
					<InputSection classes={`col-start-3`}>
						<NumberInput
							label='Wells'
							labelClasses='text-white'
							placeholder={hmWells}
							step={1}
							fn={setHmWells}
						/>
					</InputSection>
					<InputSection classes={`col-start-4`}>
						<NumberInput
							label='Reservoir Pressure'
							labelClasses='text-white'
							unitListType='pressure'
							fn={setHmP}
						/>
					</InputSection>
					<InputSection classes={`col-start-5`}>
						<NumberInput
							label='Wells'
							labelClasses='text-white'
							placeholder={hnWells}
							step={1}
							fn={setHnWells}
						/>
					</InputSection>
					<InputSection classes={`col-start-6`}>
						<NumberInput
							label='Reservoir Pressure'
							labelClasses='text-white'
							unitListType='pressure'
							fn={setHnP}
						/>
					</InputSection>
					<InputSection classes={`col-start-7`}>
						<NumberInput
							label='Wells'
							labelClasses='text-white'
							placeholder={lxWells}
							step={1}
							fn={setLxWells}
						/>
					</InputSection>
					<InputSection classes={`col-start-8`}>
						<NumberInput
							label='Reservoir Pressure'
							labelClasses='text-white'
							unitListType='pressure'
							fn={setLxP}
						/>
					</InputSection>
					<div className='col-span-full flex flex-col justify-center items-center p-4'>
						{requestFailed && (
							<Heading level={6} additionalClasses='mt-2 text-red-400'>
								Request failed
							</Heading>
						)}
						<div className='m-2 flex flex-row justify-end'>
							<DateSelect
								label='Start'
								labelClasses='text-white w-10'
								placeholder={startDate}
								fn={setStartDate}
							/>
						</div>
						<div className='m-2 flex flex-row justify-end'>
							<DateSelect
								label='End'
								labelClasses='text-white w-10'
								placeholder={endDate}
								fn={setEndDate}
							/>
						</div>
						<Heading level={6} additionalClasses='mt-2 text-white'>
							Select interval
						</Heading>
						<div className='flex flex-row justify-center mt-2'>
							<IntervalButton
								num={days}
								label={'days'}
								fn={() => requestLifeOfField(1, days)}
							/>
							<IntervalButton
								num={weeks}
								label={'weeks'}
								fn={() => requestLifeOfField(7, weeks)}
							/>
							<IntervalButton
								num={months}
								label={'months'}
								fn={() => requestLifeOfField(30, months)}
							/>
						</div>
						<LoadingBar color='#39304A' ref={statusRef} height={10} />
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
					startDate={startDate}
				/>
			))}
		</>
	);
};

export default LifeOfField;
