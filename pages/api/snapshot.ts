import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { Parser } from 'ccs-sim';
import { getSession } from 'next-auth/client';

async function protect(req: NextApiRequest, res: NextApiResponse) {
	const session = await getSession({ req });
	if (session) {
		// Signed in
		console.log('Session', JSON.stringify(session, null, 2));
	} else {
		res.status(401).json({ response: 'not authorized' });
	}
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await protect(req, res);
	if (res.statusCode === 401) return;

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
