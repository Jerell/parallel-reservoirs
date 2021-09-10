import {
	PressureUnits,
	TemperatureUnits,
	FlowrateUnits,
} from 'physical-quantities';

const defaultUnits = {
	pressure: PressureUnits.Bara,
	temperature: TemperatureUnits.Celsius,
	flowrate: FlowrateUnits.MTPA,
};

const getDefaultUnitLabel = (variable) => {
	const pressure = () => {
		let unit = '';
		switch (defaultUnits.pressure) {
			case PressureUnits.Bara:
				unit = 'bar';
				break;
			case PressureUnits.Pascal:
				unit = 'Pa';
				break;
			default:
				return `Pressure`;
		}
		return `Pressure (${unit})`;
	};

	const temperature = () => {
		let unit = '';
		switch (defaultUnits.temperature) {
			case TemperatureUnits.Celsius:
				unit = '°C';
				break;
			case TemperatureUnits.Kelvin:
				unit = 'K';
				break;
			default:
				return `Temperature`;
		}
		return `Temperature (${unit})`;
	};

	const flowrate = () => {
		let unit = '';
		switch (defaultUnits.flowrate) {
			case FlowrateUnits.Kgps:
				unit = 'kg/s';
				break;
			case FlowrateUnits.MTPA:
				unit = 'MTPA';
				break;
			default:
				return `Flowrate`;
		}
		return `Flowrate (${unit})`;
	};

	switch (variable) {
		case 'pressure':
			return pressure();
		case 'temperature':
			return temperature();
		case 'flowrate':
			return flowrate();
		default:
			return variable;
	}
};

export default getDefaultUnitLabel;
