import { Pressure, PressureUnits } from 'physical-quantities';
import sum from '@/public/utils/sum';

const genericResPressureFunc =
	(coefs: number[]) =>
	(mass: number, asBara = false) => {
		const p = new Pressure(
			sum(coefs.map((coef, i) => coef * mass ** i)),
			PressureUnits.Bara
		);
		return asBara ? p.bara : p;
	};

const massToPressure = {
	HM: genericResPressureFunc([
		4.23479637, 4.03128187e-9, -8.53661996e-20, 8.51195441e-31, -3.04373551e-42,
	]),
	HN: genericResPressureFunc([
		4.3772189, 5.58185243e-9, -1.67965284e-19, 2.31321814e-30, -1.09337098e-41,
	]),
	LX: genericResPressureFunc([
		6.65789476, 4.89875978e-9, -1.20961397e-19, 1.31958662e-30, -4.03678013e-42,
	]),
};

export default massToPressure;
