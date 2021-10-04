import { useState, useEffect } from 'react';
import {
	Pressure,
	PressureUnits,
	Temperature,
	TemperatureUnits,
	Flowrate,
	FlowrateUnits,
} from 'physical-quantities';

const UnitSelect = ({ type, selectUnit }) => {
	let options;
	switch (type) {
		case 'pressure':
			options = ['bar', 'Pa'];
			break;
		case 'temperature':
			options = ['°C', 'K'];
			break;
		case 'flowrate':
			options = ['MTPA', 'kg/s'];
			break;
		case 'length':
			options = ['m', 'km', 'mm'];
			break;
		case 'lof':
			options = ['months', 'weeks'];
			break;
		default:
			options = ['unit1', 'unit2'];
	}
	useEffect(() => {
		selectUnit(options[0]);
	}, []);
	return (
		<div className='inline-flex'>
			<label htmlFor='unit' className='sr-only'>
				Unit
			</label>
			<select
				name='unit'
				className='outline-none bg-green-50'
				onChange={(e) => selectUnit(e.target.value)}
			>
				{options.map((o, i) => (
					<option key={i}>{o}</option>
				))}
			</select>
		</div>
	);
};

interface INIProps {
	label: string;
	labelClasses?: string;
	required?: boolean;
	unit?: string;
	unitListType?: string;
	unitLeft?: boolean;
	min?: number;
	fn?: (n) => void;
	unitFn?: (u) => void;
	placeholder?: number;
	step?: number;
}

const NumberInput = ({
	label,
	labelClasses,
	required = false,
	unit,
	unitListType,
	unitLeft = false,
	min = 0,
	fn = (n) => {},
	unitFn = (u) => {},
	placeholder = 0,
	step = 0.1,
}: INIProps) => {
	const [unitSelection, selectUnit] = useState('');
	const [inputValue, setInputValue] = useState(placeholder);
	const [convertedValue, setConvertedValue] = useState(placeholder);

	function convert(inputValue) {
		switch (unitSelection) {
			case 'bar':
				return new Pressure(inputValue, PressureUnits.Bara).bara;
			case 'Pa':
				return new Pressure(inputValue, PressureUnits.Pascal).bara;
			case '°C':
				return new Temperature(inputValue, TemperatureUnits.Celsius).celsius;
			case 'K':
				return new Temperature(inputValue, TemperatureUnits.Kelvin).celsius;
			case 'kg/s':
				return new Flowrate(inputValue, FlowrateUnits.Kgps).kgps;
			case 'MTPA':
				return new Flowrate(inputValue, FlowrateUnits.MTPA).kgps;
			default:
				return inputValue;
		}
	}

	function handleChange(event) {
		setInputValue(Number(event.target.value));
	}

	function handleUnitChange(u) {
		selectUnit(u);
		unitFn(u);
	}

	useEffect(() => {
		setConvertedValue(convert(inputValue));
	}, [inputValue]);

	useEffect(() => {
		setConvertedValue(convert(inputValue));
	}, [inputValue, unitSelection]);

	useEffect(() => {
		fn(convertedValue);
	}, [convertedValue]);

	return (
		<>
			<label
				htmlFor={label}
				className={`text-right mr-2 ${labelClasses ? labelClasses : ''}`}
			>
				{label}
				{required && <span className='text-red-500'>*</span>}
			</label>
			<div
				className={`w-full inline-flex border border-green-300 focus-within:ring-green-100 focus-within:ring focus-within:border-green-500 ${
					unitLeft ? '' : 'flex-row-reverse'
				}`}
			>
				{unit && <span className='inline-flex mx-1'>{unit}</span>}
				{unitListType && (
					<UnitSelect
						type={unitListType}
						selectUnit={handleUnitChange}
					></UnitSelect>
				)}
				<input
					type='number'
					min={min}
					name={label}
					className={`w-1 focus:outline-none flex-grow h- ${
						unitLeft ? 'pl-2' : 'text-right'
					}`}
					onChange={handleChange}
					placeholder={`${placeholder}`}
					step={step}
				/>
			</div>
		</>
	);
};

export default NumberInput;
