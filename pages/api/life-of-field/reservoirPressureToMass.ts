import type { NextApiRequest, NextApiResponse } from 'next';
import protect from '@/public/utils/api/protect';
import checkSubset from '@/public/utils/checkSubset';
import pressureToMass from '@/public/utils/api/pressureToMass';

function validateRequest(
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
	validateRequest(body, res);
	if (res.statusCode === 400) return;

	const masses = Object.entries(
		body as {
			[reservoir: string]: number;
		}
	).reduce((acc, [key, value]) => {
		acc[key] = pressureToMass(Number(value), key);
		return acc;
	}, {});

	res.status(200).json(masses);
};
