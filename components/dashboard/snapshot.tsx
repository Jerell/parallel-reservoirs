import DataTable from './data/dataTable';
import DashSection from './dashSection';
import Button from '../buttons/button';
import NumberInput from '../numberInput';
import styles from './snapshot.module.css';
import { useState } from 'react';

const InputSection = ({ children, classes = '' }) => {
	return <div className={`relative flex flex-col ${classes}`}>{children}</div>;
};

const Snapshot = ({ hoverColumn, setHoverColumn }) => {
	const [inletQ, setInletQ] = useState(0);
	const [inletT, setInletT] = useState(0);
	const [hmP, setHmP] = useState(0);
	const [hnP, setHnP] = useState(0);
	const [lxP, setLxP] = useState(0);

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
					<div className='col-span-full flex flex-row justify-center p-4'>
						<Button />
					</div>
				</div>
			</DashSection>

			<DataTable hoverColumn={hoverColumn} setHoverColumn={setHoverColumn} />
		</>
	);
};

export default Snapshot;
