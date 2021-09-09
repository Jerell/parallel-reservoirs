import type { NextApiRequest, NextApiResponse } from 'next';
import { Reservoir } from 'ccs-sim';
import {
	Pressure,
	PressureUnits,
	Temperature,
	TemperatureUnits,
	Flowrate,
	FlowrateUnits,
} from 'physical-quantities';
import protect from '@/public/utils/api/protect';
import sum from '@/public/utils/sum';
import checkSubset from '@/public/utils/checkSubset';

const genericResPressureFunc = (coefs: number[]) => (mass: number) => {
	return new Pressure(
		sum(coefs.map((coef, i) => coef * mass ** i)),
		PressureUnits.Bara
	);
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

function validateMassRequest(
	body: {
		HM?: number;
		HN?: number;
		LX?: number;
	},
	res: NextApiResponse
) {
	const reservoirs = ['HM', 'HN', 'LX'];

	if (!checkSubset(Object.keys(body), reservoirs)) {
		res.status(400).json({
			response: `Invalid request: body keys do not include valid reservoirs (${reservoirs.join(
				', '
			)})`,
		});
	}

	if (!Object.values(body).every((val) => typeof val === 'number')) {
		res.status(400).json({
			response: `Invalid request: body values are not all numeric`,
		});
	}
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await protect(req, res);
	if (res.statusCode === 401) return;

	if (req.method !== 'POST') {
		res.status(400).send({ message: 'Only POST requests allowed' });
		return;
	}

	const body = JSON.parse(req.body);

	validateMassRequest(body, res);
	if (res.statusCode === 400) return;

	const pressures = Object.entries(body).reduce((acc, [key, value]) => {
		acc[key] = massToPressure[key](value);
		return acc;
	}, {});

	res.status(200).json(pressures);
};
