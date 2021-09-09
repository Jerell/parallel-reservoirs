import DataTable from './data/dataTable';
import DashSection from './dashSection';
import Button from '../buttons/button';
import NumberInput from '../numberInput';
import styles from './snapshot.module.css';
import { useState, useRef } from 'react';
import fetch from 'node-fetch';
import LoadingBar from 'react-top-loading-bar';

const InputSection = ({ children, classes = '' }) => {
	return <div className={`relative flex flex-col ${classes}`}>{children}</div>;
};

const Snapshot = ({ hoverColumn, setHoverColumn }) => {
	const [inletQ, setInletQ] = useState(0);
	const [inletT, setInletT] = useState(0);
	const [hmP, setHmP] = useState(0);
	const [hnP, setHnP] = useState(0);
	const [lxP, setLxP] = useState(0);

	const ref: any = useRef(null);

	const [datasets, setDatasets] = useState<any[]>([]);

	async function requestSnapshot() {
		ref.current.continuousStart();

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

		const data = await response.json();
		console.log(data);
		if (!data.length) return [];

		const reshapeResponse = () => {
			if (!data.keyPoints) return [];

			const reshaped = Object.keys(data.keyPoints).map((key) => {
				const point = data.keyPoints[key];
				return {
					name: key,
					pressure: point.pressure ? point.pressure._pascal : 0,
					temperature: point.temperature ? point.temperature._kelvin : 0,
					flowrate: point.flowrate ? point.flowrate._kgps : 0,
				};
			});

			return reshaped;
		};

		const dataForTable = reshapeResponse();
		console.log(dataForTable);
		setDatasets([...datasets, dataForTable]);
	}

	return (
		<>
			<DashSection heading='snapshot'>
				<div className='grid grid-cols-8 bg-pace-grey'>
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
					</div>
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
