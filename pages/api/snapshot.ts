import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { Parser } from 'ccs-sim';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const dir = path.resolve('./public');

	const parser = new Parser();
	parser.readFile(path.join(dir, 'whole.yml'));
	await parser.build();
	const keyPoints = parser.keyPoints;

	res.status(200).json({
		keyPoints: keyPoints.reduce((acc, point) => {
			acc[point.name] = point.type;
			return acc;
		}, {}),
	});
};
