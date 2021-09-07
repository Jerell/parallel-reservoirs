import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { Diverging } from 'ccs-sim';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const dir = path.resolve('./public');

	const parser = new Diverging.Parser();
	parser.readFile(path.join(dir, 'whole.yml'));
	await parser.build();
	const keyPoints = parser.keyPoints;

	res.status(200).json({
		keyPoints: keyPoints.reduce((acc, point) => {
			console.log(point);
			acc[point.name] = 0;
			return acc;
		}, {}),
	});
};
