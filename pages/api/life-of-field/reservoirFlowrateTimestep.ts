import type { NextApiRequest, NextApiResponse } from 'next';
import protect from '@/public/utils/api/protect';
import checkSubset from '@/public/utils/checkSubset';
import pressureToMass from '@/public/utils/api/pressureToMass';
import massToPressure from '@/public/utils/api/massToPressure';

function validateRequest(
	body: {
		HM?: number;
		HN?: number;
		LX?: number;
	},
	res: NextApiResponse
) {
	const reservoirs = ['HM', 'HN', 'LX'];
	const bodyReservoirKeys = Object.keys(body).filter((k) => k !== 'days');
	const bodyReservoirInfo = bodyReservoirKeys.reduce(
		(acc, key) => {
			acc[key] = body[key];
			return acc;
		},
		{} as {
			[reservoir: string]: {
				pressure: number;
				flowrate: number;
			};
		}
	);

	if (!Object.keys(body).includes('days')) {
		res.status(400).json({
			response: `Invalid request: request body does not include number of days`,
		});
	}

	if (!checkSubset(bodyReservoirKeys, reservoirs)) {
		res.status(400).json({
			response: `Invalid request: body keys do not include valid reservoirs (${reservoirs.join(
				', '
			)})`,
		});
	}

	if (
		!Object.values(bodyReservoirInfo).every((info) => {
			return (
				typeof info === 'object' &&
				info.pressure &&
				info.flowrate &&
				typeof info.pressure === 'number' &&
				typeof info.flowrate === 'number'
			);
		})
	) {
		res.status(400).json({
			response: `Invalid request: request body must specify pressure and flowrate for each reservoir`,
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
	validateRequest(body, res);
	if (res.statusCode === 400) return;

	const seconds = 60 * 60 * 24 * body.days;

	const newMasses = Object.entries(
		body as {
			[reservoir: string]: {
				pressure: number;
				flowrate: number;
			};
		}
	).reduce((acc, [key, info]) => {
		if (key === 'days') return acc;
		const mass = {
			old: pressureToMass(info.pressure, key),
			new: seconds * info.flowrate,
		};
		acc[key] = massToPressure[key]((mass.old as number) + mass.new);
		return acc;
	}, {});

	// const pressures = await fetch('/api/life-of-field/reservoirMassToPressure');

	res.status(200).json({ seconds, ...newMasses });
};
